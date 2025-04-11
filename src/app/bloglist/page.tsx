import BlogList from "@/Components/BlogList/BlogList";
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { getArticles } from "@/lib/api";
import { Article } from "@/lib/Types/Types";

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
      <BlogList mockArticles={articles} />{" "}
      {/* تغییر نام prop به mockArticles */}
      <Footer />
    </div>
  );
}

export const revalidate = 3600;
