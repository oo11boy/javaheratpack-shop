"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

const CourseDescription: React.FC<{ description: string }> = ({ description }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setDescriptionHeight(descriptionRef.current.scrollHeight);
    }
  }, []);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
      <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6" /> درباره دوره
      </h2>
      <div className="relative">
        <div
          ref={descriptionRef}
          className="text-gray-300 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            height: isDescriptionExpanded ? `${descriptionHeight}px` : '4rem',
          }}
        >
          {description}
        </div>
        {!isDescriptionExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-800 via-gray-800/80 to-transparent pointer-events-none" />
        )}
        <button
          onClick={toggleDescription}
          className="absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 -translate-y-2 flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        >
          {isDescriptionExpanded ? (
            <ChevronUp className="w-6 h-6 text-white group-hover:text-gray-100 transition-colors duration-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-white group-hover:text-gray-100 transition-colors duration-300" />
          )}
        </button>
      </div>
    </section>
  );
};

export default CourseDescription;