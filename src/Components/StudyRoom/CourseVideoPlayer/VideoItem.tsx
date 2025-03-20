"use client";
import React from 'react';
import { Play, Pause, CheckCircle, Clock } from 'lucide-react';
import { CourseVideo } from '@/lib/Types/Types';

interface VideoItemProps {
  video: CourseVideo;
  isSelected: boolean;
  isCompleted: boolean;
  isPlaying: boolean;
  onSelect: (video: CourseVideo) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isSelected,
  isCompleted,
  isPlaying,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(video)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group ${
        isSelected
          ? 'bg-gradient-to-r from-[#0dcf6c] to-[#1e2636] shadow-md'
          : 'bg-[#2a3347]/50 hover:bg-[#2a3347]'
      }`}
    >
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-[#0dcf6c] group-hover:text-[#0dcf6c]/80" />
        ) : isSelected && isPlaying ? (
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
        <span>{video.duration || '0:00'}</span>
      </div>
    </div>
  );
};

export default VideoItem;