// src\app\api\comments\[id]\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Comment {
  id: number;
  article_id: number;
  author: string;
  text: string;
  date: string;
  status: 'active' | 'inactive';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Comment | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json({ error: 'وضعیت نامعتبر است' }, { status: 400 });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      `
      UPDATE comments
      SET status = ?
      WHERE id = ?
    `,
      [status, id]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'کامنت یافت نشد' }, { status: 404 });
    }

    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, article_id, author, text, date, status
      FROM comments
      WHERE id = ?
    `,
      [id]
    );
    await connection.end();

    const updatedComment: Comment = {
      id: rows[0].id,
      article_id: rows[0].article_id,
      author: rows[0].author,
      text: rows[0].text,
      date: rows[0].date,
      status: rows[0].status,
    };

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error('خطا در تغییر وضعیت کامنت:', error);
    return NextResponse.json({ error: 'خطا در تغییر وضعیت کامنت' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `
      DELETE FROM comments
      WHERE id = ?
    `,
      [id]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'کامنت یافت نشد' }, { status: 404 });
    }

    await connection.end();
    return NextResponse.json({ message: 'کامنت با موفقیت حذف شد' }, { status: 200 });
  } catch (error) {
    console.error('خطا در حذف کامنت:', error);
    return NextResponse.json({ error: 'خطا در حذف کامنت' }, { status: 500 });
  }
}

export const revalidate = 0;