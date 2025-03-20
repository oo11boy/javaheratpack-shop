import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import { Course } from '@/lib/Types/Types';

const CourseSidebar: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-green-400 mb-4">جزئیات دوره</h2>
      <div className="space-y-4">
        <p className="flex items-center gap-2 text-gray-300">
          <Clock className="w-5 h-5 text-green-400" /> مدت زمان: {course.duration}
        </p>
        <p className="flex items-center gap-2 text-gray-300">
          <BookOpen className="w-5 h-5 text-green-400" /> نوع دسترسی: {course.accessType}
        </p>
        <p className="flex items-center gap-2 text-gray-300">
          <Award className="w-5 h-5 text-green-400" /> پیش‌نیازها: {course.prerequisites.join(', ')}
        </p>
        <div className="text-gray-300">
          <strong className="text-green-400">ویژگی‌ها:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {course.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <p className="text-gray-300">
          <strong className="text-green-400">مخاطبان:</strong> {course.targetAudience.join(', ')}
        </p>
      </div>
    </div>
  );
};

export default CourseSidebar;