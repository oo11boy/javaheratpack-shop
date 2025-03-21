import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

// تنظیمات کوکی
const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true, // جلوگیری از دسترسی جاوااسکریپت به کوکی
  secure: process.env.NODE_ENV === 'production', // فقط در HTTPS (در تولید)
  sameSite: 'strict' as const, // جلوگیری از CSRF
  maxAge: 24 * 60 * 60, // 24 ساعت (هماهنگ با زمان انقضای توکن)
  path: '/', // در دسترس کل برنامه
};

// GET: بررسی ایمیل یا گرفتن اطلاعات کاربر
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = req.cookies.get(COOKIE_NAME)?.value;

    const connection = await getConnection();

    if (email) {
      const [rows] = await connection.execute(
        'SELECT COUNT(*) as count FROM accounts WHERE email = ?',
        [email]
      );
      await connection.end();
      const exists = (rows as any[])[0].count > 0;
      return NextResponse.json({ exists }, { headers: { 'Cache-Control': 'no-store' } });
    } else if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      const [userRows] = await connection.execute(
        'SELECT name, email, phonenumber, courseid FROM accounts WHERE id = ?',
        [decoded.id]
      );
      const user = (userRows as any[])[0];

      if (!user) {
        await connection.end();
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      interface PurchasedCourse {
        id: number;
        title: string;
        duration: string;
        thumbnail: string | null;
        progress: number;
      }
      let purchasedCourses: PurchasedCourse[] = [];
      if (user.courseid) {
        let courseIds: string[];
        try {
          courseIds = JSON.parse(user.courseid);
        } catch (e) {
          courseIds = user.courseid.split(',').map((id: string) => id.trim());
        }

        if (courseIds.length > 0) {
          const [courseRows] = await connection.execute(
            `SELECT id, title, duration, thumbnail
             FROM courses
             WHERE id IN (${courseIds.map(() => '?').join(',')})`,
            courseIds
          );
          purchasedCourses = (courseRows as any[]).map(course => ({
            id: course.id,
            title: course.title,
            duration: course.duration || '0:00',
            thumbnail: course.thumbnail || null,
            progress: 0,
          }));
        }
      }

      await connection.end();

      const userData = {
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber || null,
        avatar: 'https://picsum.photos/150?random=1',
        purchasedCourses,
      };

      return NextResponse.json(userData);
    } else {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: ورود یا ثبت‌نام
export async function POST(req: NextRequest) {
  try {
    const { email, password, name, lastname, phonenumber } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const connection = await getConnection();
    const [users] = await connection.execute(
      'SELECT * FROM accounts WHERE email = ?',
      [email]
    );
    const userArray = users as any[];

    const response = NextResponse.json({ redirect: '/useraccount' });

    if (userArray.length > 0) {
      const user = userArray[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        await connection.end();
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '24h' });
      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    } else {
      if (!name || !lastname) {
        await connection.end();
        return NextResponse.json({ error: 'Name and lastname required' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        'INSERT INTO accounts (email, name, lastname, password, phonenumber, vip, courseid) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, name, lastname, hashedPassword, phonenumber || null, 0, null]
      );

      const newUserId = (result as any).insertId;
      const token = jwt.sign({ id: newUserId, email }, JWT_SECRET, { expiresIn: '24h' });
      response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    }

    await connection.end();
    return response;
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT: تغییر رمز عبور
export async function PUT(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Token, current password, and new password required' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const connection = await getConnection();
    const [users] = await connection.execute(
      'SELECT password FROM accounts WHERE id = ?',
      [decoded.id]
    );
    const user = (users as any[])[0];

    if (!user) {
      await connection.end();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      await connection.end();
      return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      'UPDATE accounts SET password = ? WHERE id = ?',
      [hashedNewPassword, decoded.id]
    );

    await connection.end();
    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}