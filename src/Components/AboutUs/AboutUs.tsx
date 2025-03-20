import React from 'react';
import "./AboutUs.css";
import InstructorProfile from './InstructorProfile';
import HeroSection from './HeroSection';
import { Instructor } from '@/lib/Types/Types';

const AboutUs: React.FC<{ instructor: Instructor | null }> = ({ instructor }) => {
  if (!instructor) {
    return <div className="text-white text-center">مدرس یافت نشد</div>;
  }

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full flex flex-col gap-10 animate-fade-in">
        <HeroSection instructor={instructor} />
        <InstructorProfile instructor={instructor} />
      </div>
    </div>
  );
};

export default AboutUs;