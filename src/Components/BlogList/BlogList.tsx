"use client";

import React, { useState } from "react";
import { FileText, Search, Filter, ChevronDown, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/Types/Types";



interface BlogListProps {
  mockArticles: Article[]; // prop برای دریافت مقالات از صفحه
}

const BlogList: React.FC<BlogListProps> = ({ mockArticles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = Array.from(new Set(mockArticles.map((article) => article.category)));

  const filteredArticles = mockArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] flex items-center gap-3 animate-pulse-once">
            <FileText className="w-10 h-10" />
            لیست مقالات
          </h1>
          <p className="text-gray-300 text-center max-w-xl">
            جدیدترین مقالات آموزشی و تحلیلی برای به‌روز ماندن با دنیای تکنولوژی
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="جستجوی مقاله..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 pl-12 bg-[#2a3347] text-white rounded-full border border-[color:var(--primary-color)]/20 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all shadow-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-1/4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-full p-4 bg-[color:var(--primary-color)] text-black rounded-full flex items-center justify-between hover:bg-[#0aaf5a] transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {selectedCategory || "همه دسته‌بندی‌ها"}
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>
            {isFilterOpen && (
              <div className="absolute top-14 left-0 w-full bg-[#2a3347] rounded-lg shadow-xl z-10 animate-fade-in">
                <ul className="py-2">
                  <li
                    onClick={() => {
                      setSelectedCategory(null);
                      setIsFilterOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-[color:var(--primary-color)]/20 hover:text-[color:var(--primary-color)] cursor-pointer transition-colors"
                  >
                    همه دسته‌بندی‌ها
                  </li>
                  {categories.map((category) => (
                    <li
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-[color:var(--primary-color)]/20 hover:text-[color:var(--primary-color)] cursor-pointer transition-colors"
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Article List */}
        {filteredArticles.length === 0 ? (
          <p className="text-gray-400 text-center py-8 text-lg">مقاله‌ای با این مشخصات یافت نشد!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-[#2a3347]/70 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer border border-[color:var(--primary-color)]/20"
              >
                <div className="relative">
                  <Image
                    src={article.thumbnail}
                    alt={article.title}
                    width={300}
                    height={200}
                    className="w-full h-52 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-4 right-4 bg-[color:var(--primary-color)]/80 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[color:var(--primary-color)] transition-colors line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                  <Link
                    href={`/bloglist/${article.id}`}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    خواندن مقاله
                    <ChevronDown className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default BlogList;