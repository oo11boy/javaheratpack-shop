// app/api/coursevideos/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { CourseVideo } from "@/lib/Types/Types";

// متد GET برای دریافت ویدیوها
export async function GET(request: NextRequest) {
  let connection;

  try {
    // دریافت اتصال به دیتابیس
    connection = await getConnection();

    // دریافت پارامتر courseid از query string (اختیاری)
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseid");

    let query: string;
    let params: any[] = [];

    if (courseId) {
      // اگر courseid مشخص شده باشد، فقط ویدیوهای آن دوره را برگردان
      query = `
        SELECT id, title, url, duration, description, isCompleted, courseid, place
        FROM  videocourse
        WHERE courseid = ?
        ORDER BY place ASC
      `;
      params = [parseInt(courseId)];
    } else {
      // اگر courseid مشخص نشده باشد، همه ویدیوها را برگردان
      query = `
        SELECT id, title, url, duration, description, isCompleted, courseid, place
        FROM  videocourse
        ORDER BY courseid, place ASC
      `;
    }

    // اجرای کوئری
    const [rows]: [any[], any] = await connection.query(query, params);

    // تبدیل نتایج به نوع CourseVideo
    const videos: CourseVideo[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      duration: row.duration || undefined,
      description: row.description || undefined,
      isCompleted: row.is_completed || false,
      courseid: row.courseid,
      place: row.place,
    }));

    // پاسخ با موفقیت
    return NextResponse.json(videos, { status: 200 });
  } catch (error) {
    console.error("خطا در دریافت ویدیوها:", error);
    return NextResponse.json(
      { error: "خطا در دریافت داده‌ها" },
      { status: 500 }
    );
  } finally {
    // بستن اتصال اگر لازم باشد
    if (connection) {
      await connection.end();
    }
  }
}