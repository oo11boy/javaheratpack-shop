import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import SingleArticle from '@/Components/SingleArticle/SingleArticle';
import { notFound } from 'next/navigation';

async function getArticle(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('مقاله یافت نشد');
  return res.json();
}

export default async function SingleArticlePage({ params }: { params: { id: string } }) {
  let article;
  try {
    article = await getArticle(params.id);
  } catch (error) {
    console.error('خطا در دریافت مقاله:', error);
    notFound();
  }

  return (
    <>
      <Header />
      <SingleArticle articleData={article} /> {/* انتقال داده به کامپوننت */}
      <Footer />
    </>
  );
}

export const revalidate = 3600;