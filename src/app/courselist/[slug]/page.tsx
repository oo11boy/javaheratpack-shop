import CourseDetails from "@/Components/CourseDetails/CourseDetails";
import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { Course } from "@/lib/Types/Types";
import { notFound } from "next/navigation";


async function fetchCourseData(slug: string): Promise<Course> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/courses/${slug}`;
  const response = await fetch(apiUrl, {
    cache: "no-store", // برای SSR همیشه داده تازه بگیره
  });

  if (!response.ok) {
    throw new Error("دوره یافت نشد");
  }

  const data = await response.json();
  return data;
}

export default async function Page({ params }: { params: { slug: string } }) {
  let course: Course;

  try {
    course = await fetchCourseData(params.slug);
  } catch (error) {
    console.error("خطا در دریافت داده‌ها:", error);
    notFound(); // صفحه 404 رو نشون می‌ده
  }
console.log(course)
  return (
    <div>
      <Header />
      <CourseDetails CourseData={course} />
      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic"; // مطمئن می‌شه که صفحه همیشه داینامیک رندر بشه