"use client";
import React from 'react';
import { Phone, Instagram, MessageCircle, Send } from 'lucide-react';
import { Instructor } from '@/lib/Types/Types';


const ContactLinks: React.FC<{ instructor: Instructor }> = ({ instructor }) => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-[color:var(--primary-color)]">راه‌های ارتباطی</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`tel:${instructor.phone}`}
            className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[color:var(--primary-color)]/20 transition-all duration-300"
          >
            <Phone className="w-6 h-6 text-[color:var(--primary-color)]" />
            <span className="text-gray-300 hover:text-[color:var(--primary-color)] transition-colors">
              {instructor.phone}
            </span>
          </a>
          <a
            href={`https://t.me/${instructor.telegram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[color:var(--primary-color)]/20 transition-all duration-300"
          >
            <Send className="w-6 h-6 text-[color:var(--primary-color)]" />
            <span className="text-gray-300 hover:text-[color:var(--primary-color)] transition-colors">
              {instructor.telegram}
            </span>
          </a>
          <a
            href={`https://wa.me/${instructor.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[color:var(--primary-color)]/20 transition-all duration-300"
          >
            <MessageCircle className="w-6 h-6 text-[color:var(--primary-color)]" />
            <span className="text-gray-300 hover:text-[color:var(--primary-color)] transition-colors">
              {instructor.whatsapp}
            </span>
          </a>
          <a
            href={`https://instagram.com/${instructor.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[color:var(--primary-color)]/20 transition-all duration-300"
          >
            <Instagram className="w-6 h-6 text-[color:var(--primary-color)]" />
            <span className="text-gray-300 hover:text-[color:var(--primary-color)] transition-colors">
              {instructor.instagram}
            </span>
          </a>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-4">
          برای اطلاعات بیشتر یا ثبت‌نام در دوره‌ها، با من تماس بگیرید!
        </p>
        <a
          href={`https://wa.me/${instructor.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          تماس با من
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </>
  );
};

export default ContactLinks;