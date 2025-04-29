import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import PurchaseFailure from '@/Components/PurchaseFailure/PurchaseFailure';

// تعریف متا دیتا
export const metadata = {
  title: 'شوید-آموزش طراحی جواهرات | خرید ناموفق',
  description: 'متأسفانه خرید دوره طراحی جواهرات انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
  keywords: ['خرید ناموفق', 'آموزش طراحی جواهرات', 'نرم‌افزار ماتریکس', 'شوید'],
  openGraph: {
    title: 'شوید-آموزش طراحی جواهرات | خرید ناموفق',
    description: 'متأسفانه خرید دوره طراحی جواهرات انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
    url: 'https://shivid.co/PurchaseFailure',
    type: 'website',
    images: [
      {
        url: 'https://shivid.co/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'خرید ناموفق دوره طراحی جواهرات',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شوید-آموزش طراحی جواهرات | خرید ناموفق',
    description: 'متأسفانه خرید دوره طراحی جواهرات انجام نشد. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
    image: 'https://shivid.co/Images/logo.png',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <PurchaseFailure errorMessage="خطا در اتصال به درگاه پرداخت." />
      <Footer />
    </>
  );
}

export const revalidate = 3600;