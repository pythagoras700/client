"use client";
import { useSearchParams } from 'next/navigation';
import CreateVideo from '../components/CreateVideo';
import ListenAudio from '../components/ListenAudio';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as 'listen' | 'create';
  const story = searchParams.get('story') || '';

  const handleMediaGenerated = (url: string) => {
    // Handle the generated media URL (e.g., save to state, send to backend, etc.)
    console.log('Media generated:', url);
  };

  return (
    <div className="mt-20">
      {type === 'create' ? (
        <CreateVideo 
          story={story}
          onVideoGenerated={handleMediaGenerated}
        />
      ) : (
        <ListenAudio 
          story={story}
          onAudioGenerated={handleMediaGenerated}
        />
      )}
    </div>
  );
}
