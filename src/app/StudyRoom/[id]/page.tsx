import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import CourseVideoPlayer from '@/Components/StudyRoom/CourseVideoPlayer/CourseVideoPlayer';
import { CourseVideo } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';

async function fetchCourseData(id: number): Promise<CourseVideo[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/coursesvideo?courseid=${id}`, {
    next: { revalidate: 3600 }, // ISR برای بازسازی هر ۱ ساعت
  });
  if (!response.ok) throw new Error('دوره یافت نشد');
  return response.json();
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let videos: CourseVideo[];
  try {
    videos = await fetchCourseData(parseInt(resolvedParams.id));
    if (!videos || videos.length === 0) notFound();
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
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

export const revalidate = 3600; // بازسازی صفحه هر ۱ ساعت