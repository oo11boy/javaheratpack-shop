// components/Loading.tsx
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const Loading = () => {
  return (
    <>
      <Header />
      <div className="h-[90vh] inset-0 flex items-center justify-center bg-[#121824] bg-opacity-80 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
      </div>
      <Footer />
    </>
  );
};

export default Loading;
