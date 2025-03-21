"use client";
import React, { useState, useEffect, useRef } from 'react';
import { SimpleCourse } from '@/lib/Types/Types';
import HomeCourseCard from './HomeCourseCard';

interface CourseGridProps {
  courses: SimpleCourse[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current; // کپی کردن مقدار ref به یک متغیر محلی
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentSection) {
            observer.unobserve(currentSection);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []); // آرایه وابستگی خالی است، زیرا فقط یک بار در زمان مونت اجرا می‌شود

  return (
    <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <HomeCourseCard
          key={course.id}
          course={course}
          isVisible={isVisible}
          index={index}
        />
      ))}
    </div>
  );
};

export default CourseGrid;