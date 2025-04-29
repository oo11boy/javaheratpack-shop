import CourseList from '@/Components/CourseList/CourseList';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getCourses } from '@/lib/api';
import { SimpleCourse } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

// تعریف متا دیتا
export const metadata = {
  title: 'شوید-آموزش طراحی جواهرات | لیست دوره‌ها',
  description: 'دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس را در شوید کشف کنید و مهارت‌های خود را ارتقا دهید.',
  keywords: ['دوره طراحی جواهرات', 'آموزش ماتریکس', 'طراحی زیورآلات', 'نرم‌افزار ماتریکس', 'آموزش طراحی جواهرات'],
  openGraph: {
    title: 'شوید-آموزش طراحی جواهرات | لیست دوره‌ها',
    description: 'دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس را در شوید کشف کنید و مهارت‌های خود را ارتقا دهید.',
    url: 'https://shivid.co/courselist',
    type: 'website',
    images: [
      {
        url: 'https://shivid.co/Images/logo.png',
        width: 1200,
        height: 630,
        alt: 'دوره‌های طراحی جوahrat با ماتریکس',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'شوید-آموزش طراحی جواهرات | لیست دوره‌ها',
    description: 'دوره‌های حرفه‌ای آموزش طراحی جواهرات با نرم‌افزار ماتریکس را در شوید کشف کنید و مهارت‌های خود را ارتقا دهید.',
    image: 'https://shivid.co/Images/logo.png',
  },
};

export default async function CourseListPage() {
  let courseList: SimpleCourse[];
  try {
    courseList = await getCourses();
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
    notFound();
  }

  return (
    <div>
      <Header />
      <CourseList mockCourses={courseList} />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;