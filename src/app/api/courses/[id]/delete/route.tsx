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

  try {
    const connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM courses WHERE id = ?', [id]);
    await connection.end();

    if (result.affectedRows > 0) {
      revalidatePath('/courselist', 'page'); // بازسازی کش لیست دوره‌ها
      revalidatePath('/courselist/[id]', 'page'); // بازسازی کش صفحات داینامیک
    }

    return NextResponse.json({ message: 'دوره با موفقیت حذف شد' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'خطا در حذف دوره' }, { status: 500 });
  }
}