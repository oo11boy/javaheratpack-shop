import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Article } from './ArticlesSlider';

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="group relative bg-gray-800 rounded-2xl shadow-lg overflow-hidden h-[400px] flex flex-col transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-gray-700">
      <div className="relative overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          width={500}
          height={600}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <span className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {article.date}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="!text-lg font-semibold text-white mb-3 group-hover:text-[#0dcf6c] transition-colors duration-300 line-clamp-1">
          {article.title}
        </h3>
        <p className="text-gray-300 !text-sm mb-4 flex-grow line-clamp-2">
          {article.excerpt}
        </p>
        <Link
          href={`/bloglist/${article.id}`}
          className="bg-[#0dcf6c] cursor-pointer text-gray-900 px-5 py-2 rounded-lg hover:bg-[#0bb55a] transition-all duration-300 transform hover:scale-105 font-medium mt-auto"
        >
          مطالعه بیشتر
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ArticleCard;