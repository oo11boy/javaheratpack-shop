import CourseDetails from '@/Components/CourseDetails/CourseDetails';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { Course } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

async function fetchCourseData(slug: string): Promise<Course> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`, {
    cache: 'default', // رفتار پیش‌فرض مرورگر برای کش
    next: { revalidate: 3600 }, // اختیاری: کش Next.js برای 1 ساعت
  });
  if (!response.ok) throw new Error('دوره یافت نشد');
  return response.json();
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let course: Course;
  try {
    course = await fetchCourseData(resolvedParams.slug);
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