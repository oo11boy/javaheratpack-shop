// app/page.tsx
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import HeroSection from "@/Components/HeroSection/HeroSection";
import Nemone from "@/Components/Nemone/Nemone";
import { Article, SimpleCourse } from "@/lib/Types/Types";
import HomeCourseList from "@/Components/HomeCourseList/HomeCourseList";
import { getCourses, getArticles } from "@/lib/api";
import { ArticleSlider } from "@/Components/ArticlesSlider/ArticlesSlider";
import { cache } from "react";
import { Suspense } from "react";

// کش کردن درخواست‌ها با React Cache
const getCoursesCached = cache(getCourses);
const getArticlesCached = cache(getArticles);

// استفاده از Static Generation
export const dynamic = "force-static";
export const revalidate = 3600; // بازتولید هر ۱ ساعت

// متا دیتا (بدون تغییر)
export const metadata = {
  title: "شوید-آموزش طراحی جواهرات",
  description:
    "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
  keywords: [
    "آموزش طراحی جواهرات",
    "نرم‌افزار ماتریکس",
    "دوره طراحی جواهرات",
    "آموزش ماتریکس",
    "طراحی زیورآلات",
  ],
  openGraph: {
    title: "شوید-آموزش طراحی جواهرات",
    description:
      "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
    url: "https://shivid.co",
    type: "website",
    images: [
      {
        url: "https://shivid.co/Images/logo.png",
        width: 1200,
        height: 630,
        alt: "آموزش طراحی جواهرات با ماتریکس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شوید-آموزش طراحی جواهرات",
    description:
      "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
    url: "https://shivid.co/Images/logo.png",
  },
};

// کامپوننت‌های لودینگ برای Suspense
function CoursesLoading() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

function ArticlesLoading() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default async function Page() {
  // اجرای موازی درخواست‌ها با Promise.all
  const [jewelryCourses, articles] = await Promise.all([
    getCoursesCached().catch((error) => {
      console.error("خطا در دریافت دوره‌ها:", error);
      return [] as SimpleCourse[];
    }),
    getArticlesCached().catch((error) => {
      console.error("خطا در دریافت مقالات:", error);
      return [] as Article[];
    }),
  ]);

  return (
    <>
      <Header />
      <HeroSection />
      <Nemone />
      
      {/* استفاده از Suspense برای لودینگ بهتر */}
      <Suspense fallback={<CoursesLoading />}>
        <HomeCourseList jewelryCourses={jewelryCourses} />
      </Suspense>
      
      <Suspense fallback={<ArticlesLoading />}>
        <ArticleSlider mockArticles={articles} />
      </Suspense>
      
      <Footer />
    </>
  );
}