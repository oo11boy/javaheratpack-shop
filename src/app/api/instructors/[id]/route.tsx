// src\app\api\instructors\[id]\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { Instructor } from '@/lib/Types/Types';
import { RowDataPacket } from 'mysql2/promise';

function generateETag(instructor: Instructor): string {
  const dataString = JSON.stringify(instructor, Object.keys(instructor).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Instructor | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT id, name, title, bio, avatar, heroImage, phone, telegram, whatsapp, instagram
      FROM instructors
      WHERE id = ?
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'مدرس یافت نشد' }, { status: 404 });
    }

    const instructor: Instructor = {
      id: rows[0].id,
      name: rows[0].name,
      title: rows[0].title,
      bio: rows[0].bio || '',
      avatar: rows[0].avatar || '',
      heroImage: rows[0].heroImage || '',
      phone: rows[0].phone || '',
      telegram: rows[0].telegram || '',
      whatsapp: rows[0].whatsapp || '',
      instagram: rows[0].instagram || '',
    };

    const etag = generateETag(instructor);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(instructor, {
      status: 200,
      headers: {
        'ETag': etag,
        'Cache-Control': 'no-store', // غیرفعال کردن کش برای اطمینان از داده تازه
      },
    });
  } catch (error) {
    console.error('خطا در دریافت اطلاعات مدرس:', error);
    return NextResponse.json({ error: 'خطا در دریافت داده‌ها' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Instructor | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;

  try {
    const body = await request.json();
    const { name, title, bio, avatar, heroImage, phone, telegram, whatsapp, instagram } = body;

    if (!name || !title) {
      return NextResponse.json({ error: 'نام و عنوان الزامی هستند' }, { status: 400 });
    }

    connection = await getConnection();

    const query = `
      UPDATE instructors
      SET name = ?, title = ?, bio = ?, avatar = ?, heroImage = ?, phone = ?, telegram = ?, whatsapp = ?, instagram = ?
      WHERE id = ?
    `;

    const [result] = await connection.execute(query, [
      name,
      title,
      bio || '',
      avatar || '',
      heroImage || '',
      phone || '',
      telegram || '',
      whatsapp || '',
      instagram || '',
      id,
    ]);

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return NextResponse.json({ error: 'مدرس یافت نشد' }, { status: 404 });
    }

    const [rows] = await connection.query<RowDataPacket[]>(
      `
      SELECT id, name, title, bio, avatar, heroImage, phone, telegram, whatsapp, instagram
      FROM instructors
      WHERE id = ?
    `,
      [id]
    );

    const updatedInstructor: Instructor = {
      id: rows[0].id,
      name: rows[0].name,
      title: rows[0].title,
      bio: rows[0].bio || '',
      avatar: rows[0].avatar || '',
      heroImage: rows[0].heroImage || '',
      phone: rows[0].phone || '',
      telegram: rows[0].telegram || '',
      whatsapp: rows[0].whatsapp || '',
      instagram: rows[0].instagram || '',
    };

    const etag = generateETag(updatedInstructor);
    return NextResponse.json(updatedInstructor, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('خطا در به‌روزرسانی اطلاعات مدرس:', error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی داده‌ها' }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export const revalidate = 0; // غیرفعال کردن ISR