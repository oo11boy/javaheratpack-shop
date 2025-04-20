import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

interface VerificationCode extends RowDataPacket {
  code: string;
  expires_at: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { identifier, code, isPhone } = await req.json();

    if (!identifier || !code) {
      return NextResponse.json({ error: "شناسه و کد الزامی است" }, { status: 400 });
    }

    const connection = await getConnection();
    const field = isPhone ? "phonenumber" : "email";
    const [rows] = await connection.execute<VerificationCode[]>(
      `SELECT code, expires_at FROM verification_codes WHERE ${field} = ? ORDER BY created_at DESC LIMIT 1`,
      [identifier]
    );

    if (rows.length === 0) {
      await connection.end();
      return NextResponse.json({ error: "کد تأیید یافت نشد" }, { status: 400 });
    }

    const storedCode = rows[0];
    if (storedCode.expires_at < new Date()) {
      await connection.end();
      return NextResponse.json({ error: "کد تأیید منقضی شده است" }, { status: 400 });
    }

    if (storedCode.code !== code) {
      await connection.end();
      return NextResponse.json({ error: "کد تأیید نامعتبر است" }, { status: 400 });
    }

    // ذخیره کد تأیید به عنوان تأیید شده (یا می‌توانید آن را حذف کنید)
    await connection.execute(
      `UPDATE verification_codes SET verified = true WHERE ${field} = ? AND code = ?`,
      [identifier, code]
    );

    await connection.end();
    return NextResponse.json({ message: "کد تأیید شد" });
  } catch (error) {
    console.error("Verify forgot password code error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}