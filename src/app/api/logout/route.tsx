import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('auth_token'); // پاک کردن کوکی
  return response;
}