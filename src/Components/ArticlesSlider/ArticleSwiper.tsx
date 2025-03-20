"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Article } from './ArticlesSlider';
import ArticleCard from './ArticleCard';

interface ArticleSwiperProps {
  articles: Article[];
}

const ArticleSwiper: React.FC<ArticleSwiperProps> = ({ articles }) => {
  return (
    <>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ 
          clickable: true,
          el: '.custom-pagination'
        }}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id}>
            <ArticleCard article={article} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination mt-8 flex justify-center"></div>
    </>
  );
};

export default ArticleSwiper;