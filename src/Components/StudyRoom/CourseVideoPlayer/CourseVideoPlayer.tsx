'use client';

import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  url: string;
  duration?: string;
  description?: string;
  isCompleted?: boolean;
}

const videos: Video[] = [
  { 
    id: '1', 
    title: 'مقدمه دوره', 
    url: 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 
    description: 'آشنایی با مفاهیم اولیه دوره',
    isCompleted: false 
  },
  { 
    id: '2', 
    title: 'جلسه اول: مفاهیم پایه', 
    url: 'https://media.istockphoto.com/id/1413207061/fr/vid%C3%A9o/circulation-routi%C3%A8re-dans-delhi-roads.mp4?s=mp4-640x640-is&k=20&c=k8fkmGZJ8GQVJdP6BL0VdYCMtI78VolF5oqyCcYeAjw=', 
    description: 'بررسی اصول و مبانی اولیه',
    isCompleted: false 
  },
  { 
    id: '3', 
    title: 'جلسه دوم: پیشرفته', 
    url: 'https://persian19.cdn.asset.aparat.com/aparat-video/6402b1f7f90f14357f0e6e3798eb163463716329-360p.mp4?wmsAuthSign=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImFkODNmMWIyMDdhMDcyM2JmYTFmN2IxYjU2YzM2OTc0IiwiZXhwIjoxNzQyMzMyMjQyLCJpc3MiOiJTYWJhIElkZWEgR1NJRyJ9.cJ5vTZQPLGhpO8nDag3497rcyRDWgktFYH3VHuKp8yk', 
    description: 'مباحث پیشرفته و کاربردی',
    isCompleted: false 
  },
];

const CourseVideoPlayer: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video>(videos[0]);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<number>(0);
  const [isVideoListOpen, setIsVideoListOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [durations, setDurations] = useState<{ [key: string]: string }>({}); // زمان همه ویدیوها
  const playerRef = useRef<ReactPlayer>(null);

  // فرمت کردن زمان از ثانیه به MM:SS
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // دریافت زمان هر ویدیو
  const handleDuration = (videoId: string, duration: number) => {
    setDurations((prev) => ({
      ...prev,
      [videoId]: formatDuration(duration),
    }));
  };

  // اتمام ویدیو
  const handleVideoEnd = () => {
    setCompletedVideos((prev) => new Set(prev).add(selectedVideo.id));
    setIsPlaying(false);
  };

  // به‌روزرسانی پیشرفت
  const handleProgress = (state: { played: number }) => {
    setProgress(state.played * 100);
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const handleVideoSelect = (video: Video) => {
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
      {/* پخش‌کننده‌های مخفی برای دریافت زمان همه ویدیوها */}
      <div style={{ display: 'none' }}>
        {videos.map((video) => (
          <ReactPlayer
            key={video.id}
            url={video.url}
            width="0"
            height="0"
            onDuration={(duration) => handleDuration(video.id, duration)}
          />
        ))}
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        {/* لیست ویدیوها */}
        <div className="w-full lg:w-1/3 bg-[#1e2636]/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col max-h-[600px]">
          <div
            className="p-5 border-b border-[#0dcf6c]/20 sticky top-0 bg-[#1e2636]/80 z-10 cursor-pointer lg:cursor-default"
            onClick={() => window.innerWidth < 1024 && setIsVideoListOpen(!isVideoListOpen)}
          >
            <h2 className="!text-xl font-bold flex items-center justify-between text-[#0dcf6c]">
              <span className="flex items-center gap-2">
                {isVideoListOpen ? <ChevronRight className="w-6 h-6 lg:hidden rotate-90" /> : <ChevronRight className="w-6 h-6 lg:hidden -rotate-90" />}
                فهرست ویدیوها
              </span>
            </h2>
          </div>
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0dcf6c] scrollbar-track-[#1e2636] p-5 transition-all duration-500 ease-in-out lg:max-h-[500px] lg:opacity-100 ${
              isVideoListOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => handleVideoSelect(video)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group ${
                    selectedVideo.id === video.id
                      ? 'bg-gradient-to-r from-[#0dcf6c] to-[#1e2636] shadow-md'
                      : 'bg-[#2a3347]/50 hover:bg-[#2a3347]'
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
                    <p className="font-semibold text-base group-hover:text-[#0dcf6c]">{video.title}</p>
                    <p className="text-xs text-gray-400">{video.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{durations[video.id] || '0:00'}</span>
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
              onProgress={handleProgress}
              onPlay={handlePlay}
              onPause={handlePause}
              onDuration={(duration) => handleDuration(selectedVideo.id, duration)}
              config={{
                youtube: {
                  playerVars: { showinfo: 1, rel: 0 },
                },
              }}
            />
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
            <p className="text-sm text-gray-300 mt-1">{selectedVideo.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{durations[selectedVideo.id] || '0:00'}</span>
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
                disabled={videos.findIndex((v) => v.id === selectedVideo.id) === 0}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0dcf6c] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span>جلسه قبلی</span>
              </button>
              <button
                onClick={handleNext}
                disabled={videos.findIndex((v) => v.id === selectedVideo.id) === videos.length - 1}
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