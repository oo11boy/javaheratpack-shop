import React from 'react';
import ArticleSwiper from './ArticleSwiper';
import { Article } from '@/lib/Types/Types';
import { ArticleOutlined } from '@mui/icons-material';
import './Articles.css';
export const ArticleSlider: React.FC<{ mockArticles: Article[] }> = ({ mockArticles }) => {

  return (
    <div className="bg-gradient-to-b to-gray-900 from-gray-800 py-16">
      <div className="ccontainer mx-auto px-4 relative">
      

          <h2 className="!text-xl border inline-block p-2 text-white border-[color:var(--primary-color)] yekanh rounded-xl items-center gap-3 mb-12">
              <ArticleOutlined fontSize="large" className="text-[color:var(--primary-color)] ml-2" />
          آخرین مقالات
            </h2>
        <ArticleSwiper articles={mockArticles} />
      </div>
    </div>
  );
}