import React from 'react';
import { SchoolOutlined } from '@mui/icons-material';

const CourseSectionHeader: React.FC = () => {
  return (
    <h2 className="!text-xl border inline-block p-2 border-[#0dcf6c] yekanh rounded-xl items-center gap-3 mb-12">
      <SchoolOutlined fontSize="large" className="text-[#0dcf6c] ml-2" />
      دوره‌های آموزشی
    </h2>
  );
};

export default CourseSectionHeader;