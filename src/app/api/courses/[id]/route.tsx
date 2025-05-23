import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { Course } from '@/lib/Types/Types';
import { RowDataPacket } from 'mysql2/promise';
import { revalidatePath } from 'next/cache';

function generateETag(course: Course): string {
  const dataString = JSON.stringify(course, Object.keys(course).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Course | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const connection = await getConnection();

    const [courseRows] = await connection.execute<RowDataPacket[]>(`
      SELECT c.*, 
             i.id AS instructor_id, 
             i.name AS instructor_name, 
             i.title AS instructor_title, 
             i.bio AS instructor_bio, 
             i.avatar AS instructor_avatar, 
             i.heroImage AS instructor_heroImage, 
             i.phone AS instructor_phone, 
             i.telegram AS instructor_telegram, 
             i.whatsapp AS instructor_whatsapp, 
             i.instagram AS instructor_instagram
      FROM courses c
      LEFT JOIN instructors i ON c.instructorID = i.id
      WHERE c.id = ?
    `, [id]);

    if (courseRows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'دوره یافت نشد' }, { status: 404 });
    }

    const course = courseRows[0];

    const [syllabusRows] = await connection.execute<RowDataPacket[]>(`
      SELECT title, description
      FROM syllabus
      WHERE courseID = ?
    `, [id]);

    await connection.end();

    const courseDetails: Course = {
      id: course.id,
      title: course.title,
      description: course.description,
      instructor: {
        id: course.instructor_id || 0,
        name: course.instructor_name || 'نامشخص',
        title: course.instructor_title || '',
        bio: course.instructor_bio || '',
        avatar: course.instructor_avatar || '',
        heroImage: course.instructor_heroImage || '',
        phone: course.instructor_phone || '',
        telegram: course.instructor_telegram || '',
        whatsapp: course.instructor_whatsapp || '',
        instagram: course.instructor_instagram || '',
      },
      duration: course.duration || '',
      accessType: course.accessType || '',
      price: parseFloat(course.price),
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : undefined,
      introVideo: course.introVideo || '',
      level: course.level || '',
      bannerImage: course.bannerImage || '',
      syllabus: syllabusRows
        .map((item) => ({ title: item.title, description: item.description }))
        .sort((a, b) => a.title.localeCompare(b.title)),
      features: course.features ? course.features.split(',').sort() : [],
      prerequisites: course.prerequisites ? course.prerequisites.split(',').sort() : [],
      targetAudience: course.targetAudience ? course.targetAudience.split(',').sort() : [],
      category: course.category || '',
      thumbnail: course.thumbnail || '',
      name: course.title,
      courseLink: `/StudyRoom/${course.id}`,
    };

    const etag = generateETag(courseDetails);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(courseDetails, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در دریافت جزئیات دوره' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const connection = await getConnection();

    // تنظیم مقادیر پیش‌فرض
    const price = data.price !== undefined && data.price !== null ? Number(data.price) : 0; // اطمینان از مقدار معتبر برای price
    const discountPrice = data.discountPrice !== undefined && data.discountPrice !== null ? Number(data.discountPrice) : null; // اختیاری بودن discountPrice

    const params = [
      data.title || null,
      data.description || null,
      data.duration || null,
      data.accessType || null,
      price, // استفاده از مقدار معتبر price
      discountPrice, // استفاده از مقدار اختیاری discountPrice
      data.introVideo || null,
      data.level || null,
      data.bannerImage || null,
      data.features ? data.features.join(",") : null,
      data.prerequisites ? data.prerequisites.join(",") : null,
      data.targetAudience ? data.targetAudience.join(",") : null,
      data.category || null,
      data.thumbnail || null,
      data.instructorID !== undefined && data.instructorID !== null ? data.instructorID : null,
      id,
    ];

    await connection.execute(
      `UPDATE courses SET 
        title = ?, description = ?, duration = ?, accessType = ?, price = ?, discountPrice = ?, 
        introVideo = ?, level = ?, bannerImage = ?, features = ?, prerequisites = ?, 
        targetAudience = ?, category = ?, thumbnail = ?, instructorID = ?
      WHERE id = ?`,
      params
    );

    await connection.end();

    revalidatePath('/courselist', 'page');
    return NextResponse.json({ message: 'دوره با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی دوره' }, { status: 500 });
  }
}