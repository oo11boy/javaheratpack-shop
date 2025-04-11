// src\app\api\users\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  courseid: string | null;
  vip: number;
  phonenumber: string;
  password?: string;
}

// دریافت لیست همه کاربران
export async function GET(request: NextRequest): Promise<NextResponse<User[] | { error: string }>> {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, email, name, lastname, courseid, vip, phonenumber FROM accounts ORDER BY id ASC'
    );
    await connection.end();

    const users: User[] = rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      lastname: row.lastname,
      courseid: row.courseid,
      vip: row.vip,
      phonenumber: row.phonenumber,
    }));

    return NextResponse.json(users, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('خطا در دریافت کاربران:', error);
    return NextResponse.json({ error: 'خطا در دریافت کاربران' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// افزودن کاربر جدید
export async function POST(request: NextRequest): Promise<NextResponse<{ message: string } | { error: string }>> {
  let connection;
  try {
    const { email, name, lastname, phonenumber, password, vip } = await request.json();

    if (!email || !name || !lastname || !phonenumber || !password) {
      return NextResponse.json({ error: 'همه فیلدها الزامی هستند' }, { status: 400 });
    }

    connection = await getConnection();
    const [existingUsers] = await connection.execute<RowDataPacket[]>(
      'SELECT id FROM accounts WHERE email = ?',
      [email]
    );
    if (existingUsers.length > 0) {
      await connection.end();
      return NextResponse.json({ error: 'ایمیل قبلاً ثبت شده است' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO accounts (email, name, lastname, phonenumber, password, vip, courseid) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, name, lastname, phonenumber, hashedPassword, vip || 0, null]
    );

    await connection.end();
    return NextResponse.json({ message: 'کاربر با موفقیت ثبت شد' }, { status: 201 });
  } catch (error) {
    console.error('خطا در ثبت کاربر:', error);
    return NextResponse.json({ error: 'خطا در ثبت کاربر' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export const revalidate = 0;