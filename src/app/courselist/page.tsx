import CourseList from '@/Components/CourseList/CourseList';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getCourses } from '@/lib/api';
import { SimpleCourse } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

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