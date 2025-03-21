"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CourseVideo } from '@/lib/Types/Types';
import ReactPlayer from 'react-player'; // برای تایپ‌ها

const ReactPlayerDynamic = dynamic(() => import('react-player'), { ssr: false });

interface VideoPlayerProps {
  video: CourseVideo;
  videos: CourseVideo[];
  completedVideos: Set<string>;
  playerRef: React.MutableRefObject<ReactPlayer | null>; // نوع دقیق
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  videos,
  completedVideos,
  playerRef,
  isPlaying,
  onPlay,
  onPause,
  onEnded,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="w-full lg:w-2/3 bg-[#1e2636]/80 backdrop-blur-lg rounded-xl shadow-lg p-5 flex flex-col">
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden ring-2 ring-[color:var(--primary-color)]/30">
        <ReactPlayerDynamic
          ref={playerRef}
          url={video.url}
          width="100%"
          height="100%"
          controls
          playing={isPlaying}
          onEnded={onEnded}
          onPlay={onPlay}
          onPause={onPause}
          config={{
            youtube: {
              playerVars: { showinfo: 1, rel: 0 },
            },
          }}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-bold text-white">{video.title}</h3>
        <p className="text-sm text-gray-300 mt-1">{video.description}</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{video.duration || '0:00'}</span>
          </div>
          {completedVideos.has(video.id) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-[color:var(--primary-color)]/20 text-[color:var(--primary-color)] rounded-full text-xs font-medium">
              <CheckCircle className="w-4 h-4" />
              تکمیل شده
            </span>
          )}
        </div>
        <div className="flex gap-4 mt-4 justify-between items-center">
          <button
            onClick={onPrevious}
            disabled={videos.findIndex((v) => v.id === video.id) === 0}
            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>جلسه قبلی</span>
          </button>
          <button
            onClick={onNext}
            disabled={videos.findIndex((v) => v.id === video.id) === videos.length - 1}
            className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[color:var(--primary-color)] to-[#0aaf5a] text-white rounded-full hover:from-[#0aaf5a] hover:to-[#088f4a] transition-all duration-300 disabled:from-gray-500 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <span>جلسه بعدی</span>
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;