"use client";
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Maximize2, Download } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ... Similar time handling logic as AudioPlayer ...

  return (
    <div className="aspect-[16/9] relative rounded-[32px]">
      <video 
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full rounded-[32px]"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="rounded-lg p-2 hover:bg-black/5">
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white" />
            )}
          </button>
          {/* ... Rest of controls similar to AudioPlayer ... */}
        </div>
      </div>
    </div>
  );
}; 