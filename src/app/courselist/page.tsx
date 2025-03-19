import CourseList from '@/Components/CourseList/CourseList'
import Footer from '@/Components/Footer/Footer'
import Header from '@/Components/Header/Header'
import { SimpleCourse } from '@/lib/Types/Types';
import { notFound } from 'next/navigation';
import React from 'react'



async function fetchCourseData(): Promise<SimpleCourse[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("دوره یافت نشد");
  }

  const data = await response.json();
  return data; // Expecting an array of SimpleCourse
}

export default async function page() {
  let courseList: SimpleCourse[];

  try {
    courseList = await fetchCourseData(); // Fetch an array of courses
  } catch (error) {
    console.error("خطا در دریافت داده‌ها:", error);
    notFound(); // Show 404 page
  }

  return (
    <div>
      <Header />
      <CourseList mockCourses={courseList} />
      <Footer />
    </div>
  );
}