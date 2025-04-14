import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getConnection } from "@/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth_token")?.value;
    console.log("Received token:", token);
    if (!token) {
      return NextResponse.json({ error: "لطفاً ابتدا وارد شوید" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    } catch (jwtError) {
      console.error("JWT Error:", jwtError);
      return NextResponse.json({ error: "توکن نامعتبر است" }, { status: 401 });
    }

    const { courseIds } = await req.json();
    console.log("Received courseIds:", courseIds);
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: "اطلاعات دوره‌ها ناقص است" }, { status: 400 });
    }

    const connection = await getConnection();
    const placeholders = courseIds.map(() => "?").join(",");
    const [courseRows] = await connection.execute<RowDataPacket[]>(
      `SELECT id, price, title FROM courses WHERE id IN (${placeholders})`,
      courseIds
    );
    console.log("Found courses:", courseRows);

    // بررسی وجود همه دوره‌ها
    if (courseRows.length !== courseIds.length) {
      const foundIds = courseRows.map((course) => course.id);
      const missingIds = courseIds.filter((id) => !foundIds.includes(id));
      await connection.end();
      return NextResponse.json(
        { error: `دوره‌هایی با آیدی‌های ${missingIds.join(", ")} یافت نشدند` },
        { status: 404 }
      );
    }

    // بررسی اینکه همه دوره‌ها رایگان هستند
    const invalidCourses = courseRows.filter((course) => {
      // تبدیل price به عدد برای مقایسه
      const price = parseFloat(course.price);
      return price !== 0;
    });
    if (invalidCourses.length > 0) {
      const invalidTitles = invalidCourses.map((course) => course.title).join(", ");
      await connection.end();
      return NextResponse.json(
        { error: `دوره‌های ${invalidTitles} رایگان نیستند` },
        { status: 400 }
      );
    }

    const [userRows] = await connection.execute<RowDataPacket[]>(
      "SELECT courseid FROM accounts WHERE id = ?",
      [decoded.id]
    );
    console.log("User data:", userRows);

    const user = userRows[0];
    const existingCourses = user.courseid ? user.courseid.split(",").map(Number) : [];
    const updatedCourses = [...new Set([...existingCourses, ...courseIds])].join(",");

    await connection.execute<ResultSetHeader>(
      "UPDATE accounts SET courseid = ? WHERE id = ?",
      [updatedCourses, decoded.id]
    );

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Free course registration error:", error);
    return NextResponse.json({ error: "خطا در سرور" }, { status: 500 });
  }
}