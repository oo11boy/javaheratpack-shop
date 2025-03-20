import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { Instructor } from '@/lib/Types/Types';
import { RowDataPacket } from 'mysql2/promise';

function generateETag(instructor: Instructor): string {
  const dataString = JSON.stringify(instructor, Object.keys(instructor).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT id, name, title, bio, avatar, heroImage, phone, telegram, whatsapp, instagram
      FROM instructors
      LIMIT 1
    `;

    const [rows] = await connection.query<RowDataPacket[]>(query);

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
        'Cache-Control': 'public, max-age=3600, must-revalidate',
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