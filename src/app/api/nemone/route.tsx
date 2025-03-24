import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface NemoneItem {
  id: number;
  src: string;
}

export async function GET(): Promise<NextResponse<NemoneItem[] | { error: string }>> {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      "SELECT id, src FROM nemone ORDER BY id ASC"
    );
    await connection.end();

    const nemoneItems: NemoneItem[] = rows.map((row) => ({
      id: row.id,
      src: row.src,
    }));

    return NextResponse.json(nemoneItems, {
      headers: {
        "Cache-Control": "public, max-age=3600, must-revalidate", // کش 1 ساعته
      },
    });
  } catch (error) {
    console.error("خطا در دریافت نمونه‌کارها:", error);
    return NextResponse.json({ error: "خطا در دریافت نمونه‌کارها" }, { status: 500 });
  }
}