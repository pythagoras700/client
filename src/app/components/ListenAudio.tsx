"use client";
import { useState, useEffect, useRef } from 'react';
import { Play, Download } from 'lucide-react';

interface Character {
  name: string;
  color: string;
  position?: { x: number; y: number };
  blobPath: string;
}

interface ListenAudioProps {
  story?: string;
  onAudioGenerated?: (url: string) => void;
}

const ListenAudio = ({ onAudioGenerated }: ListenAudioProps) => {
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

  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
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
  const [isConversationJoined, setIsConversationJoined] = useState(false);

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

  const handleJoinConversation = () => {
    setIsConversationJoined(!isConversationJoined);
  };

  return (
    <div className="w-full h-[90vh] max-w-[740px] mx-auto px-4 mt-12 flex flex-col items-between">

      {/* Characters Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[575px] md:h-[650px] mb-8"
      >
        {characters.map((char, index) => (
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
        ))}
      </div>

      {/* Audio Player */}
      <div className="w-[70%] mx-auto bg-input rounded-[32px] overflow-hidden mb-8">
        <div className="h-[70px] relative rounded-[32px]">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1" />
            <div className="w-full h-16 flex items-center px-6">
              <div className="flex items-center w-full">
                <button className="group p-2 rounded-lg hover:bg-black/5">
                  <Play className="w-5 h-5 text-[#1C1B1B]" />
                </button>

                <div className="flex items-center flex-1 mx-4">
                  <span className="text-sm font-medium text-[#1C1B1B] w-10">0:00</span>
                  <div className="flex-1 h-1 bg-[#1C1B1B]/10 rounded-full mx-4">
                    <div className="w-0 h-full bg-primary-orange rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-[#1C1B1B] w-10">2:33</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-black/5">
                    <Download className="w-5 h-5 text-[#1C1B1B]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Conversation Button - Centered at bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[740px] px-4 mb-6 md:mb-8">
        <button
          onClick={handleJoinConversation}
          className={`
            w-full outline outline-2 outline-border outline-offset-4 rounded-[32px]
            py-4 font-quicksand font-bold text-white transition-colors
            ${isConversationJoined ? 'bg-[#323232]' : 'bg-primary-orange hover:bg-primary-orange/90'}
          `}
        >
          {isConversationJoined ? 'Stop Talking' : 'Press to join conversation'}
        </button>
      </div>
    </div>
  );
};

export default ListenAudio; 