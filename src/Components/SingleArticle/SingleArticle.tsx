"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, User, MessageCircle } from "lucide-react";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import "./SingleArticle.css";
import { Check } from "@mui/icons-material";
import { Article } from "@/lib/Types/Types";

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface SingleArticleProps {
  articleData: Article;
}

const SingleArticle: React.FC<SingleArticleProps> = ({ articleData }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/articles/${articleData.id}/comments`,{cache:"no-cache"});
        if (!res.ok) throw new Error("خطا در دریافت کامنت‌ها");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleData.id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author || !newComment.text) return;

    try {
      const res = await fetch(`/api/articles/${articleData.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error("خطا در ارسال کامنت");
      const { message } = await res.json();

      setSubmitMessage(message);
      setNewComment({ author: "", text: "" });
     
    } catch (error) {
      console.error("خطا در ارسال کامنت:", error);
      setSubmitMessage("خطا در ارسال کامنت");
    }
  };

  const sanitizedContent = sanitizeHtml(articleData.content, {
    allowedTags: [
      "h1",
      "h2",
      "p",
      "img",
      "video",
      "source",
      "br",
      "strong",
      "em",
    ],
    allowedAttributes: {
      img: ["src", "alt", "style"],
      video: ["src", "controls", "style"],
    },
  });

  return (
    <div className="article-page">
      <div className="article-container animate-fade-in">
        {/* Hero Section */}
        <div className="article-hero">
          <Image
            src={articleData.heroImage}
            alt={articleData.title}
            width={1200}
            height={400}
            className="w-full"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="article-hero-content">
            <h1>{articleData.title}</h1>
            <div className="article-meta">
              <span>
                <User className="w-5 h-5 text-[color:var(--primary-color)]" />{" "}
                {articleData.author}
              </span>
              <span>
                <Calendar className="w-5 h-5 text-[color:var(--primary-color)]" />{" "}
                {articleData.date}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="article-summary-section">
          <h2>
            <BookOpen className="w-7 h-7" /> خلاصه مقاله
          </h2>
          <p>{articleData.summary}</p>
        </div>

        {/* Content Section */}
        <div className="article-content-section">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>
            <MessageCircle className="w-6 h-6" /> نظرات
          </h3>
          {loading ? (
            <p>در حال بارگذاری کامنت‌ها...</p>
          ) : comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">
                      <User className="w-5 h-5" /> {comment.author}
                    </span>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>هنوز کامنت تأییدشده‌ای وجود ندارد.</p>
          )}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <h4>ارسال نظر جدید</h4>
           
            <input
              type="text"
              placeholder="نام شما"
              value={newComment.author}
              onChange={(e) =>
                setNewComment({ ...newComment, author: e.target.value })
              }
            />
            <textarea
              placeholder="نظر خود را بنویسید"
              value={newComment.text}
              onChange={(e) =>
                setNewComment({ ...newComment, text: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={!newComment.author || !newComment.text}
            >
              <MessageCircle className="w-5 h-5 ml-2" />
              ارسال نظر
            </button>
            {submitMessage && (
              <p
                className={`text-lg flex items-center justify-center gap-2 text-center border p-4 rounded-2xl border-[color:var(--primary-color)] my-4 ${
                  submitMessage.includes("خطا")
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                <Check />
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
