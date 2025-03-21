import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import HeroSection from '@/Components/HeroSection/HeroSection';
import Nemone from '@/Components/Nemone/Nemone';
import { SimpleCourse } from '@/lib/Types/Types';
import HomeCourseList from '@/Components/HomeCourseList/HomeCourseList';
import ArticleSlider from '@/Components/ArticlesSlider/ArticlesSlider';
import { getCourses } from '@/lib/api';

export default async function Page() {
  let jewelryCourses: SimpleCourse[] = [];
  try {
    jewelryCourses = await getCourses();
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