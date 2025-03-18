import React from "react";
import "./HeroSection.css";
import { Add } from "@mui/icons-material";
export default function HeroSection() {
  return (
    <div className="lg:h-[81vh] xl:h-screen h-auto flex justify-start items-start  lg:items-center HeroSection">
      
      <div className=" ccontainer  flex md:block justify-center items-start">
        <div className="max-w-[555px] boxhero  px-8 bg-[#2B0D22] rounded-2xl">
          <div className="flex justify-between w-full items-center">
            <img
              className="w-[200px] boxheroimg hidden md:block"
              src="https://kalaateh.com/wp-content/uploads/2025/03/Vector.png"
              alt=""
            />
            <div className="w-full gap-2 text-center mr-6 text-white flex flex-col">
              <span className="text-4xl font-black boldherotext yekanh ">نازنــیــن مقدم</span>

              <span className="text-xl normalherotext">مــــدرس دوره هـای آمـــوزشـی</span>
              <span className="text-4xl font-black yekanh boldherotext ">طراحی جواهرات</span>
              <span className="text-2xl normalherotext">
                از مــبــتـــدی تـا پیــشـــرفتـه
              </span>
            </div>
          </div>

          <a
            className="text-white heroboxbtn bg-[#2C419A] w-full flex justify-between items-center rounded-xl mt-4 p-2"
            href=""
          >
            مشاهده دوره های آموزشی
            <Add />
          </a>
        </div>
      </div>
    </div>
  );
}
