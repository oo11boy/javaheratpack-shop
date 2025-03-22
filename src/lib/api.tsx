import { cookies } from 'next/headers';
import { Course, UserData, SimpleCourse, CourseVideo, Instructor } from './Types/Types';

// تابع کمکی برای دریافت توکن از کوکی‌ها
async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  console.log('توکن کوکی:', token);
  return token;
}

// تابع fetch با کش سرور-ساید
async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store', // در SSR نیازی به کش مرورگر نیست
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`خطا در درخواست به ${url}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// توابع دریافت داده‌ها
export async function getInstructor(): Promise<Instructor> {
  return fetchWithCache<Instructor>(`${process.env.NEXT_PUBLIC_API_URL}/instructors`);
}

export async function getCourses(): Promise<SimpleCourse[]> {
  return fetchWithCache<SimpleCourse[]>(`${process.env.NEXT_PUBLIC_API_URL}/courses`);
}

export async function getCourseBySlug(slug: string): Promise<Course> {
  return fetchWithCache<Course>(`${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`);
}

export async function getCourseVideos(courseId: number): Promise<CourseVideo[]> {
  return fetchWithCache<CourseVideo[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/coursesvideo?courseid=${courseId}`
  );
}

export async function getUser(): Promise<UserData | null> {
  const token = await getAuthToken();

  if (!token) {
    console.log('توکن یافت نشد، کاربر وارد نشده است');
    return null;
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
  console.log('URL درخواست:', url);

  try {
    const userData = await fetchWithCache<UserData>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // ارسال توکن در هدر
      },
    });
    console.log('داده‌های کاربر از API:', userData);
    return userData;
  } catch (error) {
    console.error('خطا در دریافت اطلاعات کاربر:', error);
    return null;
  }
}