"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Play,
  Pause,
  Clock,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CourseVideo } from "@/lib/Types/Types";

// وارد کردن ReactPlayer به صورت پویا و غیرفعال کردن SSR
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const CourseVideoPlayer = ({ videos }: { videos: CourseVideo[] }) => {
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo>(videos[0]);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [isVideoListOpen, setIsVideoListOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<typeof ReactPlayer>(null);

  // اتمام ویدیو
  const handleVideoEnd = () => {
    setCompletedVideos((prev) => new Set(prev).add(selectedVideo.id));
    setIsPlaying(false);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleVideoSelect = (video: CourseVideo) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setIsVideoListOpen(false);
  };

  const handlePrevious = () => {
    const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id);
    if (currentIndex > 0) {
      setSelectedVideo(videos[currentIndex - 1]);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = videos.findIndex((v) => v.id === selectedVideo.id);
    if (currentIndex < videos.length - 1) {
      setSelectedVideo(videos[currentIndex + 1]);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen ccontainer bg-[#121824] text-white flex flex-col items-center justify-start p-4">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* لیست ویدیوها */}
        <div className="w-full lg:w-1/3 bg-[#1e2636]/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col max-h-[600px]">
          <div
            className="p-5 border-b border-[#0dcf6c]/20 sticky top-0 bg-[#1e2636]/80 z-10 cursor-pointer lg:cursor-default"
            onClick={() =>
              window.innerWidth < 1024 && setIsVideoListOpen(!isVideoListOpen)
            }
          >
            <h2 className="!text-xl font-bold flex items-center justify-between text-[#0dcf6c]">
              <span className="flex items-center gap-2">
                {isVideoListOpen ? (
                  <ChevronRight className="w-6 h-6 lg:hidden rotate-90" />
                ) : (
                  <ChevronRight className="w-6 h-6 lg:hidden -rotate-90" />
                )}
                فهرست ویدیوها
              </span>
            </h2>
          </div>
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0dcf6c] scrollbar-track-[#1e2636] p-5 transition-all duration-500 ease-in-out lg:max-h-[500px] lg:opacity-100 ${
              isVideoListOpen
                ? "max-h-[500px] opacity-100"
                : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group ${
                    selectedVideo.id === video.id
                      ? "bg-gradient-to-r from-[#0dcf6c] to-[#1e2636] shadow-md"
                      : "bg-[#2a3347]/50 hover:bg-[#2a3347]"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {completedVideos.has(video.id) ? (
                      <CheckCircle className="w-5 h-5 text-[#0dcf6c] group-hover:text-[#0dcf6c]/80" />
                    ) : selectedVideo.id === video.id && isPlaying ? (
                      <Pause className="w-5 h-5 text-[#0dcf6c] group-hover:text-[#0dcf6c]/80" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-300 group-hover:text-[#0dcf6c]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base group-hover:text-[#0dcf6c]">
                      {video.title}
                    </p>
                    <p className="text-xs text-gray-400">{video.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{video.duration || "0:00"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* پخش‌کننده ویدیو */}
        <div className="w-full lg:w-2/3 bg-[#1e2636]/80 backdrop-blur-lg rounded-xl shadow-lg p-5 flex flex-col">
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden ring-2 ring-[#0dcf6c]/30">
            <ReactPlayer
              ref={playerRef}
              url={selectedVideo.url}
              width="100%"
              height="100%"
              controls
              playing={isPlaying}
              onEnded={handleVideoEnd}
              onPlay={handlePlay}
              onPause={handlePause}
              config={{
                youtube: {
                  playerVars: { showinfo: 1, rel: 0 },
                },
              }}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">
              {selectedVideo.title}
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              {selectedVideo.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{selectedVideo.duration || "0:00"}</span>
              </div>
              {completedVideos.has(selectedVideo.id) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#0dcf6c]/20 text-[#0dcf6c] rounded-full text-xs font-medium">
                  <CheckCircle className="w-4 h-4" />
                  تکمیل شده
                </span>
              )}
            </div>
            <div className="flex gap-4 mt-4 justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={
                  videos.findIndex((v) => v.id === selectedVideo.id) === 0
                }
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>جلسه قبلی</span>
              </button>
              <button
                onClick={handleNext}
                disabled={
                  videos.findIndex((v) => v.id === selectedVideo.id) ===
                  videos.length - 1
                }
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <span>جلسه بعدی</span>
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;