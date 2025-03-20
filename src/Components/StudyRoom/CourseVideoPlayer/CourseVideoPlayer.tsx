"use client";
import React, { useState, useRef } from 'react';
import { CourseVideo } from '@/lib/Types/Types';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';
import ReactPlayer from 'react-player'; // فرض بر استفاده از react-player

const CourseVideoPlayer: React.FC<{ videos: CourseVideo[] }> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo>(videos[0]);
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());
  const [isVideoListOpen, setIsVideoListOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<ReactPlayer>(null); // نوع دقیق برای ReactPlayer

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
        <VideoList
          videos={videos}
          selectedVideo={selectedVideo}
          completedVideos={completedVideos}
          isVideoListOpen={isVideoListOpen}
          isPlaying={isPlaying}
          onVideoSelect={handleVideoSelect}
          toggleVideoList={() => setIsVideoListOpen(!isVideoListOpen)}
        />
        <VideoPlayer
          video={selectedVideo}
          videos={videos}
          completedVideos={completedVideos}
          playerRef={playerRef}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleVideoEnd}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default CourseVideoPlayer;