import React from 'react'

export default function Footer() {
  return (
    <div className="flex items-center justify-center py-6 bg-gray-900 text-gray-300">
    <span className="text-sm font-medium">طراحی شده توسط</span>
    <a 
      href="https://unicodewebdesign.com" 
      className="mr-2 text-[color:var(--primary-color)]  font-semibold text-base hover:text-[#0bb55a] transition-colors duration-300   decoration-2 decoration-[color:var(--primary-color)]/50"
    >
      یونیکد
      
    </a>
  </div>
  )
}
