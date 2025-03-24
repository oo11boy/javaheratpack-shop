import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import HeroSection from "@/Components/HeroSection/HeroSection";
import Nemone from "@/Components/Nemone/Nemone";
import { Article, SimpleCourse } from "@/lib/Types/Types";
import HomeCourseList from "@/Components/HomeCourseList/HomeCourseList";
import { getCourses, getArticles } from "@/lib/api"; // اضافه کردن getArticles
import { ArticleSlider } from "@/Components/ArticlesSlider/ArticlesSlider";

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