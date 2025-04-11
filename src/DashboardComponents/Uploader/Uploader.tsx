"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface UploadResponse {
  success: boolean;
  message: string;
  fileLink?: string;
}

interface FileInfo {
  name: string;
  type: "video" | "image";
  link: string;
  date: string;
}

export default function FTPUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/ftp-progress");
          const data = await res.json();
          setProgress(data.progress);
        } catch (error) {
          console.error("خطا در دریافت پیشرفت:", error);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/ftp-files");
        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        }
      } catch (error) {
        console.error("خطا در دریافت فایل‌ها:", error);
        setResponse({ success: false, message: "خطا در دریافت فایل‌ها" });
      }
    };
    fetchFiles();
  }, [response]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024 * 1024) {
      setResponse({ success: false, message: "فایل بزرگ‌تر از ۵ گیگابایت است." });
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setResponse(null);
    setProgress(0);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setResponse({ success: false, message: "لطفاً یک فایل انتخاب کنید." });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    const controller = new AbortController();
    setAbortController(controller);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ftp-upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data: UploadResponse = await res.json();
      setResponse(data);
      if (data.success) {
        setFile(null);
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // به‌روزرسانی لیست فایل‌ها
        const resFiles = await fetch("/api/ftp-files");
        const filesData = await resFiles.json();
        if (filesData.success) {
          setFiles(filesData.files);
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        setResponse({ success: false, message: "آپلود لغو شد." });
      } else {
        setResponse({
          success: false,
          message: `خطا در ارتباط با سرور: ${error.message}`,
        });
      }
      setProgress(0);
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  };

  const handleCancel = async () => {
    if (abortController && file) {
      abortController.abort();
      setIsLoading(false);
      setProgress(0);
      setResponse({ success: false, message: "آپلود لغو شد." });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // تعیین مسیر فایل برای حذف
      const videoExtensions = [".mp4", ".mkv", ".avi", ".mov"];
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      let filePath = file.name;
      if (videoExtensions.includes(extension)) {
        filePath = `cvideo/${file.name}`;
      } else if (imageExtensions.includes(extension)) {
        filePath = `jimg/${file.name}`;
      }

      // ارسال درخواست حذف فایل ناقص
      try {
        const res = await fetch(`/api/ftp-files?filePath=${encodeURIComponent(filePath)}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          console.log(`فایل ناقص ${filePath} با موفقیت حذف شد.`);
        } else {
          console.error(`خطا در حذف فایل ناقص: ${data.message}`);
        }
      } catch (error) {
        console.error("خطا در حذف فایل ناقص:", error);
      }

      // به‌روزرسانی لیست فایل‌ها
      try {
        const resFiles = await fetch("/api/ftp-files");
        const filesData = await resFiles.json();
        if (filesData.success) {
          setFiles(filesData.files);
        }
      } catch (error) {
        console.error("خطا در به‌روزرسانی لیست فایل‌ها:", error);
      }
    }
  };

  const handleDelete = async (file: FileInfo) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید "${file.name}" را حذف کنید؟`)) return;

    try {
      const filePath = file.link.replace("https://dl.shivid.co/", "");
      const res = await fetch(`/api/ftp-files?filePath=${encodeURIComponent(filePath)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setFiles(files.filter((f) => f.link !== file.link));
        setResponse({ success: true, message: data.message });
      } else {
        setResponse({ success: false, message: data.message });
      }
    } catch (error) {
      setResponse({
        success: false,
        message: `خطا در حذف فایل: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  };

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyMessage("لینک کپی شد!");
      setTimeout(() => setCopyMessage(null), 2000);
    } catch (error) {
      setCopyMessage("خطا در کپی لینک!");
      setTimeout(() => setCopyMessage(null), 2000);
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  useEffect(() => {
    if (!file) {
      setProgress(0);
    }
  }, [file]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#121824] to-[#1e2636] text-white flex items-start justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#3b82f6] mb-8 flex items-center gap-3">
          <span>📁</span>
          آپلود و مدیریت فایل‌ها
        </h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#2a3347]/50 backdrop-blur-md rounded-xl p-6 mb-8"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">انتخاب فایل</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isLoading}
              className="w-full p-4 bg-[#1e2636] border border-[#3b82f6]/20 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition duration-300"
            />
          </div>
          <div className="flex space-x-4">
            <motion.button
              type="submit"
              disabled={!file || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex-1 py-3 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 ${
                isLoading || !file
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:from-[#2563eb] hover:to-[#4b91f7]"
              } transition duration-300 shadow-md hover:shadow-lg`}
            >
              <UploadIcon fontSize="small" />
              <span>{isLoading ? "در حال آپلود..." : "آپلود فایل"}</span>
            </motion.button>
            {isLoading && (
              <motion.button
                type="button"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="py-3 px-6 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
              >
                <CancelIcon fontSize="small" />
                <span>لغو</span>
              </motion.button>
            )}
          </div>

          {(isLoading || progress > 0) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="w-full bg-[#2a3347] rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] h-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center mt-3 text-sm font-medium text-gray-300">
                {progress}% کامل شده
              </p>
            </motion.div>
          )}
        </motion.form>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-6 rounded-lg mb-8 ${
                response.success
                  ? "bg-green-600/20 text-green-300"
                  : "bg-red-600/20 text-red-300"
              } backdrop-blur-md shadow-md`}
            >
              <p className="font-medium">{response.message}</p>
              {response.success && response.fileLink && (
                <p className="mt-2">
                  لینک فایل:{" "}
                  <a
                    href={response.fileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#3b82f6] hover:text-[#60a5fa]"
                  >
                    {response.fileLink}
                  </a>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {copyMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-[#3b82f6] text-white p-4 rounded-lg shadow-lg backdrop-blur-md"
            >
              {copyMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {files.reverse().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-[#3b82f6]">فایل‌های آپلود شده</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {files.slice(0, visibleCount).map((file) => (
                <motion.div
                  key={file.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative group bg-[#2a3347]/50 backdrop-blur-md rounded-xl overflow-hidden hover:bg-[#2a3347] transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  {file.type === "image" ? (
                    <img
                      src={file.link}
                      alt={file.name}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                    />
                  ) : (
                    <video
                      src={file.link}
                      className="w-full h-48 object-cover cursor-pointer"
                      onClick={() => setPreviewFile(file)}
                      muted
                      playsInline
                    />
                  )}
                  <div className="p-4">
                    <p className="text-sm text-gray-300 truncate">{file.name}</p>
                  </div>
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <motion.button
                      onClick={() => handleCopyLink(file.link)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-[#3b82f6] text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      title="کپی لینک"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(file)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      title="حذف فایل"
                    >
                      <DeleteIcon fontSize="small" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {files.length > visibleCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  onClick={handleShowMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white rounded-full font-semibold hover:from-[#2563eb] hover:to-[#4b91f7] transition duration-300 shadow-md hover:shadow-lg"
                >
                  نمایش بیشتر
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {previewFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-5xl w-full bg-[#1e2636]/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl"
              >
                <motion.button
                  onClick={() => setPreviewFile(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition duration-300"
                >
                  <CloseIcon fontSize="medium" />
                </motion.button>
                {previewFile.type === "image" ? (
                  <img
                    src={previewFile.link}
                    alt={previewFile.name}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={previewFile.link}
                    controls
                    autoPlay
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                )}
                <p className="text-center mt-4 text-gray-300 font-medium">{previewFile.name}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </main>
  );
}