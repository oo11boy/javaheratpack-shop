import { Article, Course, CourseVideo, Instructor, SimpleCourse } from "./Types/Types";
import { cache } from 'react';

// کش در حافظه (برای توابعی که از React Cache استفاده نمیکنن)
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // 1 ساعت

// تابع کمکی برای تشخیص زمان بیلد
function isBuildTime(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

// تابع کمکی برای گرفتن آدرس API
function getApiBaseUrl(): string {
  if (isBuildTime()) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://shivid.co/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// تابع کش با حافظه (برای توابعی که نمیتونن از React Cache استفاده کنن)
async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  cacheDuration = CACHE_DURATION
): Promise<T> {
  const cacheKey = `${url}_${JSON.stringify(options)}`;

  // چک کردن کش حافظه
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return cached.data as T;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      next: { revalidate: 3600 },
      cache: "force-cache",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    memoryCache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  } catch (error) {
    console.error(`خطا در fetch از ${url}:`, error);
    throw error;
  }
}

// ============== توابع با React Cache ==============

// ۱. دریافت دوره‌ها (با React Cache)
export const getCourses = cache(async (): Promise<SimpleCourse[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/courses`, {
      next: { revalidate: 3600 },
      cache: 'force-cache',
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('خطا در دریافت دوره‌ها:', error);
    return [];
  }
});

// ۲. دریافت مقالات (با React Cache)
export const getArticles = cache(async (): Promise<Article[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/articles`, {
      next: { revalidate: 3600 },
      cache: 'force-cache',
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error('خطا در دریافت مقالات:', error);
    return [];
  }
});

// ============== توابع با کش حافظه (بدون React Cache) ==============

// ۳. دریافت اطلاعات مربی
export async function getInstructor(): Promise<Instructor | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Instructor>(`${baseUrl}/instructors`);
  } catch (error) {
    console.error('خطا در دریافت اطلاعات مربی:', error);
    return null;
  }
}

// ۴. دریافت دوره با اسلاگ
export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Course>(`${baseUrl}/courses/${slug}`);
  } catch (error) {
    console.error(`خطا در دریافت دوره با slug ${slug}:`, error);
    return null;
  }
}

// ۵. دریافت ویدیوهای دوره
export async function getCourseVideos(courseId: number): Promise<CourseVideo[]> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<CourseVideo[]>(
      `${baseUrl}/coursesvideo?courseid=${courseId}`
    );
  } catch (error) {
    console.error(`خطا در دریافت ویدیوهای دوره ${courseId}:`, error);
    return [];
  }
}

// ۶. دریافت مقاله با آی‌دی
export async function getArticlesbyid(id: string): Promise<Article | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Article>(`${baseUrl}/articles/${id}`);
  } catch (error) {
    console.error(`خطا در دریافت مقاله با id ${id}:`, error);
    return null;
  }
}