"use client";
import React, { useState, useCallback, useEffect } from "react";
import { X, Mail, Lock, User, Phone, ChevronLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isEmailRegistered, setIsEmailRegistered] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // پیام موفقیت
  const router = useRouter();
  const pathname = usePathname();
  const { setIsLoggedIn, refreshUserData } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  // پاک کردن پیام موفقیت پس از 3 ثانیه
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        handleClose(); // بستن مودال پس از محو شدن پیام
      }, 3000); // 3 ثانیه
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const checkEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth?email=${encodeURIComponent(email)}`, {
        cache: "no-store",
      });
      const data: { exists: boolean; error?: string } = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در بررسی ایمیل");
      return data.exists;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message === "Email check failed" ? "خطا در بررسی ایمیل" : err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const registered = await checkEmail(email);
    setIsEmailRegistered(registered);
    setStep(2);
  };

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = isLogin
        ? { email, password }
        : { email, password, name: firstName, lastname: lastName, phonenumber: phoneNumber };

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data: { redirect?: string; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(
          data.error === "Invalid credentials"
            ? "ایمیل یا رمز عبور اشتباه است"
            : data.error === "Name and lastname required"
            ? "نام و نام خانوادگی الزامی است"
            : data.error === "Email and password required"
            ? "ایمیل و رمز عبور الزامی است"
            : "خطا در عملیات"
        );
      }

      setIsLoggedIn(true);
      await refreshUserData();
      setSuccessMessage(isLogin ? "ورود با موفقیت انجام شد!" : "ثبت‌نام با موفقیت انجام شد!");
      router.push(pathname);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setIsEmailRegistered(null);
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg bg-[#2a3347]/95 rounded-3xl shadow-2xl border border-[color:var(--primary-color)]/20 p-6 sm:p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-[color:var(--primary-color)] transition-colors p-2 rounded-full hover:bg-[#2a3347]"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-3xl">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[color:var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-[#0aaf5a] border-t-transparent rounded-full animate-spin-slow opacity-50"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-gradient-to-r from-red-500/20 to-red-700/20 border border-red-500/50 rounded-lg text-white text-center shadow-md animate-pulse">
            <span className="font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="fixed top-3 left-[55%] transform -translate-x-1/2 p-3 bg-gradient-to-r from-green-500/90 to-[#0aaf5a]/90 rounded-lg text-white text-center shadow-lg animate-tooltip">
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
              ورود یا ثبت‌نام
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Mail className="w-5 h-5 text-[color:var(--primary-color)]" />
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              ادامه
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        )}

        {step === 2 && isEmailRegistered !== null && (
          <div className="space-y-6">
            {isEmailRegistered ? (
              <form onSubmit={(e) => handleAuth(e, true)} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
                  ورود
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base text-center">
                    ایمیل: {email}
                  </p>
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <Lock className="w-5 h-5 text-[color:var(--primary-color)]" />
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  ورود
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => handleAuth(e, false)} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
                  ثبت‌نام
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base text-center">
                    ایمیل: {email}
                  </p>
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <User className="w-5 h-5 text-[color:var(--primary-color)]" />
                    نام
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="نام خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                    required
                    disabled={isLoading}
                  />
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <User className="w-5 h-5 text-[color:var(--primary-color)]" />
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                    required
                    disabled={isLoading}
                  />
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <Phone className="w-5 h-5 text-[color:var(--primary-color)]" />
                    شماره تلفن
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="شماره تلفن خود را وارد کنید (مثال: 09123456789)"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                    required
                    disabled={isLoading}
                    pattern="09[0-9]{9}"
                    title="شماره تلفن باید با 09 شروع شود و 11 رقم باشد"
                  />
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <Lock className="w-5 h-5 text-[color:var(--primary-color)]" />
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  ثبت‌نام و ورود
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spinSlow {
          to {
            transform: rotate(-360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes tooltip {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          10% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          90% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-spin-slow {
          animation: spinSlow 1.5s linear infinite;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        .animate-tooltip {
          animation: tooltip 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;