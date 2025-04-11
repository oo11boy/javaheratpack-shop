// src\app\api\nemone\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface NemoneItem {
  id: number;
  src: string;
}

export async function GET(): Promise<NextResponse<NemoneItem[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, src FROM nemone ORDER BY id ASC'
    );
    await connection.end();

    const nemoneItems: NemoneItem[] = rows.map((row) => ({
      id: row.id,
      src: row.src,
    }));

    return NextResponse.json(nemoneItems, {
      headers: {
        'Cache-Control': 'no-store', // غیرفعال کردن کش
      },
    });
  } catch (error) {
    console.error('خطا در دریافت نمونه‌کارها:', error);
    return NextResponse.json({ error: 'خطا در دریافت نمونه‌کارها' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<{ id: number; message: string } | { error: string }>> {
  try {
    const body = await request.json();
    const { src } = body;

    if (!src) {
      return NextResponse.json({ error: 'آدرس تصویر الزامی است' }, { status: 400 });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      'INSERT INTO nemone (src) VALUES (?)',
      [src]
    );
    const insertId = (result as any).insertId;
    await connection.end();

    return NextResponse.json(
      { id: insertId, message: 'نمونه‌کار با موفقیت ثبت شد' },
      { status: 201 }
    );
  } catch (error) {
    console.error('خطا در ثبت نمونه‌کار:', error);
    return NextResponse.json({ error: 'خطا در ثبت نمونه‌کار' }, { status: 500 });
  }
}


export const revalidate = 0; // غیرفعال کردن ISR