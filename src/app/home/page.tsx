"use client";
import { useState, KeyboardEvent } from "react";
import Image from "next/image";
import { StorySuggestions } from "./Suggestions";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "./loading";

const HomePage = () => {
  const [storyText, setStoryText] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const suggestions = [
    {
      icon: "/images/turtle.svg",
      text: "Rabbit and turtle race in the forest"
    },
    {
      icon: "/images/dino.svg",
      text: "The story of a dinosaur"
    }
  ];

  const handleCreate = async () => {
    if (!storyText.trim()) return;
    
    setIsRedirecting(true);
    // Brief pause before redirect
    setTimeout(() => {
      router.push(`/chat?type=${type}&story=${encodeURIComponent(storyText.trim())}`);
    }, 2000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && storyText.trim()) {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center pt-8 md:pt-0">
      <div className="w-full max-w-[740px] mx-auto px-4 md:px-6 flex flex-col">
        {/* Heading with asset */}
        <div className={`relative w-full text-center mb-6 md:mb-12 transition-all duration-400 ${
          isRedirecting ? 'opacity-0' : ''
        }`}>
          <h1 className="font-merriweather font-bold text-2xl md:text-[48px] text-primary-foreground leading-tight">
            Describe the stor<span className="relative">y
              <Image 
                src="/images/header-asset.svg" 
                alt="header-asset" 
                width={20} 
                height={20} 
                className="absolute -right-5 -top-2 md:-right-6 md:-top-3 md:w-[32px] md:h-[32px]"
              />
            </span><br /> you'd like to {type === 'create' ? 'create' : 'listen to'}
          </h1>
        </div>

        <div className={`w-full flex items-center justify-center transition-all duration-700 ${isRedirecting ? 'opacity-100' : 'opacity-0'}`}>
          <Loading />
        </div>

        {/* Input Container */}
        <div className={`transition-all duration-400 ${isRedirecting ? 'opacity-0' : ''}`}>
          {/* Text Input Area */}
          <div className="w-full mb-6 md:mb-8 max-w-[740px] mx-auto rounded-[24px] md:rounded-[40px] outline outline-2 outline-border outline-offset-4 flex items-center justify-center">
  
                  <textarea
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your story line here..."
                    className="w-full rounded-[24px] md:rounded-[40px] scrollbar-hide p-20 md:p-22 h-full bg-input resize-none focus:outline-none font-['Quicksand'] font-bold text-base md:text-xl text-primary-foreground placeholder:text-[#9F9082] text-center"
                  />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
            {storyText ? (
              <div className="w-full flex flex-col items-center justify-center gap-3 md:flex-row md:gap-4">
                <button 
                  onClick={handleCreate}
                  className="px-2 py-3 md:px-12 md:py-4 rounded-[20px] bg-primary-orange text-white font-['Quicksand'] font-bold text-base md:text-xl hover:bg-primary-orange/90 transition-colors shadow-[0_4px_8px_rgba(255,92,41,0.25)]"
                >
                  {type === 'create' ? 'Create' : 'Listen'}
                </button>
              </div>
            ) : (
              <StorySuggestions
                suggestions={suggestions}
                onSuggestionClick={setStoryText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
