import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface Comment {
  id: number;
  article_id: number;
  author: string;
  text: string;
  date: string;
  status: "active" | "inactive";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Comment[] | { error: string }>> {
  const resolvedParams = await params; // منتظر دریافت params
  const { id } = resolvedParams;

 

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      `
      SELECT id, article_id, author, text, date, status
      FROM comments
      WHERE article_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `,
      [id]
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
        "Cache-Control": "public, max-age=300, must-revalidate",
      },
    });
  } catch (error) {
    console.error("خطا در دریافت کامنت‌ها:", error);
    return NextResponse.json({ error: "خطا در دریافت کامنت‌ها" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const resolvedParams = await params; // منتظر دریافت params
  const { id } = resolvedParams;
  const { author, text } = await request.json();

 
  if (!author || !text) {
    return NextResponse.json({ error: "نام و متن کامنت الزامی است" }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const date = new Date().toLocaleDateString("fa-IR").replace(/\/\d{2}$/, "");

  
    await connection.execute(
      `
        INSERT INTO comments (article_id, author, text, date, status)
        VALUES (?, ?, ?, ?, 'inactive')
      `,
      [id, author, text, date]
    );
    await connection.end();

    return NextResponse.json({ message: "کامنت ثبت شد و در انتظار تأیید است" }, { status: 201 });
  } catch (error) {
    console.error("خطا در ثبت کامنت:", error);
    return NextResponse.json({ error: "خطا در ثبت کامنت" }, { status: 500 });
  }
}