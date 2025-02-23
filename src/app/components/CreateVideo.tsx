"use client";
import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import Loading from '../home/loading';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface Message {
  text: string;
  isUser: boolean;
}

interface CreateVideoProps {
  story: string;
}

const CreateVideo = ({ story }: CreateVideoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    containerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 500);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const generateInitialContent = async () => {
      if (!story) return;

      let pollInterval: NodeJS.Timeout;
      let timeoutId: NodeJS.Timeout;

      try {
        setIsLoading(true);
        const uniqueId = await api.generateVideoContent(story);

        pollInterval = setInterval(async () => {
          try {
            const { videoUrl, audioBase64 } = await api.getVideoContent(uniqueId);
            
            if (videoUrl && audioBase64) {
              clearInterval(pollInterval);
              clearTimeout(timeoutId);
              
              setVideoUrl(videoUrl);

              const audioBlob = await fetch(`data:audio/mp3;base64,${audioBase64}`).then(r => r.blob());
              const audioUrl = URL.createObjectURL(audioBlob);
              setAudioUrl(audioUrl);
            }
          } catch (error) {
            console.error('Error polling content:', error);
          }
        }, 2000);

        // Cleanup polling after 5 minutes
        timeoutId = setTimeout(() => {
          clearInterval(pollInterval);
          setError('Video generation timed out. Please try again.');
        }, 300000);

      } catch (error) {
        console.error('Error generating content:', error);
        setError('Failed to generate video. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    generateInitialContent();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [story]);

  // Sync video with audio
  useEffect(() => {
    if (!videoRef.current || !audioRef.current) return;

    const video = videoRef.current;
    const audio = audioRef.current;

    const handleError = (e: Event) => {
      console.error('Playback error:', e);
      setError('Error playing media. Please try again.');
    };

    const handleAudioEnd = () => {
      video.pause();
    };

    const handleVideoEnd = () => {
      if (!audio.ended) {
        video.play().catch(console.error);
      }
    };

    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('error', handleError);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleError);

    // Start playback
    Promise.all([
      video.play().catch(e => {
        console.error('Video playback error:', e);
        setError('Error playing video. Please try again.');
      }),
      audio.play().catch(e => {
        console.error('Audio playback error:', e);
        setError('Error playing audio. Please try again.');
      })
    ]);

    return () => {
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('error', handleError);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleError);
    };
  }, [videoUrl, audioUrl]);

  const addMessageWithDelay = (message: Message, delay: number = 1000) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages(prev => [...prev, message]);
        resolve();
      }, delay);
    });
  };

  const handleSubmit = async () => {
    if (!message.trim() || isSending) return;

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message immediately
    setMessages(prev => [...prev, { 
      text: userMessage,
      isUser: true 
    }]);

    // Show typing indicator
    await addMessageWithDelay({ 
      text: "...",
      isUser: false 
    }, 500);

    try {
      setIsSending(true);

      // Get unique ID from API
      const uniqueId = await api.generateVideoContent(userMessage);
      
      // Poll for video and audio content
      let retries = 0;
      const maxRetries = 30; // 1 minute max waiting time
      
      const getContent = async () => {
        try {
          const { videoUrl, audioBase64 } = await api.getVideoContent(uniqueId);
          
          if (videoUrl && audioBase64) {
            // Clean up old URLs
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            if (audioUrl) URL.revokeObjectURL(audioUrl);

            // Set new video URL
            setVideoUrl(videoUrl);

            // Convert and set new audio URL
            const audioBlob = await fetch(`data:audio/mp3;base64,${audioBase64}`).then(r => r.blob());
            const newAudioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(newAudioUrl);

            // Remove typing indicator and add success message
            setMessages(prev => {
              const newMessages = [...prev];
              newMessages.pop(); // Remove typing indicator
              return [...newMessages, { 
                text: "Your video is ready!",
                isUser: false 
              }];
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error fetching content:', error);
          return false;
        }
      };

      const pollContent = async () => {
        while (retries < maxRetries) {
          const success = await getContent();
          if (success) break;
          await new Promise(resolve => setTimeout(resolve, 2000));
          retries++;
        }

        if (retries >= maxRetries) {
          throw new Error('Timeout waiting for video generation');
        }
      };

      await pollContent();

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator and add error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        return [...newMessages, { 
          text: "Sorry, I couldn't process that request. Please try again.",
          isUser: false 
        }];
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full h-[80vh] max-w-[740px] mx-auto flex flex-col px-4">
      {/* Main Content Area - Now scrollable as one unit */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col overflow-y-auto scrollbar-hide relative mt-12 md:mt-20"
      >
        {/* Story Display */}
        <div className="w-full flex justify-end items-center text-center mb-8">
          <span className="bg-[#FDEDE0] px-8 py-4 rounded-[52px] text-primary-foreground inline-block">
            {story}
          </span>
        </div>

        {/* Video Container - Aligned left */}
        <div className="w-[80%] bg-input rounded-[32px] mb-8">
          <div className="aspect-[16/9] relative rounded-[32px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loading />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center px-4">
                {error}
              </div>
            ) : videoUrl && audioUrl && (
              <div className="absolute inset-0 flex flex-col">
                <video 
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full rounded-[32px]"
                  muted // Mute video, we'll play audio separately
                  playsInline
                />
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages - Flexible width */}
        <div className="w-full space-y-6 pb-32">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={cn(
                "min-w-fit max-w-[80%] px-6 py-4 rounded-[32px] flex items-center gap-2",
                msg.isUser 
                  ? 'bg-[#FDEDE0] text-primary-foreground' 
                  : 'bg-input text-primary-foreground'
              )}>
                {!msg.isUser && msg.text === "..." && (
                  <span className="text-[24px] animate-pulse">...</span>
                )}
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Top Button */}


      {/* Fixed Input Box at Bottom */}
      <div className="fixed bottom-0 mb-6 md:mb-8 w-[calc(100%-2rem)] md:w-[740px] rounded-[32px] md:rounded-[48px] outline outline-2 outline-border outline-offset-4">
        <div className="relative w-full flex items-center">
          <div className="w-full rounded-[32px] md:rounded-[48px] bg-input">
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="absolute left-2 bottom-2 md:left-5 md:bottom-5 p-3 text-primary-orange bg-background border-2 border-border rounded-full shadow-lg transition-all duration-300"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your story line here..."
              disabled={isSending}
              className={cn(
                "w-full rounded-[32px] md:rounded-[48px] scrollbar-hide h-full bg-input resize-none",
                "flex items-center justify-center focus:outline-none",
                "font-['Quicksand'] font-bold text-sm md:text-xl",
                "text-primary-foreground placeholder:text-[#9F9082] text-center py-3 px-4 md:p-4",
                isSending && "opacity-50"
              )}
            />
          </div>
            
          <button 
            onClick={handleSubmit}
            disabled={isSending || !message.trim()}
            className={cn(
              "absolute right-2 md:right-4 font-quicksand px-4 md:px-6 py-2 md:py-6",
              "bg-primary-orange text-white rounded-full font-medium text-sm md:text-base",
              "transition-all duration-300 ease-out flex items-center justify-center",
              (message.trim() && !isSending) ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            )}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateVideo; 