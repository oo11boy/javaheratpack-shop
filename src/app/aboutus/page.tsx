import AboutUs from '@/Components/AboutUs/AboutUs';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { getInstructor } from '@/lib/api';
// بقیه ایمپورت‌ها بدون تغییر

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