// AuthContext.tsx
"use client";

import { UserData } from "@/lib/Types/Types";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  refreshUserData: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserData({
          ...data,
          completedCourses: data.completedCourses || 0,
          totalHours: data.totalHours || "0 ساعت",
          purchasedCourses: data.purchasedCourses || [], // اطمینان از مقدار پیش‌فرض
        });
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  // تابع برای رفرش دستی داده‌ها
  const refreshUserData = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData(); // بارگذاری اولیه
  }, []);


  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};