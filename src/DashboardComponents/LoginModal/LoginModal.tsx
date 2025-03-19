'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, ChevronRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmailRegistered, setIsEmailRegistered] = useState<boolean | null>(null);

  // Simulated email check (replace with actual API call)
  const checkEmail = async (email: string) => {
    // For demo purposes, assume emails ending with "@registered.com" are registered
    return email.endsWith('@registered.com');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registered = await checkEmail(email);
    setIsEmailRegistered(registered);
    setStep(2);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    console.log('Logging in with:', { email, password });
    window.location.href = '/useraccount'; // Redirect to user account
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration logic
    console.log('Registering with:', { email, firstName, lastName, password });
    window.location.href = '/useraccount'; // Redirect to user account
  };

  const resetForm = () => {
    setStep(1);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setIsEmailRegistered(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
      <div className="w-full max-w-md sm:max-w-lg bg-[#2a3347]/95 rounded-3xl shadow-2xl border border-[#0dcf6c]/20 p-6 sm:p-8 transform transition-all duration-500 hover:shadow-[0_0_30px_rgba(13,207,108,0.2)]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-[#0dcf6c] transition-colors p-2 rounded-full hover:bg-[#2a3347]"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] bg-clip-text text-center">
              ورود یا ثبت‌نام
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                <Mail className="w-5 h-5 text-[#0dcf6c]" />
                ایمیل
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ایمیل خود را وارد کنید"
                className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[#0dcf6c]/30 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold"
            >
              ادامه
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </form>
        )}

        {/* Step 2: Login or Register */}
        {step === 2 && isEmailRegistered !== null && (
          <div className="space-y-6">
            {isEmailRegistered ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] bg-clip-text text-center">
                  ورود
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base text-center">
                    ایمیل: {email}
                  </p>
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <Lock className="w-5 h-5 text-[#0dcf6c]" />
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[#0dcf6c]/30 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold"
                >
                  ورود
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            ) : (
              // Registration Form
              <form onSubmit={handleRegister} className="space-y-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] bg-clip-text text-center">
                  ثبت‌نام
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-300 text-sm sm:text-base text-center">
                    ایمیل: {email}
                  </p>
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <User className="w-5 h-5 text-[#0dcf6c]" />
                    نام
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="نام خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[#0dcf6c]/30 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                    required
                  />
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <User className="w-5 h-5 text-[#0dcf6c]" />
                    نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[#0dcf6c]/30 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                    required
                  />
                  <label className="flex items-center gap-2 text-gray-100 text-sm sm:text-base font-medium">
                    <Lock className="w-5 h-5 text-[#0dcf6c]" />
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور خود را وارد کنید"
                    className="w-full p-3 sm:p-4 rounded-lg bg-[#1e2636] text-white border border-[#0dcf6c]/30 focus:outline-none focus:ring-2 focus:ring-[#0dcf6c] transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-base sm:text-lg font-semibold"
                >
                  ثبت‌نام و ورود
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @media (max-width: 640px) {
          .rounded-3xl {
            border-radius: 1.5rem;
          }
          .shadow-2xl {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;