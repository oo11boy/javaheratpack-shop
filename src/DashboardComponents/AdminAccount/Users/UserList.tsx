// src\app\components\UserList.tsx
"use client";

import { Edit, Trash2, UserPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  name: string;
  lastname: string;
  courseid: string | null;
  vip: number;
  phonenumber: string;
}

const UserList: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', { cache: 'no-cache' });
      if (!response.ok) throw new Error('خطا در دریافت کاربران');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در دریافت کاربران');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) return;

    setIsDeleting(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('خطا در حذف کاربر');
      await fetchUsers();
      alert('کاربر با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا:', error);
      alert('خطا در حذف کاربر: ' + (error as Error).message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (userId: number) => {
    router.push(`/admin/useredit/${userId}`);
  };

  const handleAddUser = () => {
    router.push('/admin/useradd');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in relative">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[color:var(--primary-color)] mb-8 flex items-center gap-3">
          <UserPlus className="w-8 h-8" />
          مدیریت کاربران
        </h2>

        <motion.button
          onClick={handleAddUser}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-black rounded-full transition-all duration-300 shadow-lg hover:from-[#0aaf5a] hover:to-[#088f4a] hover:shadow-xl flex items-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          افزودن کاربر جدید
        </motion.button>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[color:var(--primary-color)] border-solid"></div>
          </div>
        ) : users.length === 0 ? (
          <p className="text-gray-300 text-center py-6">هیچ کاربری یافت نشد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[color:var(--primary-color)]/10 to-[#2a3347] text-white">
                  <th className="p-4 font-semibold">شناسه</th>
                  <th className="p-4 font-semibold">ایمیل</th>
                  <th className="p-4 font-semibold">نام</th>
                  <th className="p-4 font-semibold">نام خانوادگی</th>
                  <th className="p-4 font-semibold">شماره تلفن</th>
                  <th className="p-4 font-semibold">نوع کاربر</th>
                  <th className="p-4 font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-[color:var(--primary-color)]/20 hover:bg-[#2a3347] transition-colors duration-200"
                  >
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{user.name}</td>
                    <td className="p-4">{user.lastname}</td>
                    <td className="p-4">{user.phonenumber}</td>
                    <td className="p-4">{user.vip === 1 ? 'ادمین' : 'کاربر عادی'}</td>
                    <td className="p-4 flex gap-2">
                      <motion.button
                        onClick={() => handleEdit(user.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-[color:var(--primary-color)] text-black rounded-full hover:bg-[#0aaf5a] transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <Edit className="w-5 h-5" />
                        ویرایش
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(user.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isDeleting === user.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {isDeleting === user.id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            حذف
                          </>
                        )}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </main>
  );
};

export default UserList;