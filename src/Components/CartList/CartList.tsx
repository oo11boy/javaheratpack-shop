"use client";

import React, { useState } from "react";
import { ShoppingCart, X, Trash2, Info, Tag, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";



const CartList: React.FC = () => {
  const { Cart, setCart,isCartOpen,setIsCartOpen} = useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const removeItem = (id: number) => {
    setCart(Cart.filter((item) => item.id !== id));
  };

  const applyDiscountCode = () => {
    if (discountCode.toLowerCase() === "save20") {
      setAppliedDiscount(0.2);
    } else if (discountCode.toLowerCase() === "save10") {
      setAppliedDiscount(0.1);
    } else {
      setAppliedDiscount(0);
    }
  };

  const totalBasePrice = Cart.reduce((sum, item) => sum + item.price, 0);

  let packageDiscount = 0;
  const packageCount = Cart.length;
  if (packageCount === 2) packageDiscount = 0.1;
  if (packageCount === 3) packageDiscount = 0.2;

  const maxDiscount = Math.max(packageDiscount, appliedDiscount);
  const discountedPrice = totalBasePrice * (1 - maxDiscount);
  const discountAmount = totalBasePrice - discountedPrice;

  return (
    <div className="relative font-sans">
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-[#1B2535] p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 z-20 group"
      >
        <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
        {Cart.length > 0 && (
          <span className="bg-[#1B2535] text-[color:var(--primary-color)] rounded-full w-7 h-7 flex items-center justify-center font-bold shadow-md">
            {Cart.length}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/3 bg-gradient-to-br from-[#121824] via-[#1e2636] to-[#2a3347] text-white shadow-2xl transform transition-all duration-500 ease-in-out z-30 ${
          isCartOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[color:var(--primary-color)] flex items-center gap-2 animate-pulse-short">
              <ShoppingCart className="w-8 h-8" />
              سبد خرید
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-gray-300 hover:text-[color:var(--primary-color)] transition-colors p-2 rounded-full hover:bg-[#2a3347]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Discount Info */}
          <div className="bg-[#2a3347]/80 rounded-xl p-4 mb-4 border border-[color:var(--primary-color)]/30 shadow-inner">
            <p className="text-sm text-gray-200 flex items-center gap-2">
              <Info className="w-5 h-5 text-[color:var(--primary-color)]" />
              شرایط تخفیف ویژه با محدودیت زمانی: 
            </p>
            <ul className="text-xs text-gray-300 mt-2 space-y-2">
         
              <li className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[color:var(--primary-color)]" />
                با خرید ۲ دوره آموزشی: ۱۰٪ تخفیف   روی تمام دوره ها دریافت میکنید
              </li>
        
              <li className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[color:var(--primary-color)]" />
             با خرید ۳ دوره آموزشی: ۲۰٪ تخفیف روی تمام دوره ها دریافت میکنید
              </li>
            </ul>
          </div>

          {/* Discount Code Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowDiscountInput(!showDiscountInput)}
              className="text-[color:var(--primary-color)] text-sm hover:text-[#0aaf5a] transition-colors flex items-center gap-2"
            >
              <Tag className="w-5 h-5" />
              کد تخفیف دارید؟
            </button>
            {showDiscountInput && (
              <div className="mt-2 animate-fade-in">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد تخفیف را وارد کنید"
                    className="flex-1 p-3 rounded-lg bg-[#2a3347] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                  />
                  <button
                    onClick={applyDiscountCode}
                    className="px-4 py-2 bg-[color:var(--primary-color)] text-white rounded-lg hover:bg-[#0aaf5a] transition-all duration-300"
                  >
                    اعمال
                  </button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-sm text-[color:var(--primary-color)] mt-2">
                    تخفیف {appliedDiscount * 100}% اعمال شد!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cart Items */}
          {Cart.length === 0 ? (
            <p className="text-gray-400 text-center py-8 animate-fade-in flex-1 flex items-center justify-center">
              سبد خرید شما خالی است!
            </p>
          ) : (
            <div className="flex-[2] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {Cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#2a3347]/80 rounded-xl p-4 flex items-center gap-4 hover:bg-[#2a3347] transition-all duration-300 border border-[color:var(--primary-color)]/30 shadow-md hover:shadow-lg"
                >
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-md object-cover shadow-sm"
                    sizes="64px"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-white line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {item.price.toLocaleString()} تومان
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total and Checkout */}
          {Cart.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="space-y-3 bg-[#2a3347]/80 p-4 rounded-xl border border-[color:var(--primary-color)]/30">
                <div className="flex justify-between text-sm">
                  <span>جمع اولیه:</span>
                  <span className="text-gray-300">
                    {totalBasePrice.toLocaleString()} تومان
                  </span>
                </div>
                {maxDiscount > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>تخفیف ({maxDiscount * 100}%):</span>
                      <span className="text-[color:var(--primary-color)]">
                        {discountAmount.toLocaleString()} تومان
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>جمع نهایی:</span>
                      <span className="text-[color:var(--primary-color)]">
                        {discountedPrice.toLocaleString()} تومان
                      </span>
                    </div>
                  </>
                )}
              </div>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                تکمیل خرید
                <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isCartOpen && (
        <div
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 animate-fade-in"
        />
      )}

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulseShort {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-pulse-short {
          animation: pulseShort 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2a3347;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0dcf6c;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0aaf5a;
        }
      `}</style>
    </div>
  );
};

export default CartList;