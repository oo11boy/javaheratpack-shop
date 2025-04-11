// src\app\components\AdminDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSideBar from "./AdminSideBar";
import AdminHeader from "./AdminHeader";
import CourseList from "../Courses/CourseList";
import Dashboard from "./Dashboard";
import CourseAdd from "../Courses/CourseAdd";
import CourseEdit from "../Courses/CourseEdit";
import ArticleList from "../Articles/ArticleList";
import ArticleEdit from "../Articles/ArticleEdit";
import ArticleAdd from "../Articles/ArticleAdd";
import NemoneList from "../Nemone/NemoneList";
import NemoneAdd from "../Nemone/NemoneAdd";
import NemoneEdit from "../Nemone/NemoneEdit";
import CommentList from "../Comments/Articles/CommentList";
import InstructorEdit from "../instructorEdit/instructorEdit";
import UserList from "../Users/UserList";
import UserAdd from "../Users/UserAdd";
import UserEdit from "../Users/UserEdit";
import PurchasedCoursesList from "../PurchasedCourses/PurchasedCoursesList";
import Settings from "../Settings/Settings";

const AdminDashboard = ({
  deeppage,
  deepid = 0,
}: {
  deeppage: string;
  deepid?: number;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const router = useRouter();
  const { isLoggedIn, userData, setIsLoggedIn, setUserData } = useAuth();

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (!isLoggedIn || userData?.vip !== 1) {
      router.push("/");
    }
  }, [isLoggedIn, userData, router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSubmenu = (menu: string) =>
    setActiveMenu(activeMenu === menu ? null : menu);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserData(null);
        router.push("../");
      } else {
        throw new Error("خطا در خروج از حساب");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("خطا در خروج از حساب");
    }
  };

  if (isLoggedIn === null) {
    return <div>در حال بارگذاری...</div>;
  }

  if (!isLoggedIn || userData?.vip !== 1) {
    return null;
  }

  return (
    <div className="bg-[#f0f2f5] text-gray-800 flex flex-col md:flex-row">
      <AdminSideBar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleSubmenu={toggleSubmenu}
        activeMenu={activeMenu}
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#121824] to-[#1e2636] text-white ">
        <AdminHeader toggleSidebar={toggleSidebar} />
        {deeppage === "/" && <Dashboard />}
        {deeppage === "courselist" && <CourseList />}
        {deeppage === "courseadd" && <CourseAdd />}
        {deeppage === "courseedit" && deepid !== 0 && <CourseEdit courseId={deepid} />}
        {deeppage === "articlelist" && <ArticleList />}
        {deeppage === "articleadd" && <ArticleAdd />}
        {deeppage === "articleedit" && deepid !== 0 && <ArticleEdit articleId={deepid} />}
        {deeppage === "nemonelist" && <NemoneList />}
        {deeppage === "nemoneadd" && <NemoneAdd />}
        {deeppage === "nemoneedit" && deepid !== 0 && <NemoneEdit nemoneId={deepid} />}
        {deeppage === "userlist" && <UserList />}
        {deeppage === "useradd" && <UserAdd />}
        {deeppage === "useredit" && deepid !== 0 && <UserEdit userId={deepid} />}
        {deeppage === "orders" && <PurchasedCoursesList />}
        {deeppage === "instructor" && <InstructorEdit />}
        {deeppage === "commentarticlelist" && <CommentList />}

        {deeppage === "settings" && <Settings />}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;