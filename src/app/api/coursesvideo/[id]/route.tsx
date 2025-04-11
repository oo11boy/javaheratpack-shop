import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const connection = await getConnection();
    await connection.execute(
      `UPDATE videocourse SET place = ?, title = ?, url = ?, duration = ?, description = ?, courseId = ? WHERE id = ?`,
      [data.place, data.title, data.url, data.duration, data.description, data.courseId, id]
    );
    await connection.end();
    return NextResponse.json({ message: 'ویدیو با موفقیت به‌روزرسانی شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی ویدیو' }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const connection = await getConnection();
    await connection.execute('DELETE FROM videocourse WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ message: 'ویدیو با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در حذف ویدیو' }, { status: 500 });
  }
}