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
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

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