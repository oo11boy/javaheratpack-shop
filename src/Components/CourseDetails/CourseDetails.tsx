"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingCart,
  Award,
  PlayCircle,
  Check,
} from "lucide-react";

interface Course {
  title: string;
  description: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  duration: string;
  accessType: string;
  price: number;
  discountPrice?: number;
  introVideo: string;
  bannerImage: string;
  syllabus: { title: string; description: string }[];
  features: string[];
  prerequisites: string[];
  targetAudience: string[];
}

const courseData: Course = {
  title: "دوره جامع طراحی جواهرات مدرن",
  description:
    "این دوره شما را با تکنیک‌های پیشرفته طراحی جواهرات آشنا می‌کند و از صفر تا صد، از ایده‌پردازی تا اجرا، همراه شماست. چه مبتدی باشید چه حرفه‌ای، این دوره به شما کمک می‌کند تا خلاقیت خود را به آثار هنری تبدیل کنید. در این دوره مهارت‌های طراحی دستی، کار با نرم‌افزارهای تخصصی و تکنیک‌های ساخت را خواهید آموخت.",
  instructor: {
    name: "نازنین مقدم",
    bio: "نازنین مقدم، هنرمند و مدرس برجسته با ۱۵ سال تجربه در طراحی جواهرات و آموزش حرفه‌ای. او در بیش از ۲۰ نمایشگاه بین‌المللی شرکت کرده و جوایز متعددی کسب کرده است.",
    avatar: "https://picsum.photos/300?random=1",
  },
  duration: "۸ هفته (۴۸ ساعت)",
  accessType: "آنلاین و آفلاین (دسترسی مادام‌العمر)",
  price: 2500000,
  discountPrice: 2000000,
  introVideo:
    "https://caspian2.cdn.asset.aparat.com/aparat-video/f19e4e02d9ec2a53d3c84de1fc32c3bf45842597-480p.mp4?wmsAuthSign=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjIyMDQ2YTEzNDIwNDBlYjhhNzcwZGU3MWFlYmQyMGMyIiwiZXhwIjoxNzQyMzk5NzA0LCJpc3MiOiJTYWJhIElkZWEgR1NJRyJ9.UQFAOtfJpHIYZfR9tUl73ES4ZP-u1bNdQq3zAUIbqrY",
  bannerImage: "",
  syllabus: [
    { title: "مقدمه‌ای بر طراحی جواهرات", description: "آشنایی با مفاهیم پایه و ابزارها." },
    { title: "طراحی با نرم‌افزار", description: "آموزش رندرینگ و مدل‌سازی سه‌بعدی." },
    { title: "ساخت و اجرا", description: "مراحل عملی ساخت جواهرات." },
    { title: "بازاریابی آثار", description: "چگونه جواهرات خود را به بازار عرضه کنید." },
  ],
  features: [
    "پشتیبانی اختصاصی توسط مدرس",
    "پروژه‌های عملی و واقعی",
    "گواهینامه معتبر پایان دوره",
    "دسترسی به انجمن اختصاصی هنرجویان",
  ],
  prerequisites: ["علاقه به طراحی", "آشنایی اولیه با کامپیوتر", "بدون نیاز به تجربه قبلی"],
  targetAudience: [
    "علاقمندان به طراحی جواهرات",
    "طراحان مبتدی و حرفه‌ای",
    "کارآفرینان حوزه مد و هنر",
  ],
};

