import { NextRequest, NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

const COOKIE_NAME = "auth_token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 24 * 60 * 60,
  path: "/",
};

interface User extends RowDataPacket {
  id: number;
  email: string | null;
  name: string;
  lastname: string;
  password: string;
  phonenumber: string | null;
  vip: number;
  courseid: string | null;
}

interface Course extends RowDataPacket {
  id: number;
  title: string;
  duration: string;
  thumbnail: string | null;
}

interface PurchasedCourse {
  id: number;
  title: string;
  duration: string;
  thumbnail: string | null;
  progress: number;
}

export async function GET(req: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | null = null;

  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("identifier");
    const email = searchParams.get("email");
    const phoneNumber = searchParams.get("phoneNumber");
    const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

    connection = await getConnection();

    // بررسی ایمیل و شماره موبایل برای ثبت‌نام
    if (email && phoneNumber) {
      const [emailRows] = await connection.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM accounts WHERE email = ?",
        [email]
      );
      const [phoneRows] = await connection.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM accounts WHERE phonenumber = ?",
        [phoneNumber]
      );

      return NextResponse.json({
        emailExists: emailRows[0].count > 0,
        phoneExists: phoneRows[0].count > 0,
      });
    }

    // بررسی وجود یک شناسه (ایمیل یا شماره موبایل)
    if (identifier) {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const field = isEmail ? "email" : "phonenumber";
      const [rows] = await connection.execute<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM accounts WHERE ${field} = ?`,
        [identifier]
      );
      const exists = rows[0].count > 0;
      return NextResponse.json({ exists });
    }

    // دریافت اطلاعات کاربر با توکن
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; identifier: string };
    const [userRows] = await connection.execute<User[]>(
      "SELECT id, name, lastname, email, phonenumber, courseid, vip FROM accounts WHERE id = ?",
      [decoded.id]
    );
    const user = userRows[0];

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let courseid: PurchasedCourse[] = [];
    if (user.courseid) {
      const courseIds = user.courseid.split(",").map((id) => id.trim()).filter((id) => id !== "");
      if (courseIds.length > 0) {
        const [courseRows] = await connection.execute<Course[]>(
          `SELECT id, title, duration, thumbnail FROM courses WHERE id IN (${courseIds.map(() => "?").join(",")})`,
          courseIds
        );
        courseid = courseRows.map((course) => ({
          id: course.id,
          title: course.title,
          duration: course.duration || "0:00",
          thumbnail: course.thumbnail || null,
          progress: 0,
        }));
      }
    }

    const userData = {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email || null,
      phonenumber: user.phonenumber || null,
      vip: user.vip,
      courseid,
    };

    return NextResponse.json(userData, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(req: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | null = null;

  try {
    const { identifier, password, name, lastname, phonenumber, email, courseId, action } = await req.json();

    connection = await getConnection();

    if (action === "add_to_cart" && courseId) {
      const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
      }

      if (!courseId) {
        return NextResponse.json({ error: "Course ID required" }, { status: 400 });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; identifier: string };
      const [userRows] = await connection.execute<User[]>(
        "SELECT courseid FROM accounts WHERE id = ?",
        [decoded.id]
      );
      const user = userRows[0];

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const courseIds = user.courseid ? user.courseid.split(",").map((id) => id.trim()) : [];
      if (!courseIds.includes(courseId.toString())) {
        courseIds.push(courseId.toString());
        const updatedCourseIds = courseIds.join(",");

        await connection.execute<ResultSetHeader>(
          "UPDATE accounts SET courseid = ? WHERE id = ?",
          [updatedCourseIds, decoded.id]
        );
      }

      return NextResponse.json({ message: "Course added to cart successfully" }, { status: 200 });
    }

    if (!identifier || !password) {
      return NextResponse.json({ error: "Identifier and password required" }, { status: 400 });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const field = isEmail ? "email" : "phonenumber";
    const [users] = await connection.execute<User[]>(
      `SELECT * FROM accounts WHERE ${field} = ?`,
      [identifier]
    );

    const response = NextResponse.json({ redirect: "/useraccount" });

    if (users.length > 0) {
      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = jwt.sign({ id: user.id, identifier }, JWT_SECRET, { expiresIn: "24h" });
      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    } else {
      if (!name || !lastname || !email || !phonenumber) {
        return NextResponse.json(
          { error: "نام، نام خانوادگی، ایمیل و شماره موبایل الزامی است" },
          { status: 400 }
        );
      }

      // اعتبارسنجی ایمیل و شماره تلفن
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "ایمیل معتبر نیست" }, { status: 400 });
      }
      if (!/^09[0-9]{9}$/.test(phonenumber)) {
        return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
      }

      // بررسی وجود ایمیل یا شماره تلفن در دیتابیس
      const [existingUsers] = await connection.execute<RowDataPacket[]>(
        "SELECT COUNT(*) as count, email, phonenumber FROM accounts WHERE email = ? OR phonenumber = ?",
        [email, phonenumber]
      );
      if (existingUsers[0].count > 0) {
        if (existingUsers[0].email === email) {
          return NextResponse.json({ error: "این ایمیل قبلاً ثبت شده است" }, { status: 400 });
        }
        if (existingUsers[0].phonenumber === phonenumber) {
          return NextResponse.json({ error: "این شماره موبایل قبلاً ثبت شده است" }, { status: 400 });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute<ResultSetHeader>(
        "INSERT INTO accounts (email, name, lastname, password, phonenumber, vip, courseid) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [email, name, lastname, hashedPassword, phonenumber, 0, null]
      );

      const newUserId = result.insertId;
      const token = jwt.sign({ id: newUserId, identifier }, JWT_SECRET, { expiresIn: "24h" });
      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    }

    return response;
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function PUT(req: NextRequest) {
  let connection: Awaited<ReturnType<typeof getConnection>> | null = null;

  try {
    const { currentPassword, newPassword, newName, newLastname, newEmail, newPhonenumber, action } = await req.json();
    const token = req.cookies.get(COOKIE_NAME)?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; identifier: string };
    connection = await getConnection();

    if (action === "changePassword") {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Current password and new password required" }, { status: 400 });
      }

      // اعتبارسنجی طول رمز عبور جدید
      if (newPassword.length < 8) {
        return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
      }

      const [users] = await connection.execute<User[]>(
        "SELECT password FROM accounts WHERE id = ?",
        [decoded.id]
      );
      const user = users[0];

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: "Invalid current password" }, { status: 401 });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await connection.execute<ResultSetHeader>(
        "UPDATE accounts SET password = ? WHERE id = ?",
        [hashedNewPassword, decoded.id]
      );

      return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } else if (action === "updateProfile") {
      const updates: string[] = [];
      const values: any[] = [];

      if (newName) {
        if (newName.length < 2) {
          return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
        }
        updates.push("name = ?");
        values.push(newName);
      }

      if (newLastname) {
        if (newLastname.length < 2) {
          return NextResponse.json({ error: "Lastname must be at least 2 characters" }, { status: 400 });
        }
        updates.push("lastname = ?");
        values.push(newLastname);
      }

      if (newEmail) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
          return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }
        const [emailCheck] = await connection.execute<RowDataPacket[]>(
          "SELECT COUNT(*) as count FROM accounts WHERE email = ? AND id != ?",
          [newEmail, decoded.id]
        );
        if (emailCheck[0].count > 0) {
          return NextResponse.json({ error: "This email is already in use" }, { status: 400 });
        }
        updates.push("email = ?");
        values.push(newEmail);
      }

      if (newPhonenumber) {
        if (!/^09[0-9]{9}$/.test(newPhonenumber)) {
          return NextResponse.json({ error: "Invalid phonenumber format" }, { status: 400 });
        }
        const [phoneCheck] = await connection.execute<RowDataPacket[]>(
          "SELECT COUNT(*) as count FROM accounts WHERE phonenumber = ? AND id != ?",
          [newPhonenumber, decoded.id]
        );
        if (phoneCheck[0].count > 0) {
          return NextResponse.json({ error: "This phonenumber is already in use" }, { status: 400 });
        }
        updates.push("phonenumber = ?");
        values.push(newPhonenumber);
      }

      if (updates.length === 0) {
        return NextResponse.json({ error: "No updates provided" }, { status: 400 });
      }

      if (newEmail || newPhonenumber) {
        if (!currentPassword) {
          return NextResponse.json({ error: "Current password required for email or phonenumber update" }, { status: 400 });
        }

        const [users] = await connection.execute<User[]>(
          "SELECT password FROM accounts WHERE id = ?",
          [decoded.id]
        );
        const user = users[0];

        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
          return NextResponse.json({ error: "Invalid current password" }, { status: 401 });
        }
      }

      values.push(decoded.id);
      const query = `UPDATE accounts SET ${updates.join(", ")} WHERE id = ?`;

      await connection.execute<ResultSetHeader>(query, values);

      const newToken = jwt.sign(
        { id: decoded.id, identifier: newEmail || newPhonenumber || decoded.identifier },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      const response = NextResponse.json({ message: "Profile updated successfully" }, { status: 200 });
      response.cookies.set(COOKIE_NAME, newToken, COOKIE_OPTIONS);

      return response;
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}