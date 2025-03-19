// AboutUs Component (Client Component)
"use client";
import React from 'react';
import { User, Phone, Instagram, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';

interface Instructor {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  heroImage: string;
  phone: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
}

const AboutUs: React.FC<{ instructor: Instructor | null }> = ({ instructor }) => {
  if (!instructor) {
    return <div className="text-white text-center">مدرس یافت نشد</div>;
  }

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full flex flex-col gap-10 animate-fade-in">
        {/* Hero Section */}
        <div className="relative bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <Image
            src={instructor.heroImage}
            alt="Jewelry Design"
            width={1200}
            height={600}
            className="w-full h-[300px] md:h-[400px] object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#0dcf6c]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-center w-full">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0dcf6c] animate-pulse-once">
              {instructor.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mt-2">{instructor.title}</p>
          </div>
        </div>

        {/* Instructor Profile */}
        <div className="bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Image
              src={instructor.avatar}
              alt={instructor.name}
              width={300}
              height={300}
              className="w-40 h-40 md:w-64 md:h-64 rounded-full object-cover ring-4 ring-[#0dcf6c]/50 shadow-lg transition-all duration-300 hover:ring-[#0dcf6c]/70"
            />
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#0dcf6c] rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Bio & Contact */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0dcf6c] flex items-center gap-2">
                درباره {instructor.name}
              </h2>
              <p className="text-gray-300 mt-3 leading-relaxed max-w-2xl">
                {instructor.bio}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-semibold text-[#0dcf6c]">راه‌های ارتباطی</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <a
                  href={`tel:${instructor.phone}`}
                  className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[#0dcf6c]/20 transition-all duration-300"
                >
                  <Phone className="w-6 h-6 text-[#0dcf6c]" />
                  <span className="text-gray-300 hover:text-[#0dcf6c] transition-colors">
                    {instructor.phone}
                  </span>
                </a>
                {/* Telegram */}
                <a
                  href={`https://t.me/${instructor.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[#0dcf6c]/20 transition-all duration-300"
                >
                  <Send className="w-6 h-6 text-[#0dcf6c]" />
                  <span className="text-gray-300 hover:text-[#0dcf6c] transition-colors">
                    {instructor.telegram}
                  </span>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${instructor.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[#0dcf6c]/20 transition-all duration-300"
                >
                  <MessageCircle className="w-6 h-6 text-[#0dcf6c]" />
                  <span className="text-gray-300 hover:text-[#0dcf6c] transition-colors">
                    {instructor.whatsapp}
                  </span>
                </a>
                {/* Instagram */}
                <a
                  href={`https://instagram.com/${instructor.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#2a3347]/70 rounded-lg hover:bg-[#0dcf6c]/20 transition-all duration-300"
                >
                  <Instagram className="w-6 h-6 text-[#0dcf6c]" />
                  <span className="text-gray-300 hover:text-[#0dcf6c] transition-colors">
                    {instructor.instagram}
                  </span>
                </a>
              </div>
            </div>
            {/* Call to Action */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-4">
                برای اطلاعات بیشتر یا ثبت‌نام در دوره‌ها، با من تماس بگیرید!
              </p>
              <a
                href={`https://wa.me/${instructor.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                تماس با من
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulseOnce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-pulse-once {
          animation: pulseOnce 0.8s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;