const CourseDetails: React.FC = () => {
  const course = courseData;
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const purchaseBoxRef = useRef<HTMLDivElement>(null);
  const initialTopRef = useRef<number>(0);

  useEffect(() => {
    if (descriptionRef.current) {
      setDescriptionHeight(descriptionRef.current.scrollHeight);
    }

    if (purchaseBoxRef.current) {
      // ذخیره موقعیت اولیه المان نسبت به بالای صفحه
      initialTopRef.current = purchaseBoxRef.current.getBoundingClientRect().top + window.scrollY;
    }

    const handleScroll = () => {
      if (purchaseBoxRef.current) {
        const scrollPosition = window.scrollY;
        const elementTop = initialTopRef.current;

        // وقتی اسکرول از موقعیت اولیه المان عبور کنه، استیکی می‌شه
        if (scrollPosition > elementTop) {
          setIsSticky(true);
        }
        // وقتی به موقعیت اولیه یا بالاتر برمی‌گرده، از استیکی خارج می‌شه
        else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current?.paused) {
      setIsPlaying(false);
    }
  };

  const learningFeatures = [
    { icon: <Check className="w-6 h-6 text-green-400" />, text: "طراحی دستی جواهرات" },
    { icon: <Check className="w-6 h-6 text-green-400" />, text: "مدل‌سازی سه‌بعدی با نرم‌افزار" },
    { icon: <Check className="w-6 h-6 text-green-400" />, text: "ساخت عملی جواهرات" },
    { icon: <Check className="w-6 h-6 text-green-400" />, text: "بازاریابی و فروش آثار" },
  ];

  // کامپوننت جزئیات دوره
  const CourseDetailsSection = () => (
    <div className="space-y-4">
      <p className="flex items-center gap-2 text-gray-300">
        <Clock className="w-5 h-5 text-green-400" /> مدت زمان: {course.duration}
      </p>
      <p className="flex items-center gap-2 text-gray-300">
        <BookOpen className="w-5 h-5 text-green-400" /> نوع دسترسی: {course.accessType}
      </p>
      <p className="flex items-center gap-2 text-gray-300">
        <Award className="w-5 h-5 text-green-400" /> پیش‌نیازها:{" "}
        {course.prerequisites.join(", ")}
      </p>
      <p className="text-gray-300">
        <strong className="text-green-400">ویژگی‌ها:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          {course.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </p>
      <p className="text-gray-300">
        <strong className="text-green-400">مخاطبان:</strong>{" "}
        {course.targetAudience.join(", ")}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section with Video */}
          <section className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <video
              ref={videoRef}
              className="w-full h-64 md:h-96 object-cover rounded-2xl transition-transform duration-500 hover:scale-[1.02]"
              poster={course.bannerImage}
              controls
              onPause={handlePause}
              onPlay={() => setIsPlaying(true)}
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

          {/* Course Title */}
          <div className="p-4">
            <h1 className="text-3xl md:text-4xl font-bold text-green-400 animate-fade-in">
              {course.title}
            </h1>
          </div>

          {/* Quick Purchase Box for Mobile/Tablet */}
          <div className="lg:hidden space-y-6">
            <div
              ref={purchaseBoxRef}
              className={`bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 transition-all duration-300 ${
                isSticky
                  ? "fixed top-0 left-0 right-0 z-10 mx-4 md:mx-8"
                  : "relative"
              }`}
            >
              <div className="text-lg font-bold text-green-400 mb-4">
                {course.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-500">
                      {course.price.toLocaleString()} تومان
                    </span>
                    <span>{course.discountPrice.toLocaleString()} تومان</span>
                  </div>
                ) : (
                  <span>{course.price.toLocaleString()} تومان</span>
                )}
              </div>
              <button className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <ShoppingCart className="w-5 h-5" /> ثبت‌نام در دوره
              </button>
            </div>
            {/* نمایش جزئیات دوره در موبایل و تبلت */}
            <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold text-green-400 mb-4">جزئیات دوره</h2>
              <CourseDetailsSection />
            </div>
          </div>

          {/* Course Description */}
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
            <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" /> درباره دوره
            </h2>
            <div className="relative">
              <div
                ref={descriptionRef}
                className="text-gray-300 leading-relaxed overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  height: isDescriptionExpanded ? `${descriptionHeight}px` : "4rem",
                }}
              >
                {course.description}
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

          {/* What You Will Learn */}
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-green-500/30">
            <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-6 animate-pulse">
              <Star className="w-6 h-6 animate-spin-slow" /> در این دوره می‌آموزید
            </h2>
            <div className="space-y-4">
              {learningFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <div className="p-2 bg-green-500/20 rounded-full group-hover:bg-green-500/40 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <p className="text-gray-200 font-medium group-hover:text-green-300 transition-colors duration-300">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Syllabus */}
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6" /> سرفصل‌ها
            </h2>
            <div className="space-y-4">
              {course.syllabus.map((item, index) => (
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
                      expandedSection === index ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="mt-2 text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Instructor */}
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row gap-6 items-center hover:shadow-xl transition-shadow">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-md transform hover:scale-105 transition-transform"
            />
            <div>
              <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2">
                <User className="w-6 h-6" /> مدرس دوره
              </h2>
              <p className="text-xl text-green-400 mt-2">{course.instructor.name}</p>
              <p className="text-gray-300 mt-2">{course.instructor.bio}</p>
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-green-400 flex items-center gap-2 mb-4">
              <Star className="w-6 h-6" /> نظرات هنرجویان
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                <p className="text-gray-300">"دوره‌ای بی‌نظیر با محتوای غنی!"</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-green-400 fill-green-400" />
                  <p className="text-green-400 text-sm">- سارا حسینی</p>
                </div>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
                <p className="text-gray-300">"مدرس بسیار حرفه‌ای و دلسوز."</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-5 h-5 text-green-400 fill-green-400" />
                  <p className="text-green-400 text-sm">- علی رضایی</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: Course Details (Desktop Only, Sticky) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-green-400 mb-4">جزئیات دوره</h2>
            <div className="space-y-4">
              <CourseDetailsSection />
              <div className="text-lg font-bold text-green-400">
                {course.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-500">
                      {course.price.toLocaleString()} تومان
                    </span>
                    <span>{course.discountPrice.toLocaleString()} تومان</span>
                  </div>
                ) : (
                  <span>{course.price.toLocaleString()} تومان</span>
                )}
              </div>
              <button className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <ShoppingCart className="w-5 h-5" /> ثبت‌نام در دوره
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetails;