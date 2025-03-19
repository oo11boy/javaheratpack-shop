// app/api/instructors/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

interface Instructor {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  heroImage: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}

export async function GET(request: NextRequest) {
  let connection;

  try {
    connection = await getConnection();

    const query = `
      SELECT id, name, title, bio, avatar, heroImage, phone, telegram, whatsapp, instagram
      FROM instructors
      LIMIT 1  -- فرضاً فقط یک مدرس داریم
    `;

    const [rows]: [any[], any] = await connection.query(query);

    if (rows.length === 0) {
      return NextResponse.json({ error: "مدرس یافت نشد" }, { status: 404 });
    }

    const instructor: Instructor = {
      id: rows[0].id,
      name: rows[0].name,
      title: rows[0].title,
      bio: rows[0].bio || "",
      avatar: rows[0].avatar || "",
      heroImage: rows[0].heroImage || "",
      phone: rows[0].phone || "",
      telegram: rows[0].telegram || "",
      whatsapp: rows[0].whatsapp || "",
      instagram: rows[0].instagram || "",
    };

    return NextResponse.json(instructor, { status: 200 });
  } catch (error) {
    console.error("خطا در دریافت اطلاعات مدرس:", error);
    return NextResponse.json(
      { error: "خطا در دریافت داده‌ها" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}