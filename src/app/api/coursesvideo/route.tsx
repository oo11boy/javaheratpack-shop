import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { CourseVideo } from '@/lib/Types/Types';
import { RowDataPacket } from 'mysql2/promise';

function generateETag(videos: CourseVideo[]): string {
  const dataString = JSON.stringify(videos, Object.keys(videos).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await getConnection();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseid');

    let query: string;
    let params: number[] = [];

    if (courseId) {
      query = `
        SELECT id, title, url, duration, description, isCompleted, courseid, place
        FROM videocourse
        WHERE courseid = ?
        ORDER BY place ASC
      `;
      params = [parseInt(courseId)];
    } else {
      query = `
        SELECT id, title, url, duration, description, isCompleted, courseid, place
        FROM videocourse
        ORDER BY courseid, place ASC
      `;
    }

    const [rows] = await connection.query<RowDataPacket[]>(query, params);

    const videos: CourseVideo[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      duration: row.duration || undefined,
      description: row.description || undefined,
      isCompleted: row.isCompleted || false,
      courseid: row.courseid,
      place: row.place,
    })).sort((a, b) => a.place - b.place);

    const etag = generateETag(videos);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(videos, {
      status: 200,
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate', // کش برای ۱ ساعت
      },
    });
  } catch (error) {
    console.error('خطا در دریافت ویدیوها:', error);
    return NextResponse.json({ error: 'خطا در دریافت داده‌ها' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}