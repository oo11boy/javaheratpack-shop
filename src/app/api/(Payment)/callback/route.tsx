import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const ZIBAL_MERCHANT = "zibal";
const ZIBAL_VERIFY_URL = "https://gateway.zibal.ir/v1/verify";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const success = searchParams.get("success") === "1";
    const trackId = searchParams.get("trackId");
    const orderId = searchParams.get("orderId");

    if (!trackId || !orderId) {
      return NextResponse.redirect(
        `http://localhost:3000/PurchaseFailure?error=${encodeURIComponent("اطلاعات پرداخت ناقص است")}`
      );
    }

    if (!success) {
      return NextResponse.redirect(
        `http://localhost:3000/PurchaseFailure?error=${encodeURIComponent("پرداخت ناموفق بود")}`
      );
    }

    // تأیید پرداخت
    const verifyResponse = await fetch(ZIBAL_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ merchant: ZIBAL_MERCHANT, trackId }),
    });

    const verifyResult = await verifyResponse.json();
    if (verifyResult.result !== 100) {
      return NextResponse.redirect(
        `http://localhost:3000/PurchaseFailure?error=${encodeURIComponent(verifyResult.message || "خطا در تأیید پرداخت")}`
      );
    }

    // استخراج اطلاعات از orderId
    const [_, timestamp, userId, courseIdsStr] = orderId.split("-");
    const userIdNum = parseInt(userId, 10);
    const newCourseIds = courseIdsStr.split(",").map(Number);

    // به‌روزرسانی دیتابیس
    const connection = await getConnection();
    const [userRows] = await connection.execute<RowDataPacket[]>(
      "SELECT courseid FROM accounts WHERE id = ?",
      [userIdNum]
    );

    const user = userRows[0];
    const existingCourses = user.courseid ? user.courseid.split(",").map(Number) : [];
    const updatedCourses = [...new Set([...existingCourses, ...newCourseIds])].join(",");

    await connection.execute<ResultSetHeader>(
      "UPDATE accounts SET courseid = ? WHERE id = ?",
      [updatedCourses, userIdNum]
    );

    await connection.end();

    // هدایت به صفحه موفقیت با اطلاعات داینامیک
    const purchaseDate = new Date(parseInt(timestamp)).toLocaleString("fa-IR");
    const totalAmount = verifyResult.amount / 10; // تبدیل از ریال به تومان
    return NextResponse.redirect(
      `http://localhost:3000/PurchaseSuccess?orderId=${orderId}&purchaseDate=${encodeURIComponent(
        purchaseDate
      )}&totalAmount=${totalAmount}&courseIds=${courseIdsStr}`
    );
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      `http://localhost:3000/PurchaseFailure?error=${encodeURIComponent("خطا در سرور")}`
    );
  }
}