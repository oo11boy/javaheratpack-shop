import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import HeroSection from "@/Components/HeroSection/HeroSection";
import Nemone from "@/Components/Nemone/Nemone";
import { Article, SimpleCourse } from "@/lib/Types/Types";
import HomeCourseList from "@/Components/HomeCourseList/HomeCourseList";
import { getCourses, getArticles } from "@/lib/api";
import { ArticleSlider } from "@/Components/ArticlesSlider/ArticlesSlider";

// تعریف متا دیتا
export const metadata = {
  title: "شوید-آموزش طراحی جواهرات",
  description: "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
  keywords: ["آموزش طراحی جواهرات", "نرم‌افزار ماتریکس", "دوره طراحی جواهرات", "آموزش ماتریکس", "طراحی زیورآلات"],
  openGraph: {
    title: "شوید-آموزش طراحی جواهرات",
    description: "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
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
    description: "دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت طراحی جواهرات را بیاموزید و به بازار کار حرفه‌ای وارد شوید.",
    url: "https://shivid.co/Images/logo.png",
  },
};

export default async function Page() {
  let jewelryCourses: SimpleCourse[] = [];
  let articles: Article[] = [];

  try {
    jewelryCourses = await getCourses();
  } catch (error) {
    console.error("خطا در دریافت دوره‌ها:", error);
  }

  try {
    articles = await getArticles();
  } catch (error) {
    console.error("خطا در دریافت مقالات:", error);
  }

  return (
    <>
      <Header />
      <HeroSection />
      <Nemone />
      <HomeCourseList jewelryCourses={jewelryCourses} />
      <ArticleSlider mockArticles={articles} />
      <Footer />
    </>
  );
}