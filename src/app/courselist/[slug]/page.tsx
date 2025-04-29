import CourseDetails from '@/Components/CourseDetails/CourseDetails';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getCourseBySlug } from '@/lib/api';
import { Course } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

// تولید متا دیتا به‌صورت پویا
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  let course: Course;
  try {
    course = await getCourseBySlug(resolvedParams.slug);
  } catch (error) {
    console.error('خطا در دریافت دوره برای متا دیتا:', error);
    return {
      title: 'دوره یافت نشد | شوید-آموزش طراحی جواهرات',
      description: 'دوره مورد نظر یافت نشد. دوره‌های دیگر طراحی جواهرات با نرم‌افزار ماتریکس را در شوید ببینید.',
    };
  }

  return {
    title: `${course.title} | شوید-آموزش طراحی جواهرات`,
    description: course.description || 'دوره‌ای حرفه‌ای برای یادگیری طراحی جواهرات با نرم‌افزار ماتریکس در شوید.',
    keywords: [
      'دوره طراحی جواهرات',
      'نرم‌افزار ماتریکس',
      'آموزش طراحی جواهرات',
      course.category,
    ],
    openGraph: {
      title: `${course.title} | شوید-آموزش طراحی جواهرات`,
      description: course.description || 'دوره‌ای حرفه‌ای برای یادگیری طراحی جواهرات با نرم‌افزار ماتریکس در شوید.',
      url: `https://shivid.co/courselist/${resolvedParams.slug}`,
      type: 'website',
      images: [
        {
          url: course.thumbnail || 'https://shivid.co/Images/logo.png',
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${course.title} | شوید-آموزش طراحی جواهرات`,
      description: course.description || 'دوره‌ای حرفه‌ای برای یادگیری طراحی جواهرات با نرم‌افزار ماتریکس در شوید.',
      image: course.thumbnail || 'https://shivid.co/Images/logo.png',
    },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let course: Course;
  try {
    course = await getCourseBySlug(resolvedParams.slug);
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
    notFound();
  }

  return (
    <div>
      <Header />
      <CourseDetails CourseData={course} />
      <Footer />
    </div>
  );
}

export const revalidate = 3600;