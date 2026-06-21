"use client";

import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UploadIcon from "@mui/icons-material/Upload";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadResponse {
  success: boolean;
  message: string;
  fileLink?: string;
}

interface FileInfo {
  name: string;
  type: "video" | "image" | "other";
  link: string;
  date: string;
  size?: number;
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
  const [visibleCount, setVisibleCount] = useState(12);
  const [isDragging, setIsDragging] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile && droppedFile.size > 5 * 1024 * 1024 * 1024) {
      setResponse({ success: false, message: "فایل بزرگ‌تر از ۵ گیگابایت است." });
      setFile(null);
      return;
    }
    setFile(droppedFile);
    setResponse(null);
    setProgress(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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

      const videoExtensions = [".mp4", ".mkv", ".avi", ".mov", ".webm"];
      const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      let filePath = file.name;
      if (videoExtensions.includes(extension)) {
        filePath = `cvideo/${file.name}`;
      } else if (imageExtensions.includes(extension)) {
        filePath = `jimg/${file.name}`;
      }

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

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "نامشخص";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = (type: string) => {
    if (type === "image") return <ImageIcon className="text-blue-400" />;
    if (type === "video") return <VideoLibraryIcon className="text-purple-400" />;
    return <FilePresentIcon className="text-gray-400" />;
  };

  const getFileTypeClass = (type: string) => {
    if (type === "image") return "border-blue-500/30 hover:border-blue-500";
    if (type === "video") return "border-purple-500/30 hover:border-purple-500";
    return "border-gray-500/30 hover:border-gray-500";
  };

  const filteredFiles = files
    .filter((f) => filterType === "all" || f.type === filterType)
    .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (!file) {
      setProgress(0);
    }
  }, [file]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#121824] to-[#1a2233] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <CloudUploadIcon className="text-blue-400" fontSize="large" />
            مدیریت فایل‌ها
          </h1>
          <div className="text-sm text-gray-400 bg-[#1e2636]/50 px-4 py-2 rounded-full backdrop-blur-sm">
            {files.length} فایل در سرور
          </div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#1e2636]/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 mb-8 border border-white/5"
        >
          <form onSubmit={handleSubmit}>
            <div
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300
                ${isDragging 
                  ? "border-blue-400 bg-blue-400/10" 
                  : file 
                    ? "border-green-400 bg-green-400/10" 
                    : "border-white/20 hover:border-white/40 bg-white/5"}
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center">
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircleIcon className="text-green-400" style={{ fontSize: 48 }} />
                    <p className="text-lg font-medium text-green-400">{file.name}</p>
                    <p className="text-sm text-gray-400">{formatFileSize(file.size)}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      حذف فایل انتخاب شده
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <CloudUploadIcon className="text-gray-400" style={{ fontSize: 64 }} />
                    <p className="text-lg font-medium text-gray-300">
                      فایل خود را اینجا بکشید یا کلیک کنید
                    </p>
                    <p className="text-sm text-gray-500">
                      حداکثر حجم: ۵ گیگابایت
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl backdrop-blur-sm flex items-center justify-center pointer-events-none">
                <p className="text-2xl font-bold text-blue-400">رها کنید</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <motion.button
                type="submit"
                disabled={!file || isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 min-w-[200px] py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isLoading || !file
                    ? "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                <UploadIcon />
                <span>{isLoading ? "در حال آپلود..." : "آپلود فایل"}</span>
              </motion.button>

              {isLoading && (
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-3 px-6 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <CancelIcon />
                  <span>لغو</span>
                </motion.button>
              )}
            </div>

            {(isLoading || progress > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>پیشرفت آپلود</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-[#2a3347] rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>

        {/* Response Message */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                response.success
                  ? "bg-green-500/10 border border-green-500/20 text-green-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {response.success ? <CheckCircleIcon /> : <ErrorIcon />}
              <p className="font-medium">{response.message}</p>
              {response.success && response.fileLink && (
                <a
                  href={response.fileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline ml-auto"
                >
                  مشاهده فایل
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Files Section */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-200">
                فایل‌های آپلود شده
                <span className="text-sm text-gray-500 mr-2">({filteredFiles.length})</span>
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="جستجوی فایل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 md:w-48 px-4 py-2 bg-[#1e2636] border border-white/10 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                
                <div className="flex gap-1 bg-[#1e2636] rounded-lg p-1 border border-white/10">
                  {["all", "image", "video"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type as any)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        filterType === type
                          ? "bg-blue-500 text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {type === "all" ? "همه" : type === "image" ? "تصاویر" : "ویدیوها"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.slice(0, visibleCount).map((file) => (
                <motion.div
                  key={file.link}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className={`group relative bg-[#1e2636]/50 backdrop-blur-sm rounded-xl overflow-hidden border ${getFileTypeClass(
                    file.type
                  )} transition-all duration-300`}
                >
                  {file.type === "image" ? (
                    <div className="relative aspect-square overflow-hidden bg-[#0a0e1a]">
                      <img
                        src={file.link}
                        alt={file.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                        loading="lazy"
                      />
                    </div>
                  ) : file.type === "video" ? (
                    <div className="relative aspect-square overflow-hidden bg-[#0a0e1a]">
                      <video
                        src={file.link}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent mr-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-[#0a0e1a] flex items-center justify-center">
                      <FilePresentIcon className="text-gray-500" style={{ fontSize: 48 }} />
                    </div>
                  )}

                  <div className="p-3">
                    <p className="text-xs text-gray-300 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {file.date ? new Date(file.date).toLocaleDateString("fa-IR") : ""}
                    </p>
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <motion.button
                      onClick={() => handleCopyLink(file.link)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                      title="کپی لینک"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </motion.button>
                    <motion.button
                      onClick={() => setPreviewFile(file)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
                      title="پیش‌نمایش"
                    >
                      {file.type === "image" ? (
                        <ImageIcon fontSize="small" />
                      ) : (
                        <VideoLibraryIcon fontSize="small" />
                      )}
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(file)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                      title="حذف فایل"
                    >
                      <DeleteIcon fontSize="small" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredFiles.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <FilePresentIcon style={{ fontSize: 48 }} className="mx-auto mb-3 opacity-50" />
                <p>هیچ فایلی با این فیلتر پیدا نشد</p>
              </div>
            )}

            {filteredFiles.length > visibleCount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  onClick={handleShowMore}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-gray-300 rounded-xl font-semibold hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all"
                >
                  نمایش بیشتر ({filteredFiles.length - visibleCount} فایل دیگر)
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Preview Modal */}
        <AnimatePresence>
          {previewFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={() => setPreviewFile(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full bg-[#1a2233] rounded-2xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <motion.button
                    onClick={() => handleCopyLink(previewFile.link)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                    title="کپی لینک"
                  >
                    <ContentCopyIcon fontSize="small" />
                  </motion.button>
                  <motion.button
                    onClick={() => setPreviewFile(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <CloseIcon fontSize="small" />
                  </motion.button>
                </div>

                <div className="p-4 md:p-6">
                  {previewFile.type === "image" ? (
                    <img
                      src={previewFile.link}
                      alt={previewFile.name}
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  ) : previewFile.type === "video" ? (
                    <video
                      src={previewFile.link}
                      controls
                      autoPlay
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <FilePresentIcon style={{ fontSize: 80 }} />
                      <p className="mt-4 text-lg">پیش‌نمایش برای این نوع فایل در دسترس نیست</p>
                      <a
                        href={previewFile.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-blue-400 hover:text-blue-300 underline"
                      >
                        دانلود فایل
                      </a>
                    </div>
                  )}
                </div>

                <div className="px-4 md:px-6 pb-4 text-center">
                  <p className="text-gray-300 font-medium truncate">{previewFile.name}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Copy Message Toast */}
        <AnimatePresence>
          {copyMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2"
            >
              <CheckCircleIcon fontSize="small" />
              {copyMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}