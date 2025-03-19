// app/api/courses/[id]/route.tsx
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { Course } from '@/lib/Types/Types';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<Course | { error: string }>> {
  const { id } = params;

  try {
    const connection = await getConnection();

    // دریافت اطلاعات دوره و مدرس
    const [courseRows] = await connection.execute(`
      SELECT c.*, i.name AS instructor_name, i.bio AS instructor_bio, i.avatar AS instructor_avatar
      FROM courses c
      LEFT JOIN instructors i ON c.instructorID = i.id
      WHERE c.id = ?
    `, [id]);

    if (courseRows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'دوره یافت نشد' }, { status: 404 });
    }

    const course = (courseRows as any[])[0];

    // دریافت سرفصل‌ها
    const [syllabusRows] = await connection.execute(`
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
        name: course.instructor_name || 'نامشخص',
        bio: course.instructor_bio || '',
        avatar: course.instructor_avatar || '',
      },
      duration: course.duration || '',
      accessType: course.accessType || '',
      price: parseFloat(course.price),
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : undefined,
      introVideo: course.introVideo || '',
      bannerImage: course.bannerImage || '',
      syllabus: (syllabusRows as any[]).map((item) => ({
        title: item.title,
        description: item.description,
      })),
      features: course.features ? course.features.split(',') : [],
      prerequisites: course.prerequisites ? course.prerequisites.split(',') : [],
      targetAudience: course.targetAudience ? course.targetAudience.split(',') : [],
      category: course.category || '',
      thumbnail: course.thumbnail || '',
    };

    return NextResponse.json(courseDetails);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در دریافت جزئیات دوره' }, { status: 500 });
  }
}