import React from 'react';
import Image from 'next/image';
import { Instructor } from '@/lib/Types/Types';

const HeroSection: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  return (
    <div className="relative bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
      <Image
        src={instructor.heroImage}
        alt="Jewelry Design"
        width={1200}
        height={600}
        className="w-full h-[300px] md:h-[400px] object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[color:var(--primary-color)]/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-10 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[color:var(--primary-color)] animate-pulse-once">
          {instructor.name}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mt-2">{instructor.title}</p>
      </div>
    </div>
  );
};

export default HeroSection;