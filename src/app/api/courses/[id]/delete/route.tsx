import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { ResultSetHeader } from 'mysql2/promise';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction(); // شروع تراکنش

    // حذف ویدیوها
    await connection.execute('DELETE FROM videocourse WHERE courseId = ?', [id]);

    // حذف سرفصل‌ها
    await connection.execute('DELETE FROM syllabus WHERE courseID = ?', [id]);

    // حذف دوره
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM courses WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      throw new Error('دوره‌ای با این شناسه یافت نشد');
    }

    await connection.commit(); // تأیید تراکنش

    revalidatePath('/courselist', 'page');
    revalidatePath('/courselist/[id]', 'page');

    return NextResponse.json({ message: 'دوره و اطلاعات مرتبط با موفقیت حذف شدند' });
  } catch (error) {
    if (connection) await connection.rollback(); // لغو تراکنش در صورت خطا
    console.error('خطا در حذف دوره:', error);
    return NextResponse.json({ error: 'خطا در حذف دوره' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}