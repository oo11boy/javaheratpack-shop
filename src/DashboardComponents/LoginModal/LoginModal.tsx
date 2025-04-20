"use client";

import React, { useState, useCallback, useEffect } from "react";
import { X, Mail, Lock, User, Phone, ChevronLeft, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [forgotPasswordCode, setForgotPasswordCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isPhone, setIsPhone] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setIsLoggedIn, refreshUserData, handleRedirectAfterLogin } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const isValidEmail = (input: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const isValidPhone = (input: string) => {
    return /^09[0-9]{9}$/.test(input);
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (isValidEmail(identifier)) {
      setIsPhone(false);
      setEmail(identifier);
      try {
        // بررسی وجود ایمیل
        const checkResponse = await fetch(`/api/auth?identifier=${encodeURIComponent(identifier)}`);
        const checkData = await checkResponse.json();
        if (!checkResponse.ok) throw new Error(checkData.error || "خطا در بررسی شناسه");

        if (checkData.exists) {
          setIsRegistered(true);
          setStep(2);
          return;
        }

        // ارسال کد تأیید
        const response = await fetch("/api/auth/send-verification-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "خطا در ارسال کد تأیید");

        setIsRegistered(false);
        setStep(3);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error("خطای ناشناخته");
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else if (isValidPhone(identifier)) {
      setIsPhone(true);
      setPhoneNumber(identifier);
      try {
        // بررسی وجود شماره موبایل
        const checkResponse = await fetch(`/api/auth?identifier=${encodeURIComponent(identifier)}`);
        const checkData = await checkResponse.json();
        if (!checkResponse.ok) throw new Error(checkData.error || "خطا در بررسی شناسه");

        if (checkData.exists) {
          setIsRegistered(true);
          setStep(2);
          return;
        }

        // ارسال کد تأیید
        const response = await fetch("/api/auth/send-verification-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: identifier }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "خطا در ارسال کد تأیید");

        setIsRegistered(false);
        setStep(3);
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error("خطای ناشناخته");
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("لطفاً ایمیل یا شماره موبایل معتبر وارد کنید");
      setIsLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: isPhone ? phoneNumber : email,
          code: verificationCode,
          isPhone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در تأیید کد");

      setStep(2);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const payload = isLogin
        ? { identifier: isPhone ? phoneNumber : email, password }
        : {
            identifier: isPhone ? phoneNumber : email,
            password,
            name: firstName,
            lastname: lastName,
            phonenumber: isPhone ? phoneNumber : phoneNumber,
            email: isPhone ? email : email,
          };

      // اگر ثبت‌نام است، بررسی ایمیل و شماره موبایل
      if (!isLogin) {
        const checkEmail = isPhone ? email : identifier;
        const checkPhone = isPhone ? identifier : phoneNumber;
        if (checkEmail && checkPhone) {
          const checkResponse = await fetch(
            `/api/auth?email=${encodeURIComponent(checkEmail)}&phoneNumber=${encodeURIComponent(checkPhone)}`
          );
          const checkData = await checkResponse.json();
          if (!checkResponse.ok) throw new Error(checkData.error || "خطا در بررسی اطلاعات");

          if (checkData.emailExists) {
            throw new Error("این ایمیل قبلاً ثبت شده است");
          }
          if (checkData.phoneExists) {
            throw new Error("این شماره موبایل قبلاً ثبت شده است");
          }
        }
      }

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
            ? "ایمیل/شماره یا رمز عبور اشتباه است"
            : data.error === "Name and lastname required"
            ? "نام و نام خانوادگی الزامی است"
            : data.error === "Identifier and password required"
            ? "ایمیل/شماره و رمز عبور الزامی است"
            : data.error || "خطا در عملیات"
        );
      }

      setIsLoggedIn(true);
      await refreshUserData();
      handleRedirectAfterLogin();
      setSuccessMessage(isLogin ? "ورود با موفقیت انجام شد!" : "ثبت‌نام با موفقیت انجام شد!");
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: isPhone ? phoneNumber : email, isPhone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در ارسال کد تأیید");

      setStep(4);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-forgot-password-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: isPhone ? phoneNumber : email,
          code: forgotPasswordCode,
          isPhone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در تأیید کد");

      setStep(5);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: isPhone ? phoneNumber : email,
          newPassword,
          isPhone,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "خطا در تنظیم رمز عبور");

      setSuccessMessage("رمز عبور با موفقیت تغییر کرد!");
      setStep(2);
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error("خطای ناشناخته");
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setIdentifier("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setEmail("");
    setVerificationCode("");
    setForgotPasswordCode("");
    setNewPassword("");
    setIsRegistered(null);
    setIsPhone(false);
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
          <form onSubmit={handleIdentifierSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
              ورود یا ثبت‌نام
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Mail className="w-5 h-5 text-[color:var(--primary-color)]" />
                ایمیل یا شماره موبایل
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ایمیل یا شماره موبایل (مثال: 09123456789)"
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

        {step === 2 && isRegistered !== null && (
          <div className="space-y-6">
            {isRegistered ? (
              <form onSubmit={(e) => handleAuth(e, true)} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
                  ورود
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base text-center">
                    {isPhone ? `شماره موبایل: ${phoneNumber}` : `ایمیل: ${email}`}
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
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[color:var(--primary-color)] hover:underline text-right w-full"
                    disabled={isLoading}
                  >
                    رمز عبور خود را فراموش کرده‌اید؟
                  </button>
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
                    {isPhone ? `شماره موبایل: ${phoneNumber}` : `ایمیل: ${email}`}
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
                  {isPhone ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                        <Phone className="w-5 h-5 text-[color:var(--primary-color)]" />
                        شماره موبایل
                      </label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="شماره موبایل (مثال: 09123456789)"
                        className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[color:var(--primary-color)]/30 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary-color)] transition-all"
                        required
                        disabled={isLoading}
                      />
                    </>
                  )}
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

        {step === 3 && (
          <form onSubmit={handleVerificationCodeSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
              تأیید {isPhone ? "شماره موبایل" : "ایمیل"}
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm sm:text-base text-center">
                {isPhone ? `شماره موبایل: ${phoneNumber}` : `ایمیل: ${email}`}
              </p>
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Key className="w-5 h-5 text-[color:var(--primary-color)]" />
                کد تأیید
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="کد تأیید را وارد کنید"
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
              تأیید کد
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleForgotPasswordCodeSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
              تأیید کد فراموشی رمز عبور
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm sm:text-base text-center">
                {isPhone ? `شماره موبایل: ${phoneNumber}` : `ایمیل: ${email}`}
              </p>
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Key className="w-5 h-5 text-[color:var(--primary-color)]" />
                کد تأیید
              </label>
              <input
                type="text"
                value={forgotPasswordCode}
                onChange={(e) => setForgotPasswordCode(e.target.value)}
                placeholder="کد تأیید را وارد کنید"
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
              تأیید کد
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        )}

        {step === 5 && (
          <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] bg-clip-text text-center">
              تنظیم رمز عبور جدید
            </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm sm:text-base text-center">
                {isPhone ? `شماره موبایل: ${phoneNumber}` : `ایمیل: ${email}`}
              </p>
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Lock className="w-5 h-5 text-[color:var(--primary-color)]" />
                رمز عبور جدید
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="رمز عبور جدید را وارد کنید"
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
              تنظیم رمز عبور
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spinSlow {
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes tooltip {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          10% { opacity: 1; transform: translate(-50%, 0); }
          90% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -20px); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-spin-slow { animation: spinSlow 1.5s linear infinite; }
        .animate-pulse { animation: pulse 1.5s infinite; }
        .animate-tooltip { animation: tooltip 3s ease-in-out forwards; }
      `}</style>
    </div>
  );
};

export default LoginModal;