// AdminHeader.tsx
import { Menu } from "lucide-react";
import React from "react";

export default function AdminHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between md:hidden sticky top-0 z-40">
      <button
        onClick={toggleSidebar}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Menu className="w-6 h-6 text-gray-600" />
      </button>
      <h2 className="text-lg font-semibold text-gray-800">پنل مدیریت</h2>
      <div className="w-6" />
    </header>
  );
}