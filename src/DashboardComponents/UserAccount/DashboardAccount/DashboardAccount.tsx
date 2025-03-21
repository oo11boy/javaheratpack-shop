"use client";

import React, { useState } from "react";
import { User, BookOpen, Clock, ChevronRight, LogOut, Award, PlayCircle, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const UserAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { userData: user, setIsLoggedIn, setUserData } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    setUserData(null);
    router.push("/");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      const data: { error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در تغییر رمز عبور");
      alert("رمز عبور با موفقیت تغییر یافت!");
      setIsModalOpen(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("خطای ناشناخته");
      setError(error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  if (!user) {
    return (
      <div className="h-[90vh] inset-0 flex items-center justify-center bg-[#121824] bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#0dcf6c] border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-10 animate-fade-in">
        {/* User Info Section */}
        <div className="relative flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-[#0dcf6c]/20 to-[#1e2636] p-6 md:p-8 rounded-xl shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] opacity-10" />
          <div className="relative z-10">
            <Image
              src={user.avatar}
              alt={user.name}
              width={144}
              height={144}
              className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-[#0dcf6c]/50 shadow-md"
              sizes="(max-width: 768px) 112px, 144px"
            />
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#0dcf6c] rounded-full flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center md:text-right z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0dcf6c] tracking-tight animate-pulse-once">
              {user.name}
            </h2>
            <p className="text-sm md:text-lg text-gray-300 mt-2 font-light">{user.email}</p>
            <p className="text-sm md:text-lg text-gray-300 mt-1 font-light">{user.phonenumber || "شماره تلفن ثبت نشده"}</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2 bg-[#0dcf6c] text-white rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                تغییر رمز عبور
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              >
                خروج
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* User Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-[#2a3347]/70 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-[#2a3347] transition-colors">
            <Award className="w-8 h-8 text-[#0dcf6c]" />
            <div>
              <p className="text-sm text-gray-400">دوره‌های تکمیل‌شده</p>
              <p className="text-xl font-bold text-white">{user.completedCourses || 0}</p>
            </div>
          </div>
          <div className="bg-[#2a3347]/70 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-[#2a3347] transition-colors">
            <Clock className="w-8 h-8 text-[#0dcf6c]" />
            <div>
              <p className="text-sm text-gray-400">مجموع ساعات یادگیری</p>
              <p className="text-xl font-bold text-white">{user.totalHours || "0 ساعت"}</p>
            </div>
          </div>
          <div className="bg-[#2a3347]/70 p-4 rounded-lg shadow-md flex items-center gap-3 hover:bg-[#2a3347] transition-colors">
            <BookOpen className="w-8 h-8 text-[#0dcf6c]" />
            <div>
              <p className="text-sm text-gray-400">دوره‌های خریداری‌شده</p>
              <p className="text-xl font-bold text-white">{user.purchasedCourses.length}</p>
            </div>
          </div>
        </div>

        {/* Purchased Courses Section */}
        <div className="flex flex-col gap-6">
          <h3 className="!text-2xl md:text-3xl font-bold text-[#0dcf6c] flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            دوره‌های خریداری‌شده
          </h3>
          {user.purchasedCourses.length === 0 ? (
            <p className="text-gray-400 text-center py-6 text-lg">
              هنوز دوره‌ای خریداری نکرده‌اید! به فروشگاه سر بزنید.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.purchasedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#2a3347]/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer border border-[#0dcf6c]/20"
                >
                  <div className="relative">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-[#0dcf6c] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-5">
                    <h4 className="text-lg font-semibold text-white group-hover:text-[#0dcf6c] transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Link
                      href={`../StudyRoom/${course.id}`}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      مشاهده دوره
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-[#1e2636] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-[#0dcf6c] mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              تغییر رمز عبور
            </h3>
            {error && (
              <p className="text-red-400 mb-4 text-center">{error}</p>
            )}
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <label htmlFor="currentPassword" className="text-sm text-gray-300">
                  رمز عبور فعلی
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full p-3 bg-[#2a3347] text-white rounded-lg border border-[#0dcf6c]/20 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="text-sm text-gray-300">
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full p-3 bg-[#2a3347] text-white rounded-lg border border-[#0dcf6c]/20 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                  required
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  ثبت تغییرات
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-pulse-once { animation: pulseOnce 0.8s ease-in-out; }
      `}</style>
    </div>
  );
};

export default UserAccount;