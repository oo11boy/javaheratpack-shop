// src\app\api\admin\dashboard\route.tsx
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";
const COOKIE_NAME = "auth_token";

interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  totalArticles: number;

  totalComments: number;

}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const connection = await getConnection();

    // بررسی اینکه کاربر ادمین است
    const [userRows] = await connection.execute<RowDataPacket[]>(
      "SELECT vip FROM accounts WHERE id = ?",
      [decoded.id]
    );
    if (userRows.length === 0 || userRows[0].vip !== 1) {
      await connection.end();
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // تعداد کاربران
    const [users] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM accounts");
    const totalUsers = users[0].count;

    // تعداد دوره‌ها
    const [courses] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM courses");
    const totalCourses = courses[0].count;

    // تعداد مقالات
    const [articles] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM articles");
    const totalArticles = articles[0].count;


    // تعداد نظرات (فرض بر این است که جدول comments وجود دارد)
    const [comments] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM comments");
    const totalComments = comments[0].count;


    await connection.end();

    const dashboardData: DashboardData = {
      totalUsers,
      totalCourses,
      totalArticles,
   
      totalComments,
    
    };

    return NextResponse.json(dashboardData, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}