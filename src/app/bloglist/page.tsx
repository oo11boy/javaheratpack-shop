import BlogList from "@/Components/BlogList/BlogList";
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/Types/Types";

// تعریف متا دیتا
export const metadata = {
  title: "شوید-آموزش طراحی جواهرات | مقالات",
  description: "جدیدترین مقالات آموزشی درباره طراحی جواهرات با نرم‌افزار ماتریکس و نکات حرفه‌ای برای ورود به بازار کار طراحی زیورآلات را در شوید بخوانید.",
  keywords: ["مقالات طراحی جواهرات", "آموزش ماتریکس", "طراحی زیورآلات", "نرم‌افزار ماتریکس", "آموزش طراحی جواهرات"],
  openGraph: {
    title: "شوید-آموزش طراحی جواهرات | مقالات",
    description: "جدیدترین مقالات آموزشی درباره طراحی جواهرات با نرم‌افزار ماتریکس و نکات حرفه‌ای برای ورود به بازار کار طراحی زیورآلات را در شوید بخوانید.",
    url: "https://shivid.co/bloglist",
    type: "website",
    images: [
      {
        url: "https://shivid.co/Images/logo.png",
        width: 1200,
        height: 630,
        alt: "مقالات طراحی جواهرات با ماتریکس",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شوید-آموزش طراحی جواهرات | مقالات",
    description: "جدیدترین مقالات آموزشی درباره طراحی جواهرات با نرم‌افزار ماتریکس و نکات حرفه‌ای برای ورود به بازار کار طراحی زیورآلات را در شوید بخوانید.",
    image:  "https://shivid.co/Images/logo.png",
  },
};

export default async function BlogListPage() {
  let articles: Article[] = [];
  try {
    articles = await getArticles();
  } catch (error) {
    console.error("خطا در دریافت داده‌ها:", error);
  }

  return (
    <div>
      <Header />
      <BlogList mockArticles={articles} />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;