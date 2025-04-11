// src\app\components\Dashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DashboardOutlined } from "@mui/icons-material";
import { Users, BookOpen, FileText, ShoppingCart, MessageSquare, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  totalUsers: number;
  totalCourses: number;
  totalArticles: number;
  totalOrders: number;
  totalComments: number;
  recentActivity: string[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("خطا در دریافت اطلاعات داشبورد");
      const dashboardData: DashboardData = await response.json();
      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.vip === 1) {
      fetchDashboardData();
    }
  }, [userData]);

  if (isLoading) {
    return (
      <main className="p-6 flex-1 bg-[#f0f2f5]">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="p-6 flex-1 bg-[#f0f2f5]">
        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
          خطا در بارگذاری اطلاعات داشبورد
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 flex-1 bg-[#f0f2f5]">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <DashboardOutlined className="w-6 h-6 text-[color:var(--primary-color)]" />
          داشبورد
        </h2>

        {/* ویجت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ویجت تعداد کاربران */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 opacity-80" />
              <div>
                <h3 className="text-lg font-semibold">تعداد کاربران</h3>
                <p className="text-3xl font-bold">{data.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* ویجت تعداد دوره‌ها */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4">
              <BookOpen className="w-10 h-10 opacity-80" />
              <div>
                <h3 className="text-lg font-semibold">تعداد دوره‌ها</h3>
                <p className="text-3xl font-bold">{data.totalCourses}</p>
              </div>
            </div>
          </div>

          {/* ویجت تعداد مقالات */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4">
              <FileText className="w-10 h-10 opacity-80" />
              <div>
                <h3 className="text-lg font-semibold">تعداد مقالات</h3>
                <p className="text-3xl font-bold">{data.totalArticles}</p>
              </div>
            </div>
          </div>

  

          {/* ویجت تعداد نظرات */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center gap-4">
              <MessageSquare className="w-10 h-10 opacity-80" />
              <div>
                <h3 className="text-lg font-semibold">تعداد نظرات</h3>
                <p className="text-3xl font-bold">{data.totalComments}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}