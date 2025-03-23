import CourseDetails from '@/Components/CourseDetails/CourseDetails';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getCourseBySlug } from '@/lib/api';
import { Course } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';
// بقیه ایمپورت‌ها بدون تغییر

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