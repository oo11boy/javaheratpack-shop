//api/courses/route.tsx
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { SimpleCourse } from '@/lib/Types/Types';
import { RowDataPacket } from 'mysql2/promise';

function generateETag(courses: SimpleCourse[]): string {
  const dataString = JSON.stringify(courses, Object.keys(courses).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(request: Request): Promise<NextResponse<SimpleCourse[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT id, title, description, duration, accessType, price, discountPrice, 
             introVideo, level, bannerImage, features, prerequisites, targetAudience, 
             category, thumbnail
      FROM courses
    `);
    await connection.end();

    const courses: SimpleCourse[] = rows.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration || '',
      accessType: course.accessType || null,
      price: parseFloat(course.price),
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : null,
      introVideo: course.introVideo || null,
      bannerImage: course.bannerImage || null,
      features: course.features ? course.features.split(',').sort() : [],
      prerequisites: course.prerequisites ? course.prerequisites.split(',').sort() : [],
      targetAudience: course.targetAudience ? course.targetAudience.split(',').sort() : [],
      category: course.category || '',
      thumbnail: course.thumbnail || null,
    }));

    const etag = generateETag(courses);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(courses, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'Vary': 'Accept-Encoding', // برای اطمینان از کش درست با فشرده‌سازی
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در دریافت لیست دوره‌ها' }, { status: 500 });
  }
}