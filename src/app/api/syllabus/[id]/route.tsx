import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const connection = await getConnection();
    await connection.execute(
      `UPDATE syllabus SET title = ?, description = ?, courseID = ? WHERE id = ?`,
      [data.title, data.description, data.courseID, id]
    );
    await connection.end();
    return NextResponse.json({ message: 'سرفصل با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی سرفصل' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM syllabus WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ message: 'سرفصل با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در حذف سرفصل' }, { status: 500 });
  }
}