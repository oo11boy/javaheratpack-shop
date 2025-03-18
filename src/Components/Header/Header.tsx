import React from "react";
import { ArticleOutlined, HomeOutlined, InfoOutlined, SchoolOutlined } from "@mui/icons-material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
export default function Header() {
  return (
    <div className="w-full bg-[black] p-4">
      <div className=" ccontainer flex justify-between items-center">
        <div>
          <img
          className="w-[95px] h-[30px]"
            src="../Images/logo.png"
            alt=""
          />
        </div>
        <ul className="text-white flex gap-6">
        <li className="flex items-center justify-center gap-1 hover:text-orange-500 transition-all duration-500 cursor-pointer ease-in-out">
            <HomeOutlined className="text-[#0dcf6c]"/>
            خانه

          </li>
          <li className="flex items-center justify-center gap-1 hover:text-orange-500 transition-all duration-500 cursor-pointer ease-in-out">
          <SchoolOutlined className="text-[#0dcf6c]"/>
            دوره های آموزشی</li>
            <li className="flex items-center justify-center gap-1 hover:text-orange-500 transition-all duration-500 cursor-pointer ease-in-out">
            <ArticleOutlined className="text-[#0dcf6c]"/>
            مقالات</li>
            <li className="flex items-center justify-center gap-1 hover:text-orange-500 transition-all duration-500 cursor-pointer ease-in-out">
            <InfoOutlined className="text-[#0dcf6c]"/>
            درباره ما</li>
        </ul>
        <div className="text-[#999] cursor-pointer shadow-[2px_2px_4px_rgba(255,255,255,0.4),-2px_-2px_4px_rgba(0,0,0,0.8)] active:shadow-[-2px_-2px_4px_rgba(255,255,255,0.4),2px_2px_4px_rgba(0,0,0,0.8)] flex items-center space-x-2 justify-center p-2 rounded-lg bg-black transition-all duration-200">
  <AccountCircleOutlinedIcon fontSize="large" className="text-[#0dcf6c]" />
  <p className="pb-[1px] !text-md text-white">ورود | ثبت نام</p>
</div>
      </div>
    </div>
  );
}
