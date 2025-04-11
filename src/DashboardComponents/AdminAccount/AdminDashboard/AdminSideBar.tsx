// AdminSideBar.tsx
import {
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Settings,
  User,
  Users,
  X,
  BookOpen,
  FileText,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type AdminSideBar = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleSubmenu: (menu: string) => void;
  activeMenu: string | null;
  handleLogout: () => void;
};

export default function AdminSideBar({
  isSidebarOpen,
  toggleSidebar,
  toggleSubmenu,
  activeMenu,
  handleLogout,
}: AdminSideBar) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1e2636] text-white transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition-all duration-300 ease-in-out shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-700/30">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          مدیریت سایت
        </h1>
        <button onClick={toggleSidebar} className="md:hidden p-1 hover:bg-gray-700 rounded-full">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col p-4 gap-1 h-[calc(100vh-73px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
        <Link
          href="/admin"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
        >
          <Home className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm">داشبورد</span>
        </Link>

        {/* Courses Menu */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu("courses")}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">دوره‌ها</span>
            </div>
            <span className="p-1">
              {activeMenu === "courses" ? (
                <ChevronDown className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform" />
              )}
            </span>
          </button>
          {activeMenu === "courses" && (
            <div className="pl-6 mt-1 flex flex-col gap-1 animate-fade-in text-sm">
              <Link href="/admin/courselist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست دوره‌ها
              </Link>
              <Link href="/admin/courseadd" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                افزودن دوره
              </Link>
            </div>
          )}
        </div>

        {/* Portfolio Menu */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu("nemone")}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">نمونه کارها</span>
            </div>
            <span className="p-1">
              {activeMenu === "nemone" ? (
                <ChevronDown className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform" />
              )}
            </span>
          </button>
          {activeMenu === "nemone" && (
            <div className="pl-6 mt-1 flex flex-col gap-1 animate-fade-in text-sm">
              <Link href="/admin/nemonelist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست نمونه کارها
              </Link>
              <Link href="/admin/nemoneadd" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                افزودن نمونه کار
              </Link>
            </div>
          )}
        </div>

        {/* Articles Menu */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu("articles")}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">مقالات</span>
            </div>
            <span className="p-1">
              {activeMenu === "articles" ? (
                <ChevronDown className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform" />
              )}
            </span>
          </button>
          {activeMenu === "articles" && (
            <div className="pl-6 mt-1 flex flex-col gap-1 animate-fade-in text-sm">
              <Link href="/admin/articlelist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست مقالات
              </Link>
              <Link href="/admin/articleadd" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                افزودن مقاله
              </Link>
              <Link href="/admin/commentarticlelist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست نظرات
              </Link>
            </div>
          )}
        </div>

        {/* Users Menu */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSubmenu("users")}
            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm">کاربران</span>
            </div>
            <span className="p-1">
              {activeMenu === "users" ? (
                <ChevronDown className="w-4 h-4 transition-transform" />
              ) : (
                <ChevronRight className="w-4 h-4 transition-transform" />
              )}
            </span>
          </button>
          {activeMenu === "users" && (
            <div className="pl-6 mt-1 flex flex-col gap-1 animate-fade-in text-sm">
              <Link href="/admin/userlist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست کاربران
              </Link>
              <Link href="/admin/useradd" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                افزودن کاربر
              </Link>
              <Link href="/admin/commentarticlelist" className="p-2 hover:text-blue-400 transition-colors rounded-md hover:bg-gray-700/50">
                لیست نظرات
              </Link>
            </div>
          )}
        </div>

        {/* Other Links */}
        <Link
          href="/admin/orders"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
        >
          <User className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm">سفارشات</span>
        </Link>

        <Link
          href="/admin/instructor"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
        >
          <User className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm">اطلاعات مدرس</span>
        </Link>

        <Link
          href="/admin/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#2a3347] transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm">تنظیمات</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/80 transition-all duration-200 group mt-auto"
        >
          <LogOut className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm">خروج</span>
        </button>
      </nav>
    </aside>
  );
}