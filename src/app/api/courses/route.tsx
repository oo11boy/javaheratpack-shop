// app/api/courses/route.tsx
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { SimpleCourse } from '@/lib/Types/Types';


export async function GET(): Promise<NextResponse<SimpleCourse[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT id, title, description, duration, accessType, price, discountPrice, 
             introVideo, bannerImage, features, prerequisites, targetAudience, 
             category, thumbnail
      FROM courses
    `);
    await connection.end();

    const courses: SimpleCourse[] = (rows as any[]).map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration || '',
      accessType: course.accessType || null,
      price: parseFloat(course.price),
      discountPrice: course.discountPrice ? parseFloat(course.discountPrice) : null,
      introVideo: course.introVideo || null,
      bannerImage: course.bannerImage || null,
      features: course.features ? course.features.split(',') : [],
      prerequisites: course.prerequisites ? course.prerequisites.split(',') : [],
      targetAudience: course.targetAudience ? course.targetAudience.split(',') : [],
      category: course.category || '',
      thumbnail: course.thumbnail || null,
    }));

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در دریافت لیست دوره‌ها' }, { status: 500 });
  }
}