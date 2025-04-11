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
  author: string;
  summary: string;
  content: string;
  heroImage: string;
}

function generateETag(article: Article): string {
  const dataString = JSON.stringify(article, Object.keys(article).sort());
  return createHash('md5').update(dataString).digest('hex');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Article | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, title, excerpt, category, read_time, thumbnail, date, author, summary, content, hero_image
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
      excerpt: rows[0].excerpt || '',
      category: rows[0].category || '',
      readTime: rows[0].read_time || '5 دقیقه',
      thumbnail: rows[0].thumbnail || 'https://picsum.photos/300/200',
      date: rows[0].date || new Date().toLocaleDateString('fa-IR'),
      author: rows[0].author || 'نویسنده ناشناس',
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Article | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await request.json();
    const { title, excerpt, category, readTime, thumbnail, date, author, summary, content, heroImage } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'عنوان و محتوا الزامی هستند' }, { status: 400 });
    }

    const connection = await getConnection();
    const [result] = await connection.execute(
      `
      UPDATE articles
      SET title = ?, excerpt = ?, category = ?, read_time = ?, thumbnail = ?, date = ?, author = ?, summary = ?, content = ?, hero_image = ?
      WHERE id = ?
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
        id,
      ]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'مقاله یافت نشد' }, { status: 404 });
    }

    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, title, excerpt, category, read_time, thumbnail, date, author, summary, content, hero_image
      FROM articles
      WHERE id = ?
    `,
      [id]
    );
    await connection.end();

    const updatedArticle: Article = {
      id: rows[0].id.toString(),
      title: rows[0].title,
      excerpt: rows[0].excerpt || '',
      category: rows[0].category || '',
      readTime: rows[0].read_time || '5 دقیقه',
      thumbnail: rows[0].thumbnail || 'https://picsum.photos/300/200',
      date: rows[0].date || new Date().toLocaleDateString('fa-IR'),
      author: rows[0].author || 'نویسنده ناشناس',
      summary: rows[0].summary || '',
      content: rows[0].content || '',
      heroImage: rows[0].hero_image || 'https://picsum.photos/1200/600',
    };

    const etag = generateETag(updatedArticle);
    return NextResponse.json(updatedArticle, {
      headers: {
        'ETag': etag,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
      },
    });
  } catch (error) {
    console.error('خطا در ویرایش مقاله:', error);
    return NextResponse.json({ error: 'خطا در ویرایش مقاله' }, { status: 500 });
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
      DELETE FROM articles
      WHERE id = ?
    `,
      [id]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'مقاله یافت نشد' }, { status: 404 });
    }

    await connection.end();
    return NextResponse.json({ message: 'مقاله با موفقیت حذف شد' }, { status: 200 });
  } catch (error) {
    console.error('خطا در حذف مقاله:', error);
    return NextResponse.json({ error: 'خطا در حذف مقاله' }, { status: 500 });
  }
}

export const revalidate = 3600;