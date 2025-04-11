// src\context\AuthContext.tsx
"use client";

import { UserData } from "@/lib/Types/Types";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  refreshUserData: () => Promise<void>;
  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let cachedUserData: UserData | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const fetchUserData = async () => {
    if (cachedUserData && isLoggedIn) {
      setUserData(cachedUserData);
      // ریدایرکت بر اساس vip
      if (cachedUserData.vip === 1) {
        router.push("/admin");
      }
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
        cache: "no-store", // مطمئن شویم همیشه داده‌های تازه دریافت می‌شوند
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = {
          ...data,
          completedCourses: data.completedCourses || 0,
          totalHours: data.totalHours || "0 ساعت",
          courseid: data.courseid || [],
          vip: data.vip || 0, // اطمینان از وجود vip
        };
        setIsLoggedIn(true);
        setUserData(formattedData);
        cachedUserData = formattedData;

        // ریدایرکت بر اساس vip
        if (formattedData.vip === 1) {
          router.push("/admin");
        }
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        cachedUserData = null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLoggedIn(false);
      setUserData(null);
      cachedUserData = null;
    }
  };

  const refreshUserData = useCallback(async () => {
    await fetchUserData();
  }, [router]);

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