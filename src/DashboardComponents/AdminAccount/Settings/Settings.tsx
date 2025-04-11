// src\app\components\Settings.tsx
"use client";

import React, { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, refreshUserData } = useAuth();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    // اعتبارسنجی اولیه
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("لطفاً تمام فیلدها را پر کنید.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("رمز عبور جدید و تأیید آن مطابقت ندارند.");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("رمز عبور جدید باید حداقل 6 کاراکتر باشد.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data: { message?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در تغییر رمز عبور");
      }

      setSuccess("رمز عبور با موفقیت تغییر یافت!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      await refreshUserData(); // به‌روزرسانی اطلاعات کاربر
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("خطای ناشناخته");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="p-6 bg-[#f0f2f5] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6 text-[color:var(--primary-color)]" />
          تنظیمات حساب
        </h2>

        <div className="mb-6">
          <p className="text-gray-600">کاربر: {userData.name} {userData.lastname}</p>
          <p className="text-gray-600">ایمیل: {userData.email}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              رمز عبور فعلی
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              رمز عبور جدید
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)]"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
              تأیید رمز عبور جدید
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[color:var(--primary-color)] focus:border-[color:var(--primary-color)]"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black border-solid"></div>
            ) : (
              "تغییر رمز عبور"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}