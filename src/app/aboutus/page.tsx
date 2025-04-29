import AboutUs from '@/Components/AboutUs/AboutUs';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getInstructor } from '@/lib/api';

// تعریف متا دیتا
export const metadata = {
  title: 'شوید-آموزش طراحی جواهرات | درباره ما',
  description: 'با تیم شوید و مربیان حرفه‌ای ما در زمینه طراحی جواهرات با نرم‌افزار ماتریکس آشنا شوید.',
  keywords: ['درباره شوید', 'آموزش طراحی جواهرات', 'نرم‌افزار ماتریکس', 'مربیان طراحی جواهرات'],
  openGraph: {
    title: 'شوید-آموزش طراحی جواهرات | درباره ما',
    description: 'با تیم شوید و مربیان حرفه‌ای ما در زمینه طراحی جواهرات با نرم‌افزار ماتریکس آشنا شوید.',
    url: 'https://shivid.co/about',
    type: 'website',
    images: [
      {
        url: 'https://shivid.co/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'درباره تیم شوید',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شوید-آموزش طراحی جواهرات | درباره ما',
    description: 'با تیم شوید و مربیان حرفه‌ای ما در زمینه طراحی جواهرات با نرم‌افزار ماتریکس آشنا شوید.',
    image: 'https://shivid.co/Images/logo.png',
  },
};

export default async function AboutPage() {
  let instructor;
  try {
    instructor = await getInstructor();
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
    instructor = null;
  }

  return (
    <div>
      <Header />
      <AboutUs instructor={instructor} />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;