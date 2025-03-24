import { NextRequest, NextResponse } from 'next/server'; // تغییر به NextRequest
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { RowDataPacket } from 'mysql2';

interface Article {
  id: string;
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  heroImage: string;
}

function generateETag(article: Article): string {
  const dataString = JSON.stringify(article, Object.keys(article).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(
  request: NextRequest, // استفاده از NextRequest به جای Request
  { params }: { params: Promise<{ id: string }> } // تعریف params به صورت Promise
): Promise<NextResponse<Article | { error: string }>> {
  const resolvedParams = await params; // منتظر دریافت params
  const { id } = resolvedParams;

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, title, author, date, summary, content, hero_image
      FROM articles
      WHERE id = ?
    `,
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'مقاله یافت نشد' }, { status: 404 });
    }

    const article: Article = {
      id: rows[0].id.toString(),
      title: rows[0].title,
      author: rows[0].author || 'نویسنده ناشناس',
      date: rows[0].date || new Date().toLocaleDateString('fa-IR'),
      summary: rows[0].summary || '',
      content: rows[0].content || '',
      heroImage: rows[0].hero_image || 'https://picsum.photos/1200/600',
    };

    const etag = generateETag(article);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(article, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('خطا در دریافت مقاله:', error);
    return NextResponse.json({ error: 'خطا در دریافت مقاله' }, { status: 500 });
  }
}

export const revalidate = 3600;