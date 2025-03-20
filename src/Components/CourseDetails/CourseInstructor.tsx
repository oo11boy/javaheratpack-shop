import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { Instructor } from '@/lib/Types/Types';

const CourseInstructor: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center hover:shadow-xl transition-shadow">
      <Image
        src={instructor.avatar}
        alt={instructor.name}
        width={192}
        height={192}
        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-md transform hover:scale-105 transition-transform"
        sizes="(max-width: 768px) 128px, 192px"
      />
      <div>
        <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2">
          <User className="w-6 h-6" /> مدرس دوره
        </h2>
        <p className="text-xl text-green-400 mt-2">{instructor.name}</p>
        <p className="text-gray-300 mt-2">{instructor.bio}</p>
      </div>
    </section>
  );
};

export default CourseInstructor;