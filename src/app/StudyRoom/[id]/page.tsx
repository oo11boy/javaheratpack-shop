import Footer from '@/Components/Footer/Footer';
import Header from '@/Components/Header/Header';
import CourseVideoPlayer from '@/Components/StudyRoom/CourseVideoPlayer/CourseVideoPlayer';
import { CourseVideo } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import { getConnection } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getCourseVideos } from '@/lib/api';
import { RowDataPacket } from 'mysql2/promise';

const JWT_SECRET = process.env.JWT_SECRET || "cc6478c5badae87c098b5fef7e841305706296775504172f2aea8078359b9cfc";

// تعریف تایپ برای کاربر
interface User extends RowDataPacket {
  courseid: string | null;
}

async function fetchCourseData(id: number): Promise<CourseVideo[]> {
  return getCourseVideos(id);
}

async function checkUserAccess(courseId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return { isAuthenticated: false, hasAccess: false };

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    console.log('Decoded JWT:', decoded);

    const connection = await getConnection();
    const [users] = await connection.execute<User[]>(
      'SELECT courseid FROM accounts WHERE id = ?',
      [decoded.id]
    );
    await connection.end();

    const user = users[0];
    console.log('User from DB:', user);
    if (!user || !user.courseid) return { isAuthenticated: true, hasAccess: false };

    let courseIds: string[];
    console.log('Raw courseid:', user.courseid);

    if (typeof user.courseid === 'string') {
      try {
        const parsed = JSON.parse(user.courseid);
        console.log('Parsed as JSON:', parsed);
        // اگر پارس‌شده یک آرایه نیست، آن را به آرایه تبدیل کن
        courseIds = Array.isArray(parsed) ? parsed : [parsed.toString()];
      } catch (error) {
        console.log('JSON parse failed, splitting string:', error);
        courseIds = user.courseid.split(',').map((id: string) => id.trim()).filter(Boolean);
      }
    } else {
      courseIds = [];
      console.log('courseid is not a string, setting empty array');
    }

    console.log('Final Course IDs:', courseIds);
    const hasAccess = courseIds.includes(courseId.toString());
    console.log('Course ID to check:', courseId, 'Has access:', hasAccess);
    return { isAuthenticated: true, hasAccess };
  } catch (error) {
    console.error('Error verifying user access:', error);
    return { isAuthenticated: false, hasAccess: false };
  }
}

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);

  const { isAuthenticated, hasAccess } = await checkUserAccess(courseId);

  if (!isAuthenticated) redirect('../');
  if (!hasAccess) redirect('../useraccount');

  let videos: CourseVideo[] = [];
  try {
    videos = await fetchCourseData(courseId);
  } catch (error) {
    console.error('خطا در دریافت داده‌ها:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#121824] text-white">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        {videos.length > 0 ? (
          <CourseVideoPlayer videos={videos} />
        ) : (
          <div className="max-w-md w-full p-6 bg-[#1a2233] rounded-lg shadow-lg animate-fade-in text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">به زودی در دسترس شماست!</h2>
            <p className="text-gray-300 text-lg">
              محتوای این دوره هنوز آماده نشده. ما در حال کار روی اون هستیم و به زودی می‌تونید ازش استفاده کنید.
            </p>
            <div className="mt-6">
              <Link href={'../useraccount'} className="inline-block bg-[color:var(--primary-color)] text-white py-2 px-4 rounded-full text-sm font-semibold">
                بازگشت به حساب کاربری
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export const revalidate = 3600;