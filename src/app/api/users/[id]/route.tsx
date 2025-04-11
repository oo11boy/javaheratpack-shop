// src\app\api\users\[id]\route.tsx
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  phonenumber: string;
  vip: number;
}

// دریافت اطلاعات یک کاربر
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<User | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, email, name, lastname, phonenumber, vip FROM accounts WHERE id = ?',
      [id]
    );
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    const user: User = {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      lastname: rows[0].lastname,
      phonenumber: rows[0].phonenumber,
      vip: rows[0].vip,
    };

    return NextResponse.json(user, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('خطا در دریافت کاربر:', error);
    return NextResponse.json({ error: 'خطا در دریافت کاربر' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// ویرایش کاربر
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<User | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;
  try {
    const { email, name, lastname, phonenumber, vip } = await request.json();

    if (!email || !name || !lastname || !phonenumber) {
      return NextResponse.json({ error: 'همه فیلدها الزامی هستند' }, { status: 400 });
    }

    connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>(
      'UPDATE accounts SET email = ?, name = ?, lastname = ?, phonenumber = ?, vip = ? WHERE id = ?',
      [email, name, lastname, phonenumber, vip, id]
    );

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT id, email, name, lastname, phonenumber, vip FROM accounts WHERE id = ?',
      [id]
    );
    await connection.end();

    const updatedUser: User = {
      id: rows[0].id,
      email: rows[0].email,
      name: rows[0].name,
      lastname: rows[0].lastname,
      phonenumber: rows[0].phonenumber,
      vip: rows[0].vip,
    };

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('خطا در به‌روزرسانی کاربر:', error);
    return NextResponse.json({ error: 'خطا در به‌روزرسانی کاربر' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// حذف کاربر
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute<ResultSetHeader>('DELETE FROM accounts WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    await connection.end();
    return NextResponse.json({ message: 'کاربر با موفقیت حذف شد' }, { status: 200 });
  } catch (error) {
    console.error('خطا در حذف کاربر:', error);
    return NextResponse.json({ error: 'خطا در حذف کاربر' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

export const revalidate = 0;