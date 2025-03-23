import React from 'react';
import { Course } from '@/lib/Types/Types';
import CourseHero from './CourseHero';
import CoursePurchaseBox from './CoursePurchaseBox';
import CourseSidebar from './CourseSidebar';
import CourseDescription from './CourseDescription';
import { Check, Star } from 'lucide-react';
import CourseSyllabus from './CourseSyllabus';
import CourseInstructor from './CourseInstructor';
import CourseReviews from './CourseReviews';

const CourseDetails: React.FC<{ CourseData: Course; }> = ({ CourseData }) => {
   const course = CourseData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="ccontainer mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CourseHero course={course} />
          <div className="p-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--primary-color)] animate-fade-in">
              {course.title}
            </h1>
          </div>
          <div className="lg:hidden space-y-6">
            <CoursePurchaseBox  course={course} />
            <CourseSidebar    course={course} />
          </div>
          <CourseDescription description={course.description} />
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-[color:var(--primary-color)]/30">
            <h2 className="text-2xl font-semibold text-[color:var(--primary-color)] flex items-center gap-2 mb-6 animate-pulse">
              <Star className="w-6 h-6 animate-spin-slow" /> در این دوره می‌آموزید
            </h2>
            <div className="space-y-4">
              {[
                "طراحی دستی جواهرات",
                "مدل‌سازی سه‌بعدی با نرم‌افزار",
                "ساخت عملی جواهرات",
                "بازاریابی و فروش آثار",
              ].map((text, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <div className="p-2 bg-[color:var(--primary-color)]/20 rounded-full group-hover:bg-[color:var(--primary-color)]/40 transition-all duration-300">
                    <Check className="w-6 h-6 text-[color:var(--primary-color)]" />
                  </div>
                  <p className="text-gray-200 font-medium group-hover:text-green-300 transition-colors duration-300">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
          <CourseSyllabus syllabus={course.syllabus} />
          <CourseInstructor instructor={course.instructor} />
          <CourseReviews />
        </div>
        <aside className="hidden lg:block lg:col-span-1">
          <CourseSidebar course={course} />
        </aside>
      </div>
    </div>
  );
};

export default CourseDetails;