"use client";
import React, { useState, useRef, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';
import { Course } from '@/lib/Types/Types';

const CourseHero: React.FC<{ course: Course }> = ({ course }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('pause', () => setIsPlaying(false));
      video.addEventListener('play', () => setIsPlaying(true));
      return () => {
        video.removeEventListener('pause', () => setIsPlaying(false));
        video.removeEventListener('play', () => setIsPlaying(true));
      };
    }
  }, []);

  return (
    <section className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
      <video
        ref={videoRef}
        className="w-full h-64 md:h-96 object-cover rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
        poster={course.bannerImage}
        controls
      >
        <source src={course.introVideo} type="video/mp4" />
        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      {!isPlaying && (
        <button
          onClick={handlePlayVideo}
          className="absolute inset-0 hidden lg:flex items-center justify-center group"
        >
          <PlayCircle
            className="w-16 h-16 text-green-400 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
            strokeWidth={2}
          />
        </button>
      )}
    </section>
  );
};

export default CourseHero;