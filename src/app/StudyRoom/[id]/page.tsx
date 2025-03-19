import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import CourseVideoPlayer from '@/Components/StudyRoom/CourseVideoPlayer/CourseVideoPlayer';
import { CourseVideo } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

async function fetchCourseData(id: number): Promise<CourseVideo[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/cousesvideo?courseid=${id}`; // اصلاح نام endpoint به "coursevideos"
  const response = await fetch(apiUrl, {
    cache: "no-store", // برای SSR همیشه داده تازه بگیرد
  });

  if (!response.ok) {
    throw new Error("دوره یافت نشد");
  }

  const data = await response.json();
  return data;
}

export default async function Page({ params }: { params: { id: string } }) { // اصلاح نوع id به string
  let videos: CourseVideo[];

  try {
    videos = await fetchCourseData(parseInt(params.id)); // تبدیل id به عدد
  } catch (error) {
    console.error("خطا در دریافت داده‌ها:", error);
    notFound(); // صفحه 404 را نشان می‌دهد
  }

  // اگر ویدیوها خالی باشند، می‌توانید مدیریت کنید
  if (!videos || videos.length === 0) {
    notFound();
  }

  return (
    <div>
      <Header />
      <CourseVideoPlayer videos={videos} />
      <Footer />
    </div>
  );
}