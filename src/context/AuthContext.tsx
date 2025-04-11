// src\context\AuthContext.tsx
"use client";

import { UserData } from "@/lib/Types/Types";
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  refreshUserData: () => Promise<void>;
  handleRedirectAfterLogin: () => void; // متد جدید برای ریدایرکت
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let cachedUserData: UserData | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();
  const pathname = usePathname(); // مسیر فعلی

  const fetchUserData = async () => {
    if (cachedUserData && isLoggedIn) {
      setUserData(cachedUserData);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        const formattedData = {
          ...data,
          completedCourses: data.completedCourses || 0,
          totalHours: data.totalHours || "0 ساعت",
          courseid: data.courseid || [],
          vip: data.vip || 0,
        };
        setIsLoggedIn(true);
        setUserData(formattedData);
        cachedUserData = formattedData;
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
  }, []);

  // متد جدید برای مدیریت ریدایرکت
  const handleRedirectAfterLogin = useCallback(() => {
    if (userData?.vip === 1 && pathname !== "/admin") {
      router.push("/admin");
    }
  }, [userData, pathname, router]);

  useEffect(() => {
    fetchUserData(); // بارگذاری اولیه
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userData, setUserData, refreshUserData, handleRedirectAfterLogin }}
    >
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