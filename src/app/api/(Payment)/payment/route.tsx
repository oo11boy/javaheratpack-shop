// src\app\api\(Payment)\payment\route.tsx
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ZIBAL_MERCHANT = "zibal"; // حساب تستی زیبال
const ZIBAL_REQUEST_URL = "https://gateway.zibal.ir/v1/request";
const CALLBACK_URL = process.env.NEXT_PUBLIC_API_URL+'/callback'; // مسیر جدید Callback
const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

// درخواست پرداخت
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const { courseIds, totalAmount } = await req.json();

    if (!courseIds || !totalAmount) {
      return NextResponse.json({ error: "اطلاعات سبد خرید ناقص است" }, { status: 400 });
    }

    const paymentRequest = {
      merchant: ZIBAL_MERCHANT,
      amount: totalAmount * 10, // تبدیل به ریال
      callbackUrl: CALLBACK_URL,
      description: `پرداخت برای دوره‌های ${courseIds.join(",")}`,
      orderId: `ORDER-${Date.now()}-${decoded.id}-${courseIds.join(",")}`, // شامل آیدی کاربر و دوره‌ها
    };

    const response = await fetch(ZIBAL_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentRequest),
    });

    const result = await response.json();
    if (result.result !== 100) {
      return NextResponse.json({ error: result.message || "خطا در درخواست پرداخت" }, { status: 500 });
    }

    return NextResponse.json({ paymentUrl: `https://gateway.zibal.ir/start/${result.trackId}` });
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}