// src\app\api\nemone\[id]\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { createHash } from 'crypto';

interface NemoneItem {
  id: number;
  src: string;
}

function generateETag(item: NemoneItem): string {
  const dataString = JSON.stringify(item, Object.keys(item).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<NemoneItem | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, src FROM nemone WHERE id = ?',
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'نمونه‌کار یافت نشد' }, { status: 404 });
    }

    const nemoneItem: NemoneItem = {
      id: rows[0].id,
      src: rows[0].src,
    };

    const etag = generateETag(nemoneItem);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(nemoneItem, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'no-store', // غیرفعال کردن کش
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('خطا در دریافت نمونه‌کار:', error);
    return NextResponse.json({ error: 'خطا در دریافت نمونه‌کار' }, { status: 500 });
  }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse<NemoneItem | { error: string }>> {
    const resolvedParams = await params;
    const { id } = resolvedParams;
  
    try {
      const body = await request.json();
      const { src } = body;
  
      if (!src) {
        return NextResponse.json({ error: 'آدرس تصویر الزامی است' }, { status: 400 });
      }
  
      const connection = await getConnection();
      const [result] = await connection.execute(
        'UPDATE nemone SET src = ? WHERE id = ?',
        [src, id]
      );
  
      const affectedRows = (result as any).affectedRows;
      if (affectedRows === 0) {
        await connection.end();
        return NextResponse.json({ error: 'نمونه‌کار یافت نشد' }, { status: 404 });
      }
  
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT id, src FROM nemone WHERE id = ?',
        [id]
      );
      await connection.end();
  
      const updatedItem: NemoneItem = {
        id: rows[0].id,
        src: rows[0].src,
      };
  
      return NextResponse.json(updatedItem);
    } catch (error) {
      console.error('خطا در ویرایش نمونه‌کار:', error);
      return NextResponse.json({ error: 'خطا در ویرایش نمونه‌کار' }, { status: 500 });
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
        'DELETE FROM nemone WHERE id = ?',
        [id]
      );
  
      const affectedRows = (result as any).affectedRows;
      if (affectedRows === 0) {
        await connection.end();
        return NextResponse.json({ error: 'نمونه‌کار یافت نشد' }, { status: 404 });
      }
  
      await connection.end();
      return NextResponse.json({ message: 'نمونه‌کار با موفقیت حذف شد' }, { status: 200 });
    } catch (error) {
      console.error('خطا در حذف نمونه‌کار:', error);
      return NextResponse.json({ error: 'خطا در حذف نمونه‌کار' }, { status: 500 });
    }
  }
  