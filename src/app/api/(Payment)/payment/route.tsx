import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getConnection } from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";

const ZIBAL_MERCHANT = "680fa5ba6f3803000d83edcb";
const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const CALLBACK_URL = process.env.NEXT_PUBLIC_API_URL + "/callback";
const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const { courseIds, totalAmount } = await req.json();

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: "اطلاعات سبد خرید ناقص است" }, { status: 400 });
    }

    // اعتبارسنجی قیمت‌ها
    const connection = await getConnection();
    const placeholders = courseIds.map(() => "?").join(",");
    const [courseRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id, price, discountPrice FROM courses WHERE id IN (${placeholders})`,
      courseIds
    );

    // محاسبه مجموع قیمت دوره‌های غیررایگان
    const calculatedTotal = courseRows.reduce((sum, course) => {
      if (course.price === 0) return sum; // دوره‌های رایگان نادیده گرفته می‌شوند
      return sum + (course.discountPrice ? course.discountPrice : course.price);
    }, 0);

    // اعمال تخفیف‌های پکیج
    const paidCoursesCount = courseRows.filter((course) => course.price > 0).length;
    const packageDiscount = paidCoursesCount === 2 ? 0.1 : paidCoursesCount >= 3 ? 0.2 : 0;
    const expectedTotal = calculatedTotal * (1 - packageDiscount);

    // بررسی مطابقت totalAmount
    if (Math.abs(totalAmount - expectedTotal) > 0.01) {
      await connection.end();
      return NextResponse.json(
        { error: "مبلغ ارسالی با قیمت دوره‌ها مطابقت ندارد" },
        { status: 400 }
      );
    }

    await connection.end();

    const paymentRequest = {
      merchant: ZIBAL_MERCHANT,
      amount: totalAmount * 10, // تبدیل به ریال
      callbackUrl: CALLBACK_URL,
      description: `پرداخت برای دوره‌های ${courseIds.join(",")}`,
      orderId: `ORDER-${Date.now()}-${decoded.id}-${courseIds.join(",")}`,
    };

    const response = await fetch(ZIBAL_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentRequest),
    });

    const result = await response.json();
    if (result.result !== 100) {
      return NextResponse.json(
        { error: result.message || "خطا در درخواست پرداخت" },
        { status: 500 }
      );
    }

    return NextResponse.json({ paymentUrl: `https://gateway.zibal.ir/start/${result.trackId}` });
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}