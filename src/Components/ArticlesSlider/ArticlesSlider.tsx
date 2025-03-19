"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { ArticleOutlined } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image'; // اضافه کردن next/image
import "./Articles.css";

const articles = [
    {
      id: 1,
      title: "هوش مصنوعی در پزشکی ایران",
      excerpt: "تشخیص بیماری‌ها با دقت ۹۵٪ در بیمارستان‌های تهران در سال ۱۴۰۳.",
      image: "https://picsum.photos/500/600?random=1",
      date: "۱۲ اسفند ۱۴۰۳",
    },
    {
      id: 2,
      title: "انرژی خورشیدی در ایران",
      excerpt: "ظرفیت تولید انرژی خورشیدی ایران به ۵۰۰ مگاوات در سال ۱۴۰۳ رسید.",
      image: "https://picsum.photos/500/600?random=2",
      date: "۱۵ بهمن ۱۴۰۳",
    },
    {
      id: 3,
      title: "گسترش شبکه 5G در ایران",
      excerpt: "سرعت 5G در تهران به ۱ گیگابیت بر ثانیه در سال ۱۴۰۳ رسید.",
      image: "https://picsum.photos/500/600?random=3",
      date: "۲۰ دی ۱۴۰۳",
    },
    {
      id: 4,
      title: "رباتیک در صنعت خودروسازی",
      excerpt: "افزایش ۳۰٪ تولید خودرو با ربات‌ها در کارخانه‌های ایران‌خودرو.",
      image: "https://picsum.photos/500/600?random=4",
      date: "۵ دی ۱۴۰۳",
    },
    {
      id: 5,
      title: "تغییرات اقلیمی و کشاورزی",
      excerpt: "کاهش ۲۰٪ بارندگی در دشت‌های مرکزی ایران در سال ۱۴۰۳.",
      image: "https://picsum.photos/500/600?random=5",
      date: "۱ آذر ۱۴۰۳",
    },
    {
      id: 6,
      title: "بلاکچین در بانکداری ایران",
      excerpt: "بانک مرکزی آزمایش بلاکچین برای تراکنش‌ها را در سال ۱۴۰۳ آغاز کرد.",
      image: "https://picsum.photos/500/600?random=6",
      date: "۱۵ آبان ۱۴۰۳",
    },
];

export default function ArticleSlider() {
  return (
    <div className="bg-gradient-to-b to-gray-900 from-gray-800 min-h-screen py-16">
      <div className="ccontainer mx-auto px-4 relative">
        <h2 className="!text-xl border inline-block p-2 text-white border-[#0dcf6c] yekanh rounded-xl items-center gap-3 mb-12">
          <ArticleOutlined fontSize="large" className="text-[#0dcf6c] ml-2" />
          آخرین مقالات
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ 
            clickable: true,
            el: '.custom-pagination'
          }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
        >
          {articles.map((article) => (
            <SwiperSlide key={article.id}>
              <div className="group relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[400px] flex flex-col transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-gray-700">
                <div className="relative overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={500}
                    height={600}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                    {article.date}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="!text-lg font-semibold text-white mb-3 group-hover:text-[#0dcf6c] transition-colors duration-300 line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 !text-sm mb-4 flex-grow line-clamp-2">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/bloglist/${article.id}`}
                    className="bg-[#0dcf6c] cursor-pointer text-gray-900 px-5 py-2 rounded-lg hover:bg-[#0bb55a] transition-all duration-300 transform hover:scale-105 font-medium mt-auto"
                  >
                    مطالعه بیشتر
                  </Link>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-pagination mt-8 flex justify-center"></div>
      </div>
    </div>
  );
}