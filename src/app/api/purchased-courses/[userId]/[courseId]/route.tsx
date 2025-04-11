// src\app\api\purchased-courses\[userId]\[courseId]\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; courseId: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const resolvedParams = await params;
  const { userId, courseId } = resolvedParams;

  let connection;
  try {
    connection = await getConnection();
    const [userRows] = await connection.execute<RowDataPacket[]>(
      'SELECT courseid FROM accounts WHERE id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    const user = userRows[0];
    const courseIds = user.courseid ? user.courseid.split(',').map((id: string) => id.trim()) : [];
    const courseIdToRemove = courseId;

    if (!courseIds.includes(courseIdToRemove)) {
      await connection.end();
      return NextResponse.json({ error: 'دوره در لیست خریدهای کاربر نیست' }, { status: 404 });
    }

    const updatedCourseIds = courseIds.filter((id: string) => id !== courseIdToRemove).join(',');
    const [result] = await connection.execute<ResultSetHeader>(
      'UPDATE accounts SET courseid = ? WHERE id = ?',
      [updatedCourseIds || null, userId]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'خطا در به‌روزرسانی کاربر' }, { status: 500 });
    }

    await connection.end();
    return NextResponse.json({ message: 'دوره با موفقیت از خریدهای کاربر حذف شد' }, { status: 200 });
  } catch (error) {
    console.error('خطا در حذف دوره:', error);
    return NextResponse.json({ error: 'خطا در حذف دوره' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export const revalidate = 0;