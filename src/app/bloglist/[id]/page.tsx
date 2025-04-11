import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import SingleArticle from '@/Components/SingleArticle/SingleArticle';
import { getArticlesbyid } from '@/lib/api';
import { Article } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

export default async function SingleArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  let article: Article;
  try {
    article = await getArticlesbyid(id);
  } catch (error) {
    console.error('خطا در دریافت مقاله:', error);
    notFound();
  }

  return (
    <>
      <Header />
      <SingleArticle articleData={article} />
      <Footer />
    </>
  );
}

export const revalidate = 3600;