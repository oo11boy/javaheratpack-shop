import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2/promise";

interface VerificationCode extends RowDataPacket {
  verified: boolean;
}

export async function POST(req: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | null = null;

  try {
    const { identifier, newPassword, isPhone } = await req.json();

    // اعتبارسنجی ورودی
    if (!identifier || !newPassword) {
      return NextResponse.json({ error: "شناسه و رمز عبور جدید الزامی است" }, { status: 400 });
    }

    connection = await getConnection();
    const field = isPhone ? "phonenumber" : "email"; // اصلاح نام ستون

    // بررسی وجود کاربر
    const [userRows] = await connection.execute(
      `SELECT id FROM accounts WHERE ${field} = ?`,
      [identifier]
    );
    if ((userRows as any[]).length === 0) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    // بررسی اینکه کد تأیید شده است
    const [codeRows] = await connection.execute<VerificationCode[]>(
      `SELECT verified FROM verification_codes WHERE ${field} = ? ORDER BY created_at DESC LIMIT 1`,
      [identifier]
    );
    if (codeRows.length === 0 || !codeRows[0].verified) {
      return NextResponse.json({ error: "کد تأیید معتبر نیست یا تأیید نشده است" }, { status: 400 });
    }

    // به‌روزرسانی رمز عبور
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      `UPDATE accounts SET password = ? WHERE ${field} = ?`,
      [hashedPassword, identifier]
    );

    // حذف کدهای تأیید مرتبط
    await connection.execute(`DELETE FROM verification_codes WHERE ${field} = ?`, [identifier]);

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}