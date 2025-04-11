import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO syllabus (courseID, title, description) VALUES (?, ?, ?)`,
      [data.courseID, data.title, data.description]
    );
    await connection.end();
    return NextResponse.json({ id: (result as any).insertId, ...data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در افزودن سرفصل' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseid');

  if (!courseId) {
    return NextResponse.json({ error: 'courseId الزامی است' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM syllabus WHERE courseID = ? ORDER BY id`,
      [courseId]
    );
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('خطا در دریافت سرفصل‌ها:', error);
    return NextResponse.json({ error: 'خطا در دریافت سرفصل‌ها' }, { status: 500 });
  }
}