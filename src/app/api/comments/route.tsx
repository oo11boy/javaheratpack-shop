// src\app\api\comments\route.tsx
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

export async function GET(request: NextRequest): Promise<NextResponse<Comment[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, article_id, author, text, date, status
      FROM comments
      ORDER BY created_at DESC
    `
    );
    await connection.end();

    const comments: Comment[] = rows.map((row) => ({
      id: row.id,
      article_id: row.article_id,
      author: row.author,
      text: row.text,
      date: row.date,
      status: row.status,
    }));

    return NextResponse.json(comments, {
      headers: {
        'Cache-Control': 'no-store', // غیرفعال کردن کش
      },
    });
  } catch (error) {
    console.error('خطا در دریافت کامنت‌ها:', error);
    return NextResponse.json({ error: 'خطا در دریافت کامنت‌ها' }, { status: 500 });
  }
}

export const revalidate = 0;