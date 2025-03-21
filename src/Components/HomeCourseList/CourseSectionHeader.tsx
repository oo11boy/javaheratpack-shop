import React from 'react';
import { SchoolOutlined } from '@mui/icons-material';

const CourseSectionHeader: React.FC = () => {
  return (
    <h2 className="!text-xl border inline-block p-2 border-[color:var(--primary-color)] yekanh rounded-xl items-center gap-3 mb-12">
      <SchoolOutlined fontSize="large" className="text-[color:var(--primary-color)] ml-2" />
      دوره‌های آموزشی
    </h2>
  );
};

export default CourseSectionHeader;