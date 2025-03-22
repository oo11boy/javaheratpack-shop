import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

const COOKIE_NAME = 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60,
  path: '/',
};

// تعریف تایپ‌ها
interface User extends RowDataPacket {
  id: number;
  email: string;
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

// GET: بررسی ایمیل یا گرفتن اطلاعات کاربر
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const connection = await getConnection();

    if (email) {
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM accounts WHERE email = ?',
        [email]
      );
      await connection.end();
      const exists = rows[0].count > 0;
      return NextResponse.json(
        { exists },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    } else if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      const [userRows] = await connection.execute<User[]>(
        'SELECT id, name, lastname, email, phonenumber, courseid FROM accounts WHERE id = ?',
        [decoded.id]
      );
      const user = userRows[0];

      if (!user) {
        await connection.end();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
        );
      }

      let courseid: PurchasedCourse[] = [];
      if (user.courseid) {
        const courseIds = user.courseid.split(',').map(id => id.trim()).filter(id => id !== '');
        if (courseIds.length > 0) {
          const [courseRows] = await connection.execute<Course[]>(
            `SELECT id, title, duration, thumbnail
             FROM courses
             WHERE id IN (${courseIds.map(() => '?').join(',')})`,
            courseIds
          );
          courseid = courseRows.map(course => ({
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
        id: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        phonenumber: user.phonenumber || null,
        courseid, // تغییر نام متغیر به courseid برای سازگاری
      };

      return NextResponse.json(
        userData,
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    } else {
      return NextResponse.json(
        { error: 'Token required' },
        { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
    );
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
    const [users] = await connection.execute<User[]>(
      'SELECT * FROM accounts WHERE email = ?',
      [email]
    );

    const response = NextResponse.json({ redirect: '/useraccount' });

    if (users.length > 0) {
      const user = users[0];
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
      const [result] = await connection.execute<ResultSetHeader>(
        'INSERT INTO accounts (email, name, lastname, password, phonenumber, vip, courseid) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, name, lastname, hashedPassword, phonenumber || null, 0, null]
      );

      const newUserId = result.insertId;
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
    const [users] = await connection.execute<User[]>(
      'SELECT password FROM accounts WHERE id = ?',
      [decoded.id]
    );
    const user = users[0];

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
    await connection.execute<ResultSetHeader>(
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