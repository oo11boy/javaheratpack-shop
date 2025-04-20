"use client";

import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState(""); // برای تغییر رمز
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForProfile, setCurrentPasswordForProfile] = useState(""); // برای به‌روزرسانی پروفایل
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userData, refreshUserData } = useAuth();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("لطفاً تمام فیلدها را برای تغییر رمز عبور پر کنید.");
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
        body: JSON.stringify({ currentPassword, newPassword, action: "changePassword" }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در تغییر رمز عبور");
      }

      setSuccess("رمز عبور با موفقیت تغییر یافت!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      await refreshUserData();
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!newName || !newLastname || !newEmail || !currentPasswordForProfile) {
      setError("لطفاً تمام فیلدها، از جمله رمز عبور فعلی، را برای به‌روزرسانی پروفایل پر کنید.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          newName, 
          newLastname, 
          newEmail, 
          currentPassword: currentPasswordForProfile, 
          action: "updateProfile" 
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در به‌روزرسانی پروفایل");
      }

      setSuccess("پروفایل با موفقیت به‌روزرسانی شد!");
      setNewName("");
      setNewLastname("");
      setNewEmail("");
      setCurrentPasswordForProfile("");
      await refreshUserData();
    } catch (err) {
   console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">در حال بارگذاری...</div>;
  }

  return (
    <main className="min-h-screen flex items-start justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-4xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <User className="w-8 h-8" />
          تنظیمات حساب کاربری
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg shadow-md"
          >
            {success}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* بخش اطلاعات کاربر */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2a3347] rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-semibold text-white mb-4">اطلاعات فعلی</h3>
            <p className="text-gray-300 mb-2">نام: {userData.name}</p>
            <p className="text-gray-300 mb-2">نام خانوادگی: {userData.lastname}</p>
            <p className="text-gray-300">ایمیل: {userData.email}</p>
          </motion.div>

          {/* فرم به‌روزرسانی پروفایل */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">به‌روزرسانی پروفایل</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="newName" className="block text-sm font-medium text-gray-300 mb-1">
                  نام جدید
                </label>
                <input
                  type="text"
                  id="newName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="newLastname" className="block text-sm font-medium text-gray-300 mb-1">
                  نام خانوادگی جدید
                </label>
                <input
                  type="text"
                  id="newLastname"
                  value={newLastname}
                  onChange={(e) => setNewLastname(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-300 mb-1">
                  ایمیل جدید
                </label>
                <input
                  type="email"
                  id="newEmail"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="currentPasswordForProfile" className="block text-sm font-medium text-gray-300 mb-1">
                  رمز عبور فعلی (برای تأیید)
                </label>
                <input
                  type="password"
                  id="currentPasswordForProfile"
                  value={currentPasswordForProfile}
                  onChange={(e) => setCurrentPasswordForProfile(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black border-solid mx-auto"></div>
                ) : (
                  "به‌روزرسانی پروفایل"
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* فرم تغییر رمز عبور */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 md:col-span-2"
          >
            <h3 className="text-xl font-semibold text-white mb-4">تغییر رمز عبور</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  رمز عبور فعلی
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  تأیید رمز عبور جدید
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                  required
                  disabled={isLoading}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black border-solid mx-auto"></div>
                ) : (
                  "تغییر رمز عبور"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </main>
  );
}