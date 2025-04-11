// src\app\admin\page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/DashboardComponents/AdminAccount/AdminDashboard/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const { userData, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn === null) {
      // هنوز در حال لود شدن است، صبر کن
      return;
    }
    if (!isLoggedIn) {
      router.push("/"); // اگر کاربر وارد نشده باشد
    } else if (userData?.vip !== 1) {
      router.push("/"); // اگر کاربر ادمین نباشد
    }
  }, [isLoggedIn, userData, router]);

  if (isLoggedIn === null) {
    // نمایش لودینگ تا وقتی وضعیت لاگین مشخص شود
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[color:var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn || userData?.vip !== 1) {
    return null; // در حال ریدایرکت
  }

  return (
    <div>
      <AdminDashboard deeppage="/" />
    </div>
  );
}