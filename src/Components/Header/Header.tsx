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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full bg-[black] p-4">
      <div className="ccontainer mx-auto flex justify-between items-center">
        {/* لوگو */}
        <div>
          <img
            className="w-[95px] h-[30px]"
            src="../Images/logo.png"
            alt="لوگو"
          />
        </div>

        {/* دکمه همبرگر برای موبایل */}
        <div className="flex items-center">
        
          <Link href={'../useraccount'} className="md:hidden text-[#999] cursor-pointer items-center space-x-2 justify-center p-2 rounded-lg bg-black transition-all duration-200">
            <AccountCircleOutlinedIcon
              fontSize="large"
              className="text-[#0dcf6c]"
            />
          </Link>

          <button
            className="md:hidden text-white bg-[#0dcf6c] p-1 rounded-md focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* لایه بلور اطراف منو */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-[#00000063]  backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* منوی اصلی (سایدبار از سمت راست) */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white md:!translate-0 text-black transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:static md:w-auto md:bg-transparent md:text-white md:transform-none transition-transform duration-500 ease-in-out z-50`}
        >
          <ul className="flex flex-col md:flex-row gap-6 p-4 md:p-0 h-full md:h-auto">
            <li className="flex items-center justify-start gap-1 hover:text-[#0dcf6c] transition-all duration-500 cursor-pointer ease-in-out">
              <Link
                className="flex items-center justify-start gap-1 "
                href={"./"}
              >
                <HomeOutlined className="text-[#0dcf6c]" />
                خانه
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[#0dcf6c] transition-all duration-500 cursor-pointer ease-in-out">
              <Link
                className="flex items-center justify-start gap-1 "
                href={"./courselist"}
              >
                <SchoolOutlined className="text-[#0dcf6c]" />
                دوره‌های آموزشی
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[#0dcf6c] transition-all duration-500 cursor-pointer ease-in-out">
              <Link
                className="flex items-center justify-start gap-1 "
                href={"./bloglist"}
              >
              <ArticleOutlined className="text-[#0dcf6c]" />
              مقالات
              </Link>
            </li>
            <li className="flex items-center justify-start gap-1 hover:text-[#0dcf6c] transition-all duration-500 cursor-pointer ease-in-out">
              <Link
                className="flex items-center justify-start gap-1 "
                href={"./aboutus"}
              >
                   <InfoOutlined className="text-[#0dcf6c]" />
              درباره ما
              </Link>
            </li>
          </ul>
        </div>

        {/* دکمه ورود/ثبت‌نام (فقط در دسکتاپ) */}
        <Link href={'../useraccount'} className="hidden md:flex text-[#999] cursor-pointer shadow-[2px_2px_4px_rgba(255,255,255,0.4),-2px_-2px_4px_rgba(0,0,0,0.8)] active:shadow-[-2px_-2px_4px_rgba(255,255,255,0.4),2px_2px_4px_rgba(0,0,0,0.8)] items-center space-x-2 justify-center p-1 rounded-lg bg-[black] transition-all duration-200">
          <AccountCircleOutlinedIcon
            fontSize="large"
            className="text-[#0dcf6c]"
          />
          <p className="pb-[1px] !text-md text-white">ورود | ثبت نام</p>
        </Link>
      </div>
    </div>
  );
}
