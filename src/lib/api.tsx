// lib/api.ts
import { Course, CourseVideo, Instructor, SimpleCourse } from "./Types/Types";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // 1 ساعت به میلی‌ثانیه

async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheDuration = CACHE_DURATION
): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options)}`;

  // چک کردن کش
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return cached.data as T;
  }

  // درخواست به سرور
  const response = await fetch(url, {
    ...options,
    next: { revalidate: 3600 }, // ISR برای Next.js
    cache: 'force-cache', // استفاده از کش مرورگر
  });

  if (!response.ok) {
    throw new Error(`خطا در درخواست به ${url}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data as T;
}

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