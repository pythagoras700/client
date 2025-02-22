"use client";
import { useState, useEffect, useRef } from 'react';
import { Play, Maximize2, Download, ArrowUp } from 'lucide-react';
import Loading from '../home/loading';
import { cn } from '@/lib/utils';

interface Message {
  text: string;
  isUser: boolean;
}

interface CreateVideoProps {
  story: string;
  onVideoGenerated?: (url: string) => void;
}

const CreateVideo = ({ story, onVideoGenerated }: CreateVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [message, setMessage] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full h-[80vh] max-w-[740px] mx-auto flex flex-col px-4 mt-12">
      {/* Main Content Area - Now scrollable as one unit */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col items-center overflow-y-auto scrollbar-hide relative"
      >
        {/* Story Display */}
        <div className="w-full flex justify-end items-center text-center mb-8">
          <span className="bg-[#FDEDE0] px-8 py-4 rounded-[52px] text-primary-foreground inline-block">
            {story}
          </span>
        </div>

        {/* Video Container */}
        <div className="w-[70%] bg-input rounded-[32px]  mb-8">
          <div className="aspect-[16/9] relative rounded-[32px]">
            <div className="absolute inset-0 flex flex-col">
              {/* Video Controls */}
              <div className="flex-1" />
              <div className="w-full px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 hover:bg-black/5">
                    <Play className="w-4 h-4 text-primary-foreground" />
                  </button>
                  <span className="text-sm text-primary-foreground">0:00</span>
                  <div className="flex-1 h-1 bg-white/20 rounded-full mx-2">
                    <div className="w-0 h-full bg-primary-orange rounded-full" />
                  </div>
                  <span className="text-sm text-primary-foreground">2:33</span>
                  <button className="rounded-lg p-2 hover:bg-black/5">
                    <Maximize2 className="w-4 h-4 text-primary-foreground" />
                  </button>
                  <button className="rounded-lg p-2 hover:bg-black/5">
                    <Download className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Loading />
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="w-full space-y-4 pb-32">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] px-6 py-4 rounded-[32px] flex items-center gap-2
                ${message.isUser 
                  ? 'bg-[#FDEDE0] text-primary-foreground' 
                  : 'bg-input text-primary-foreground'
                }
              `}>
                {!message.isUser && <span className="text-[24px]">...</span>}
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Top Button */}


      {/* Fixed Input Box at Bottom */}
      <div className="fixed bottom-0 mb-6 md:w-[740px] md:mb-8 rounded-[32px] md:rounded-[48px] outline outline-2 outline-border outline-offset-4 flex items-center justify-center">
          <div className="rounded-[24px] w-full md:rounded-[48px] bg-input flex items-center justify-center">
            {showScrollTop && (
                <button
                  onClick={scrollToTop}
                  className="absolute left-4 p-3 text-primary-orange bg-background border-2 border-border rounded-full shadow-lg transition-all duration-300"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your story line here..."
                className="w-full rounded-[24px] md:rounded-[48px] scrollbar-hide h-full bg-input resize-none flex items-center justify-center focus:outline-none font-['Quicksand'] font-bold text-base md:text-xl text-primary-foreground placeholder:text-[#9F9082] text-center m-4"
              />
            </div>
            
                <button 
                  onClick={handleSubmit}
                  className={cn(
                    `font-quicksand px-6  py-6 bg-primary-orange text-white rounded-full font-medium transition-all duration-300 ease-out flex items-center justify-center ${message.trim() ? 'block' : 'hidden'}`,
                  )}
                >
                  Create
                </button>
                {/* {message.trim() ? (
                <button 
                  onClick={handleSubmit}
                  className={cn(
                    `font-quicksand mx-2 px-6  py-6 bg-primary-orange text-white rounded-full font-medium transition-all duration-300 ease-out flex items-center justify-center ${message.trim() ? 'block' : 'hidden'}`,
                  )}
                >
                  Create
                </button>
            ) : showScrollTop && (
              <button
                onClick={scrollToTop}
                className="h-full mx-2 p-3 text-primary-orange bg-background border-2 border-border rounded-full shadow-lg transition-all duration-300"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            )} */}
        </div>
      </div>
  );
};

export default CreateVideo; 