// src\app\api\logout\route.tsx
import {  NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.delete('auth_token'); // پاک کردن کوکی
  return response;
}