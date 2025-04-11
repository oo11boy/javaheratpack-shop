// src\app\api\purchased-courses\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2/promise';

interface PurchasedCourse {
  userId: number;
  userName: string;
  userLastname: string;
  userEmail: string;
  userPhonenumber: string;
  courseId: number;
  courseTitle: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<PurchasedCourse[] | { error: string }>> {
  let connection;
  try {
    connection = await getConnection();
    const [userRows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, name, lastname, email, phonenumber, courseid FROM accounts WHERE courseid IS NOT NULL AND courseid != ""'
    );

    const purchasedCourses: PurchasedCourse[] = [];

    for (const user of userRows) {
      const courseIds = user.courseid.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id));
      if (courseIds.length > 0) {
        const [courseRows] = await connection.execute<RowDataPacket[]>(
          `SELECT id, title FROM courses WHERE id IN (${courseIds.map(() => '?').join(',')})`,
          courseIds
        );

        courseRows.forEach((course: any) => {
          purchasedCourses.push({
            userId: user.id,
            userName: user.name,
            userLastname: user.lastname,
            userEmail: user.email,
            userPhonenumber: user.phonenumber,
            courseId: course.id,
            courseTitle: course.title,
          });
        });
      }
    }

    await connection.end();
    return NextResponse.json(purchasedCourses, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('خطا در دریافت خریدها:', error);
    return NextResponse.json({ error: 'خطا در دریافت خریدها' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export const revalidate = 0;