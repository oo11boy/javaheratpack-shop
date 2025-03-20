"use client";
import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { SyllabusItem } from '@/lib/Types/Types';

const CourseSyllabus: React.FC<{ syllabus: SyllabusItem[] }> = ({ syllabus }) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  return (
    <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6" /> سرفصل‌ها
      </h2>
      <div className="space-y-4">
        {syllabus.map((item, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-all duration-300"
            onClick={() => toggleSection(index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-green-400">{item.title}</h3>
              {expandedSection === index ? (
                <ChevronUp className="w-5 h-5 text-green-400 transition-transform duration-300" />
              ) : (
                <ChevronDown className="w-5 h-5 text-green-400 transition-transform duration-300" />
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                expandedSection === index ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <p className="mt-2 text-gray-300">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CourseSyllabus;