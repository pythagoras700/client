"use client";
import { useState, useEffect, useRef } from 'react';
import { MicOff, Mic } from 'lucide-react';
import { api } from '@/lib/api';
import { AudioPlayer } from './AudioPlayer';
import { cn } from '@/lib/utils';
import Loading from '../home/loading';

interface Character {
  name: string;
  color: string;
  position?: { x: number; y: number };
  blobPath: string;
}

interface ListenAudioProps {
  story: string;
}

const ListenAudio = ({ story }: ListenAudioProps) => {
  // Generate random blob path - Moved to top
  const generateBlobPath = () => {
    const size = 120;
    const center = size / 2;
    const points = 6 + Math.floor(Math.random() * 4); // 6-9 points
    const path = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radius = center * (0.8 + Math.random() * 0.4); // Random radius between 80-120%
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      if (i === 0) {
        path.push(`M ${x} ${y}`);
      } else {
        const cp1x = center + radius * 1.2 * Math.cos(angle - Math.PI / 4);
        const cp1y = center + radius * 1.2 * Math.sin(angle - Math.PI / 4);
        path.push(`Q ${cp1x} ${cp1y} ${x} ${y}`);
      }
    }
    
    path.push('Z'); // Close the path
    return path.join(' ');
  };

  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [characters, setCharacters] = useState<Character[]>([
    { name: 'Bheem', color: 'fill-[#FFD6CC]', blobPath: generateBlobPath() },
    { name: 'Chutki', color: 'fill-[#E6D5B8]', blobPath: generateBlobPath() },
    { name: 'Raju', color: 'fill-[#E6D5B8]', blobPath: generateBlobPath() },
    { name: 'Khalia', color: 'fill-[#C4B5A6]', blobPath: generateBlobPath() },
    { name: 'Dolu,Bolu', color: 'fill-[#E6E0DB]', blobPath: generateBlobPath() },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Function to check if two circles overlap
  const doCirclesOverlap = (x1: number, y1: number, x2: number, y2: number, minDistance: number) => {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < minDistance;
  };

  // Function to generate random positions for characters
  const generatePositions = () => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const bubbleSize = 120;
    const minDistance = bubbleSize * 1.2;
    
    const updatedCharacters = [...characters];
    
    updatedCharacters.forEach((char, index) => {
      let validPosition = false;
      let attempts = 0;
      let x = 0, y = 0;

      while (!validPosition && attempts < 100) {
        x = bubbleSize/2 + Math.random() * (containerWidth - bubbleSize);
        y = bubbleSize/2 + Math.random() * (containerHeight - bubbleSize);

        validPosition = true;
        for (let i = 0; i < index; i++) {
          if (updatedCharacters[i].position && 
              doCirclesOverlap(
                x, 
                y, 
                updatedCharacters[i].position!.x,
                updatedCharacters[i].position!.y,
                minDistance
              )) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }

      if (validPosition) {
        char.position = { x, y };
      }
    });

    setCharacters(updatedCharacters);
  };

  useEffect(() => {
    generatePositions();
    window.addEventListener('resize', generatePositions);
    return () => window.removeEventListener('resize', generatePositions);
  }, []);

  const handleJoinConversation = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        setIsLoading(true);
        setError(null);

        // First, make the POST request
        const uniqueId = await api.generateAudioContent(story);
        console.log('Got unique ID:', uniqueId);

        // Then, make the GET request with the unique ID
        const audioData = await api.getAudioContent(uniqueId);
        console.log('Got audio data:', audioData);

        // If you get base64 audio, convert it to URL
        if (audioData.audioBase64) {
          const audioBlob = await fetch(`data:audio/mp3;base64,${audioData.audioBase64}`)
            .then(r => r.blob());
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }

      } catch (error) {
        console.error('Error generating audio:', error);
        setError('Failed to generate audio. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);

  return (
    <div className="w-full h-[90vh] max-w-[740px] mx-auto px-4 mt-12 flex flex-col items-between">

      {/* Characters Container */}
      <div 
        ref={containerRef}
        className="relative w-full text-center mb-8"
      >
        <p>Story: {story}</p>
        {/* {characters.map((char, index) => (
          <div
            key={index}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out`}
            style={{
              left: char.position?.x,
              top: char.position?.y,
            }}
          >
            <div className="relative w-[120px] h-[120px] group">
              <svg 
                viewBox="0 0 120 120" 
                className={`w-full h-full ${char.color} transition-transform group-hover:scale-105`}
              >
                <path d={char.blobPath} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-medium">
                {char.name}
              </div>
            </div>
          </div>
        ))} */}
      </div>

      {/* Audio Player - Centered and with proper styling */}
      {audioUrl ? (
        <div className="w-full max-w-[80%] mx-auto mb-8 bg-input rounded-[32px] p-6">
          <AudioPlayer 
            audioUrl={audioUrl} 
            className="w-full"
          />
        </div>
      ) : (
        <div className="w-full max-w-[80%] mx-auto mb-8 bg-input rounded-[32px] p-6">
          <p>Generating audio...</p>
        </div>
      )}

      {/* Join Conversation Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[740px] px-4 mb-6 md:mb-8">
        {error && (
          <div className="text-center mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleJoinConversation}
          disabled={isLoading}
          className={cn(
            "w-full outline outline-2 outline-border outline-offset-4 rounded-[32px]",
            "py-4 font-quicksand font-bold text-white transition-all duration-300",
            "flex items-center justify-center gap-2",
            isRecording 
              ? "bg-[#323232]" 
              : "bg-primary-orange hover:bg-primary-orange/90",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isRecording ? 'Stop Talking' : 'Press to join conversation'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ListenAudio; 