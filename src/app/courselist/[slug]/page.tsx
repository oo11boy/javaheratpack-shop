import CourseDetails from '@/Components/CourseDetails/CourseDetails';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getCourseBySlug, getUser } from '@/lib/api';
import { Course, UserData } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

export const revalidate = 0; // غیرفعال کردن کش برای SSR واقعی

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let course: Course;
  let userdata: UserData | null = null;

  // دریافت اطلاعات دوره
  try {
    course = await getCourseBySlug(resolvedParams.slug);
    console.log('اطلاعات دوره:', course);
  } catch (error) {
    console.error('خطا در دریافت داده‌های دوره:', error);
    notFound();
  }

  // دریافت اطلاعات کاربر
  try {
    userdata = await getUser();
    console.log('اطلاعات کاربر نهایی:', userdata);
  } catch (error) {
    console.error('خطا در دریافت داده‌های کاربر:', error);
    userdata = null;
  }

  return (
    <div>
      <Header />
      <CourseDetails CourseData={course} userdata={userdata} />
      <Footer />
    </div>
  );
}