"use client";

import React, { useState } from "react";
import { BookOpen, Calendar, User, MessageCircle } from "lucide-react";
import Image from "next/image"; // اضافه کردن next/image

interface Article {
  title: string;
  author: string;
  date: string;
  summary: string;
  content: string;
  heroImage: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const articleData: Article = {
  title: "راهنمای جامع طراحی جواهرات مدرن",
  author: "نازنین مقدم",
  date: "1403/12/28",
  summary:
    "در این مقاله به بررسی تکنیک‌های مدرن طراحی جواهرات و ابزارهای مورد نیاز برای خلق آثار هنری پرداخته‌ایم.",
  content:
    "طراحی جواهرات مدرن ترکیبی از خلاقیت و فناوری است. در این مقاله، نازنین مقدم، مدرس برجسته این حوزه، شما را با مراحل طراحی، انتخاب مواد اولیه و استفاده از نرم‌افزارهای پیشرفته آشنا می‌کند. این مقاله برای هنرجویان مبتدی و حرفه‌ای مناسب است و نکات کلیدی برای شروع یک پروژه موفق را ارائه می‌دهد.",
  heroImage: "https://picsum.photos/1200/600?random=3",
};

// نمونه نظرات اولیه
const initialComments: Comment[] = [
  { id: 1, author: "سارا حسینی", text: "مقاله بسیار کاربردی بود، ممنون!", date: "1403/12/29" },
  { id: 2, author: "علی رضایی", text: "لطفاً درباره نرم‌افزارها بیشتر توضیح دهید.", date: "1403/12/30" },
];

const SingleArticle: React.FC = () => {
  const article = articleData;
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState({ author: "", text: "" });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.author && newComment.text) {
      const today = new Date().toLocaleDateString("fa-IR").replace(/\/\d{2}$/, ""); // تاریخ به فرمت شمسی
      const comment: Comment = {
        id: comments.length + 1,
        author: newComment.author,
        text: newComment.text,
        date: today,
      };
      setComments([...comments, comment]);
      setNewComment({ author: "", text: "" }); // ریست کردن فرم
    }
  };

  return (
    <div className="min-h-screen ccontainer bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full ccontainer flex flex-col gap-10 animate-fade-in">
        {/* Hero Section */}
        <div className="relative bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
          <Image
            src={article.heroImage}
            alt={article.title}
            width={1200} // بر اساس منبع (1200px)
            height={600} // بر اساس منبع (600px)
            className="w-full h-[300px] md:h-[400px] object-cover opacity-80"
            sizes="(max-width: 768px) 100vw, 1200px" // 100vw در موبایل، 1200px در دسکتاپ
            priority // چون تصویر بالای صفحه است
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-[#0dcf6c]/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-10 text-center w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0dcf6c] animate-pulse-once">
              {article.title}
            </h1>
            <div className="flex justify-center items-center gap-4 mt-3 text-gray-300">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#0dcf6c]" /> {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#0dcf6c]" /> {article.date}
              </span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
          {/* Summary */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0dcf6c] flex items-center gap-2">
              <BookOpen className="w-7 h-7" /> خلاصه مقاله
            </h2>
            <p className="text-gray-300 mt-3 leading-relaxed">{article.summary}</p>
          </div>

          {/* Full Content */}
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-[#0dcf6c] mb-4">متن کامل</h3>
            <p className="text-gray-300 leading-relaxed">{article.content}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col gap-8">
          <h3 className="text-xl md:text-2xl font-semibold text-[#0dcf6c] flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> نظرات
          </h3>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-[#2a3347]/70 rounded-lg flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#0dcf6c] font-semibold flex items-center gap-2">
                      <User className="w-5 h-5" /> {comment.author}
                    </span>
                    <span className="text-gray-400 text-sm">{comment.date}</span>
                  </div>
                  <p className="text-gray-300">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">هنوز نظری ثبت نشده است. اولین نفر باشید!</p>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4 mt-6">
            <h4 className="text-lg font-semibold text-[#0dcf6c]">ارسال نظر جدید</h4>
            <input
              type="text"
              placeholder="نام شما"
              value={newComment.author}
              onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
              className="p-3 bg-[#2a3347]/70 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c]/50"
            />
            <textarea
              placeholder="نظر خود را بنویسید"
              value={newComment.text}
              onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
              className="p-3 bg-[#2a3347]/70 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c]/50 resize-y min-h-[100px]"
            />
            <button
              type="submit"
              disabled={!newComment.author || !newComment.text}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ارسال نظر
              <MessageCircle className="w-5 h-5" />
            </button>
          </form>
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

export default SingleArticle;