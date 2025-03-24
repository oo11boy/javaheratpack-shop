"use client";
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CourseVideo } from '@/lib/Types/Types';
import VideoItem from './VideoItem';

interface VideoListProps {
  videos: CourseVideo[];
  selectedVideo: CourseVideo;
  completedVideos: Set<string>;
  isVideoListOpen: boolean;
  isPlaying: boolean;
  onVideoSelect: (video: CourseVideo) => void;
  toggleVideoList: () => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  selectedVideo,
  completedVideos,
  isVideoListOpen,
  isPlaying,
  onVideoSelect,
  toggleVideoList,
}) => {
  return (
    <div className="w-full lg:w-1/3 bg-[#1e2636]/80 backdrop-blur-lg rounded-xl shadow-lg flex flex-col max-h-[600px]">
      <div
        className="p-5 border-b border-[color:var(--primary-color)]/20 sticky top-0 bg-[#1e2636]/80 z-10 cursor-pointer lg:cursor-default"
        onClick={() => window.innerWidth < 1024 && toggleVideoList()}
      >
        <h2 className="!text-xl font-bold flex items-center justify-between text-[color:var(--primary-color)]">
          <span className="flex items-center gap-2">
            {isVideoListOpen ? (
             
              <ChevronRight className="w-6 h-6 lg:hidden -rotate-90" />
            ) : (
              <ChevronRight className="w-6 h-6 lg:hidden rotate-90" />
              
            )}
            فهرست ویدیوها
          </span>
        </h2>
      </div>
      <div
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[color:var(--primary-color)] scrollbar-track-[#1e2636] p-5 transition-all duration-500 ease-in-out lg:max-h-[500px] lg:opacity-100 ${
          isVideoListOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="space-y-3">
          {videos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
              isSelected={selectedVideo.id === video.id}
              isCompleted={completedVideos.has(video.id)}
              isPlaying={isPlaying}
              onSelect={onVideoSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoList;