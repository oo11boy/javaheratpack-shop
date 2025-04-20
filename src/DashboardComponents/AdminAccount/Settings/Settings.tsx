"use client";

import React, { useState, useEffect } from "react";
import { Lock, User, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const { userData, refreshUserData } = useAuth();

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^09[0-9]{9}$/.test(phone);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

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

    if (!isValidPassword(newPassword)) {
      setError(
        "رمز عبور جدید باید حداقل ۸ کاراکتر، شامل حروف بزرگ، کوچک و عدد باشد."
      );
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
        throw new Error(
          data.error === "Invalid current password"
            ? "رمز عبور فعلی اشتباه است."
            : data.error === "New password must be at least 8 characters"
            ? "رمز عبور جدید باید حداقل ۸ کاراکتر باشد."
            : data.error || "خطا در تغییر رمز عبور"
        );
      }

      setSuccess("رمز عبور با موفقیت تغییر یافت!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      await refreshUserData();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditField = async (e: React.FormEvent, field: string) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (!editValue) {
      setError("لطفاً مقدار جدید را وارد کنید.");
      setIsLoading(false);
      return;
    }

    if (field === "name" || field === "lastname") {
      if (editValue.length < 2) {
        setError(`${field === "name" ? "نام" : "نام خانوادگی"} باید حداقل ۲ کاراکتر باشد.`);
        setIsLoading(false);
        return;
      }
    }

    if (field === "email" && !isValidEmail(editValue)) {
      setError("لطفاً یک ایمیل معتبر وارد کنید.");
      setIsLoading(false);
      return;
    }

    if (field === "phonenumber" && !isValidPhone(editValue)) {
      setError("لطفاً یک شماره موبایل معتبر (مثل 09123456789) وارد کنید.");
      setIsLoading(false);
      return;
    }

    if ((field === "email" || field === "phonenumber") && !editPassword) {
      setError("لطفاً رمز عبور فعلی را وارد کنید.");
      setIsLoading(false);
      return;
    }

    try {
      const payload: any = {
        action: "updateProfile",
        currentPassword: field === "email" || field === "phonenumber" ? editPassword : undefined,
      };
      if (field === "name") payload.newName = editValue;
      if (field === "lastname") payload.newLastname = editValue;
      if (field === "email") payload.newEmail = editValue;
      if (field === "phonenumber") payload.newPhonenumber = editValue;

      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error === "Invalid current password"
            ? "رمز عبور فعلی اشتباه است."
            : data.error === "This email is already in use"
            ? "این ایمیل قبلاً استفاده شده است."
            : data.error === "This phonenumber is already in use"
            ? "این شماره موبایل قبلاً استفاده شده است."
            : data.error || "خطا در به‌روزرسانی اطلاعات"
        );
      }

      setSuccess("اطلاعات با موفقیت به‌روزرسانی شد!");
      setEditValue("");
      setEditPassword("");
      setEditingField(null);
      await refreshUserData();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
    setEditPassword("");
    setError(null);
    setSuccess(null);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue("");
    setEditPassword("");
    setError(null);
  };

  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[color:var(--primary-color)] border-solid mb-4"></div>
        <p>در حال بارگذاری اطلاعات کاربری...</p>
      </div>
    );
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
            className="mb-6 p-4 bg-red-500/20 text-red-200 rounded-lg shadow-md border border-red-500/50"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-green-500/20 text-green-200 rounded-lg shadow-md border border-green-500/50"
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
            <div className="space-y-4">
              {/* نام */}
              <div className="flex items-center justify-between">
                {editingField === "name" ? (
                  <form
                    onSubmit={(e) => handleEditField(e, "name")}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black border-solid"></div>
                        ) : (
                          "ذخیره"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        لغو
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-300">نام: {userData.name}</p>
                    <button
                      onClick={() => startEditing("name", userData.name)}
                      className="text-[color:var(--primary-color)] hover:text-[#0aaf5a]"
                      disabled={isLoading}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* نام خانوادگی */}
              <div className="flex items-center justify-between">
                {editingField === "lastname" ? (
                  <form
                    onSubmit={(e) => handleEditField(e, "lastname")}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black border-solid"></div>
                        ) : (
                          "ذخیره"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        لغو
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-300">نام خانوادگی: {userData.lastname}</p>
                    <button
                      onClick={() => startEditing("lastname", userData.lastname)}
                      className="text-[color:var(--primary-color)] hover:text-[#0aaf5a]"
                      disabled={isLoading}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* ایمیل */}
              <div className="flex items-center justify-between">
                {editingField === "email" ? (
                  <form
                    onSubmit={(e) => handleEditField(e, "email")}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="email"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="رمز عبور فعلی"
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black border-solid"></div>
                        ) : (
                          "ذخیره"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        لغو
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-300">ایمیل: {userData.email}</p>
                    <button
                      onClick={() => startEditing("email", userData.email)}
                      className="text-[color:var(--primary-color)] hover:text-[#0aaf5a]"
                      disabled={isLoading}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* شماره موبایل */}
              <div className="flex items-center justify-between">
                {editingField === "phonenumber" ? (
                  <form
                    onSubmit={(e) => handleEditField(e, "phonenumber")}
                    className="flex flex-col w-full gap-2"
                  >
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="رمز عبور فعلی"
                      className="p-2 border border-gray-600 rounded-lg bg-[#3a465b] text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)]"
                      required
                      disabled={isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-black border-solid"></div>
                        ) : (
                          "ذخیره"
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        لغو
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-gray-300">
                      شماره موبایل: {userData.phonenumber || "ثبت نشده"}
                    </p>
                    <button
                      onClick={() =>
                        startEditing("phonenumber", userData.phonenumber || "")
                      }
                      className="text-[color:var(--primary-color)] hover:text-[#0aaf5a]"
                      disabled={isLoading}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* فرم تغییر رمز عبور */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6 md:col-span-1"
          >
            <h3 className="text-xl font-semibold text-white mb-4">تغییر رمز عبور</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
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
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
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
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
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
                className="w-full py-3 bg-[color:var(--primary-color)] text-black rounded-lg hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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