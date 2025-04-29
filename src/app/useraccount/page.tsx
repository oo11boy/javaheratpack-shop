import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import DashboardAccount from '@/DashboardComponents/UserAccount/DashboardAccount/DashboardAccount';

// تعریف متا دیتا
export const metadata = {
  title: 'شوید-آموزش طراحی جواهرات | حساب کاربری',
  description: 'حساب کاربری خود را در شوید مدیریت کنید و به دوره‌های طراحی جواهرات با نرم‌افزار ماتریکس دسترسی پیدا کنید.',
  keywords: ['حساب کاربری', 'آموزش طراحی جواهرات', 'نرم‌افزار ماتریکس', 'شوید'],
  openGraph: {
    title: 'شوید-آموزش طراحی جواهرات | حساب کاربری',
    description: 'حساب کاربری خود را در شوید مدیریت کنید و به دوره‌های طراحی جواهرات با نرم‌افزار ماتریکس دسترسی پیدا کنید.',
    url: 'https://shivid.co/useraccount',
    type: 'website',
    images: [
      {
        url: 'https://shivid.co/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'حساب کاربری شوید',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شوید-آموزش طراحی جواهرات | حساب کاربری',
    description: 'حساب کاربری خود را در شوید مدیریت کنید و به دوره‌های طراحی جواهرات با نرم‌افزار ماتریکس دسترسی پیدا کنید.',
    image: 'https://shivid.co/Images/logo.png',
  },
};

export default function Page() {
  return (
    <div>
      <Header />
      <DashboardAccount />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;