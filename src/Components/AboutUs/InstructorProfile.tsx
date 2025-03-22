"use client";
import React from 'react';
import Image from 'next/image';
import ContactLinks from './ContactLinks';
import { Instructor } from '@/lib/Types/Types';

const InstructorProfile: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  return (
    <div className="bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Image
          src={instructor.avatar}
          alt={instructor.name}
          width={300}
          height={300}
          className="w-40 h-40 md:w-64 md:h-64 rounded-full object-cover ring-4 ring-[color:var(--primary-color)]/50 shadow-lg transition-all duration-300 hover:ring-[color:var(--primary-color)]/70"
        />
     
      </div>

      {/* Bio & Contact */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--primary-color)] flex items-center gap-2">
            درباره {instructor.name}
          </h2>
          <p className="text-gray-300 mt-3 leading-relaxed max-w-2xl">
            {instructor.bio}
          </p>
        </div>
        <ContactLinks instructor={instructor} />
      </div>
    </div>
  );
};

export default InstructorProfile;