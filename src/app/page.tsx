import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import HeroSection from '@/Components/HeroSection/HeroSection';
import Nemone from '@/Components/Nemone/Nemone';
import { SimpleCourse } from '@/lib/Types/Types';
import HomeCourseList from '@/Components/HomeCourseList/HomeCourseList';
import ArticleSlider from '@/Components/ArticlesSlider/ArticlesSlider';

async function fetchCourseData(): Promise<SimpleCourse[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
    cache: 'default', // رفتار پیش‌فرض مرورگر برای کش
    next: { revalidate: 3600 }, // اختیاری: کش Next.js برای 1 ساعت
  });
  if (!response.ok) throw new Error('دوره یافت نشد');
  return response.json();
}

export default async function Page() {
  let jewelryCourses: SimpleCourse[] = [];
  try {
    jewelryCourses = await fetchCourseData();
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
  }
  return (
    <>
      <Header />
      <HeroSection />
      <Nemone />
      <HomeCourseList jewelryCourses={jewelryCourses} />
      <ArticleSlider />
      <Footer />
    </>
  );
}