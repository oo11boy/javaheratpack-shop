import React from 'react';
import { Star } from 'lucide-react';

const CourseReviews: React.FC = () => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-[color:var(--primary-color)] flex items-center gap-2 mb-4">
        <Star className="w-6 h-6" /> نظرات هنرجویان
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
          <p className="text-gray-300">دوره‌ای بی‌نظیر با محتوای غنی!</p>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-5 h-5 text-[color:var(--primary-color)] fill-[color:var(--primary-color)]" />
            <p className="text-[color:var(--primary-color)] text-sm">- سارا حسینی</p>
          </div>
        </div>
        <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
          <p className="text-gray-300">مدرس بسیار حرفه‌ای و دلسوز.</p>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-5 h-5 text-[color:var(--primary-color)] fill-[color:var(--primary-color)]" />
            <p className="text-[color:var(--primary-color)] text-sm">- علی رضایی</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseReviews;