import React from 'react';
import { SimpleCourse } from '@/lib/Types/Types';
import CourseSectionHeader from './CourseSectionHeader';
import CourseGrid from './CourseGrid';

const HomeCourseList: React.FC<{ jewelryCourses: SimpleCourse[] }> = ({ jewelryCourses }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="ccontainer mx-auto px-4">
        <CourseSectionHeader />
        <CourseGrid courses={jewelryCourses} />
      </div>
    </section>
  );
};

export default HomeCourseList;