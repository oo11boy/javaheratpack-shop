import AboutUs from '@/Components/AboutUs/AboutUs';
import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import { Instructor } from '@/lib/Types/Types';

async function fetchInstructorData(): Promise<Instructor> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instructors`, {
    cache: 'force-cache', // استفاده از کش مرورگر
    next: { revalidate: 3600 }, // ISR برای Next.js
  });
  if (!response.ok) throw new Error('خطا در دریافت اطلاعات مدرس');
  return response.json();
}

export default async function AboutPage() {
  let instructor;
  try {
    instructor = await fetchInstructorData();
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