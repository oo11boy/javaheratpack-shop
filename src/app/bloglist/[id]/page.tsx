import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import SingleArticle from '@/Components/SingleArticle/SingleArticle';
import { getArticlesbyid } from '@/lib/api';
import { Article } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

// تولید متا دیتا به‌صورت پویا
export async function generateMetadata({
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
    console.error('خطا در دریافت مقاله برای متا دیتا:', error);
    return {
      title: 'مقاله یافت نشد | شوید-آموزش طراحی جواهرات',
      description: 'مقاله مورد نظر یافت نشد. مقالات دیگر درباره طراحی جواهرات با نرم‌افزار ماتریکس را در شوید بخوانید.',
    };
  }

  return {
    title: `${article.title} | شوید-آموزش طراحی جواهرات`,
    description: article.summary || 'مقاله‌ای درباره طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت‌های طراحی زیورآلات را بیاموزید.',
    keywords: [
      'طراحی جواهرات',
      'نرم‌افزار ماتریکس',
      'آموزش طراحی جواهرات',
      ...((article.category || '').split(',').map((k) => k.trim()) || []),
    ],
    openGraph: {
      title: `${article.title} | شوید-آموزش طراحی جواهرات`,
      description: article.summary || 'مقاله‌ای درباره طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت‌های طراحی زیورآلات را بیاموزید.',
      url: `https://shivid.co/blog/${id}`,
      type: 'article',
      images: [
        {
          url: article.thumbnail || 'https://shivid.co/Images/logo.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | شوید-آموزش طراحی جواهرات`,
      description: article.summary || 'مقاله‌ای درباره طراحی جواهرات با نرم‌افزار ماتریکس. با شوید، مهارت‌های طراحی زیورآلات را بیاموزید.',
      image: article.thumbnail || 'https://shivid.co/Images/logo.png',
    },
  };
}

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