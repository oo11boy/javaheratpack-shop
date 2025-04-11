// src\app\admin\page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from '@/DashboardComponents/AdminAccount/AdminDashboard/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();
  const { userData, isLoggedIn } = useAuth();
console.log(userData)
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/"); // اگر کاربر وارد نشده باشد
    } else if (userData?.vip !== 1) {
      router.push("/"); // اگر کاربر ادمین نباشد
    }
  }, [isLoggedIn, userData, router]);

  if (!isLoggedIn || userData?.vip !== 1) {
    return null; // در حال ریدایرکت
  }

  return (
    <div>
      <AdminDashboard deeppage="/" />
    </div>
  );
}