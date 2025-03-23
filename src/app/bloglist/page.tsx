import BlogList from '@/Components/BlogList/BlogList';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { notFound } from 'next/navigation';

async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('خطا در دریافت مقالات');
  return res.json();
}

export default async function BlogListPage() {
  let articles;
  try {
    articles = await getArticles();
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
   
  }

  return (
    <div>
      <Header />
      <BlogList mockArticles={articles} /> {/* تغییر نام prop به mockArticles */}
      <Footer />
    </div>
  );
}

export const revalidate = 3600;