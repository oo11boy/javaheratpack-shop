"use client";
import React, { useState } from "react";
import {
  ArticleOutlined,
  HomeOutlined,
  InfoOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Link from "next/link";
import Image from "next/image";
import LoginModal from "@/DashboardComponents/LoginModal/LoginModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // مدیریت کلیک روی دکمه حساب کاربری/ورود
  const handleAccountClick = () => {
    if (isLoggedIn === true) {
      router.push("/useraccount");
    } else if (isLoggedIn === false) {
      setIsModalOpen(true); // فقط وقتی false است مودال باز می‌شود
    }
    // اگر isLoggedIn === null باشد، به دلیل disabled بودن دکمه، این تابع اجرا نمی‌شود
  };

  // کامپوننت دکمه با غیرفعال کردن
  const renderAccountButton = (isMobile: boolean) => {
    const isDisabled = isLoggedIn === null; // دکمه وقتی null است غیرفعال می‌شود

    return (
      <button
        onClick={handleAccountClick}
        disabled={isDisabled} // دکمه غیرفعال می‌شود وقتی isLoggedIn هنوز مشخص نیست
        className={`${
          isMobile
            ? "md:hidden text-[#999] cursor-pointer items-center justify-center p-2 rounded-lg bg-black transition-all duration-200"
            : "hidden md:flex text-[#999] cursor-pointer shadow-[2px_2px_4px_rgba(255,255,255,0.4),-2px_-2px_4px_rgba(0,0,0,0.8)] active:shadow-[-2px_-2px_4px_rgba(255,255,255,0.4),2px_2px_4px_rgba(0,0,0,0.8)] items-center space-x-2 justify-center p-1 rounded-lg bg-[black] transition-all duration-200"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`} // استایل برای حالت غیرفعال
      >
        {isLoggedIn ? (
          <>
            <AccountCircleOutlinedIcon
              fontSize="large"
              className="text-[color:var(--primary-color)]"
            />
            {!isMobile && <p className="pb-[1px] !text-md text-white">حساب کاربری</p>}
          </>
        ) : (
          <>
            <AccountCircleOutlinedIcon
              fontSize="large"
              className="text-[color:var(--primary-color)]"
            />
            {!isMobile && <p className="pb-[1px] !text-md text-white">ورود | ثبت نام</p>}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="w-full bg-[black] p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* لوگو */}
        <Link href="../">
          <Image
            className="w-[95px] h-[30px]"
            src="/Images/logo.png"
            alt="لوگو"
            width={95}
            height={30}
            sizes="95px"
          />
        </Link>

        {/* دکمه همبرگر و آیکن حساب کاربری برای موبایل */}
        <div className="flex items-center gap-2">
          {renderAccountButton(true)}

          <button
            className="md:hidden text-black bg-[color:var(--primary-color)] p-1 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* لایه بلور اطراف منو */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-[#00000063] backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* منوی اصلی (سایدبار از سمت راست) */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white md:!translate-0 text-black transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:static md:w-auto md:bg-transparent md:text-white md:transform-none transition-transform duration-500 ease-in-out z-50`}
        >
          <ul className="flex flex-col my-3 md:my-0 md:mx-3 md:flex-row gap-6 p-4 md:p-0 h-full md:h-auto">
            <li className="flex items-center justify-start gap-1 hover:text-[color:var(--primary-color)] transition-all duration-500 cursor-pointer ease-in-out">
              <Link className="flex items-center justify-start gap-1" href="../">
                <HomeOutlined className="text-[color:var(--primary-color)]" />
                خانه
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[color:var(--primary-color)] transition-all duration-500 cursor-pointer ease-in-out">
              <Link className="flex items-center justify-start gap-1" href="../courselist">
                <SchoolOutlined className="text-[color:var(--primary-color)]" />
                دوره‌های آموزشی
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[color:var(--primary-color)] transition-all duration-500 cursor-pointer ease-in-out">
              <Link className="flex items-center justify-start gap-1" href="../bloglist">
                <ArticleOutlined className="text-[color:var(--primary-color)]" />
                مقالات
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[color:var(--primary-color)] transition-all duration-500 cursor-pointer ease-in-out">
              <Link className="flex items-center justify-start gap-1" href="../aboutus">
                <InfoOutlined className="text-[color:var(--primary-color)]" />
                درباره ما
              </Link>
            </li>
          </ul>
        </div>

        {/* دکمه حساب کاربری/ورود (فقط در دسکتاپ) */}
        {renderAccountButton(false)}

      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}