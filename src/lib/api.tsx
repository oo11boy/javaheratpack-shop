// src/lib/api.ts
import { Article, Course, CourseVideo, Instructor, SimpleCourse } from "./Types/Types";
import { cache } from "react";

function isBuildTime(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

function getApiBaseUrl(): string {
  if (isBuildTime()) {
    return process.env.NEXT_PUBLIC_API_URL || 'https://shivid.co/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
}

// Fetch پایه با لاگ بهتر برای دیباگ بیلد
const fetchWithCache = cache(
  async function <T>(url: string, options: RequestInit = {}): Promise<T> {
    const isBuild = isBuildTime();
    
    if (isBuild) {
      console.log(`[Build] Fetching: ${url}`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // افزایش timeout برای بیلد

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        cache: "force-cache",
        next: { 
          revalidate: 3600,
          tags: ['articles', 'courses', 'instructor']
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (isBuild) {
        console.log(`[Build] Success: ${url} - ${Array.isArray(data) ? data.length : 'OK'} items`);
      }

      return data;
    } catch (error: any) {
      if (isBuild) {
        console.error(`[Build Error] Failed to fetch ${url}:`, error.message);
      } else {
        console.error(`خطا در fetch از ${url}:`, error);
      }
      
      // در زمان بیلد اگر خطا داد، داده خالی برنگردون (برای مقالات مهم)
      throw error;
    }
  }
);

// ====================== API Functions ======================

export const getArticles = cache(async (): Promise<Article[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Article[]>(`${baseUrl}/articles`);
  } catch (error) {
    console.error('خطا در دریافت مقالات:', error);
    
    // در زمان بیلد حداقل یک آرایه خالی مطمئن برگردون
    if (isBuildTime()) {
      console.warn('⚠️ مقالات در زمان بیلد لود نشدند. صفحه بدون مقاله ساخته می‌شود.');
    }
    return [];
  }
});

export const getArticlesbyid = cache(async (id: string): Promise<Article | null> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Article>(`${baseUrl}/articles/${id}`);
  } catch (error) {
    console.error(`خطا در دریافت مقاله ${id}:`, error);
    return null;
  }
});

// بقیه توابع (بدون تغییر زیاد)
export const getInstructor = cache(async (): Promise<Instructor | null> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Instructor>(`${baseUrl}/instructors`);
  } catch (error) {
    console.error('خطا در دریافت اطلاعات مربی:', error);
    return null;
  }
});

export const getCourses = cache(async (): Promise<SimpleCourse[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<SimpleCourse[]>(`${baseUrl}/courses`);
  } catch (error) {
    console.error('خطا در دریافت دوره‌ها:', error);
    return [];
  }
});

export const getCourseBySlug = cache(async (slug: string): Promise<Course | null> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<Course>(`${baseUrl}/courses/${slug}`);
  } catch (error) {
    console.error(`خطا در دریافت دوره ${slug}:`, error);
    return null;
  }
});

export const getCourseVideos = cache(async (courseId: number): Promise<CourseVideo[]> => {
  try {
    const baseUrl = getApiBaseUrl();
    return await fetchWithCache<CourseVideo[]>(
      `${baseUrl}/coursesvideo?courseid=${courseId}`
    );
  } catch (error) {
    console.error(`خطا در دریافت ویدیوهای دوره ${courseId}:`, error);
    return [];
  }
});