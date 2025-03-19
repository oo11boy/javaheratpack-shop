// صفحه والد (Server Component)
import CourseList from '@/Components/CourseList/CourseList';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { SimpleCourse } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

async function fetchCourseData(): Promise<SimpleCourse[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error('دوره یافت نشد');
  return response.json();
}

export default async function CourseListPage() {
  let courseList: SimpleCourse[];
  try {
    courseList = await fetchCourseData();
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