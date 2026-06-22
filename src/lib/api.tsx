// src/lib/api.ts
import { Article, Course, CourseVideo, Instructor, SimpleCourse } from "./Types/Types";

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // 1 ساعت

// تابع کمکی برای تشخیص زمان بیلد
function isBuildTime(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

// تابع کمکی برای گرفتن آدرس API
function getApiBaseUrl(): string {
  // در زمان بیلد، از آدرس کامل استفاده کن
  if (isBuildTime()) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://shivid.co/api';
  }
  // در زمان توسعه، از localhost استفاده کن
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

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
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  } catch (error) {
    console.error(`خطا در fetch از ${url}:`, error);
    throw error;
  }
}

export async function getInstructor(): Promise<Instructor | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Instructor>(`${baseUrl}/instructors`);
  } catch (error) {
    console.error('خطا در دریافت اطلاعات مربی:', error);
    return null;
  }
}

export async function getCourses(): Promise<SimpleCourse[]> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<SimpleCourse[]>(`${baseUrl}/courses`);
  } catch (error) {
    console.error('خطا در دریافت دوره‌ها:', error);
    return [];
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Course>(`${baseUrl}/courses/${slug}`);
  } catch (error) {
    console.error(`خطا در دریافت دوره با slug ${slug}:`, error);
    return null;
  }
}

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

export async function getArticles(): Promise<Article[]> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Article[]>(`${baseUrl}/articles`);
  } catch (error) {
    console.error('خطا در دریافت مقالات:', error);
    return [];
  }
}

export async function getArticlesbyid(id: string): Promise<Article | null> {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Article>(
      `${baseUrl}/articles/${id}`
    );
  } catch (error) {
    console.error(`خطا در دریافت مقاله با id ${id}:`, error);
    return null;
  }
}