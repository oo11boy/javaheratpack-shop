import React from 'react';
import ArticleSwiper from './ArticleSwiper';

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

const articles: Article[] = [
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
        <h2 className="!text-xl border inline-block p-2 text-white border-[color:var(--primary-color)] yekanh rounded-xl items-center gap-3 mb-12">
          <span className="text-[color:var(--primary-color)] ml-2">آخرین مقالات</span>
        </h2>
        <ArticleSwiper articles={articles} />
      </div>
    </div>
  );
}