import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { createHash } from 'crypto';
import { RowDataPacket } from 'mysql2';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  thumbnail: string;
  date: string;
}

interface NewArticle {
  title: string;
  excerpt: string;
  category: string | null;
  readTime: string | null;
  thumbnail: string;
  date: string;
  author: string;
  summary: string;
  content: string;
  heroImage: string;
}

function generateETag(articles: Article[]): string {
  const dataString = JSON.stringify(articles, Object.keys(articles).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(request: Request): Promise<NextResponse<Article[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(`
      SELECT id, title, excerpt, category, read_time, thumbnail, date
      FROM articles
    `);
    await connection.end();

    const articles: Article[] = rows.map((article) => ({
      id: article.id.toString(),
      title: article.title,
      excerpt: article.excerpt || '',
      category: article.category || '',
      readTime: article.read_time || '5 دقیقه',
      thumbnail: article.thumbnail || 'https://picsum.photos/300/200',
      date: article.date || new Date().toLocaleDateString('fa-IR'),
    }));

    const etag = generateETag(articles);
    const ifNoneMatch = request.headers.get('If-None-Match');

    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers: { 'ETag': etag } });
    }

    return NextResponse.json(articles, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    console.error('خطا در دریافت لیست مقالات:', error);
    return NextResponse.json({ error: 'خطا در دریافت لیست مقالات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<{ id: string; message: string } | { error: string }>> {
  try {
    const body: NewArticle = await request.json();
    const { title, excerpt, category, readTime, thumbnail, date, author, summary, content, heroImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان و محتوا الزامی هستند' }, { status: 400 });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      `
      INSERT INTO articles (title, excerpt, category, read_time, thumbnail, date, author, summary, content, hero_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        title,
        excerpt || null,
        category || null,
        readTime || null,
        thumbnail || 'https://picsum.photos/300/200',
        date || new Date().toISOString().split('T')[0],
        author || 'نویسنده ناشناس',
        summary || null,
        content,
        heroImage || 'https://picsum.photos/1200/600',
      ]
    );

    const insertId = (result as any).insertId;
    await connection.end();

    return NextResponse.json(
      { id: insertId.toString(), message: 'مقاله با موفقیت ثبت شد' },
      { status: 201 }
    );
  } catch (error) {
    console.error('خطا در ثبت مقاله:', error);
    return NextResponse.json({ error: 'خطا در ثبت مقاله' }, { status: 500 });
  }
}

export const revalidate = 3600;