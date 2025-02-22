"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (type: 'listen' | 'create') => {
    router.push(`/home?type=${type}`);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* Main Content */}
      <div className="w-full max-w-[740px] mx-auto px-6 flex flex-col items-center">
        {/* Heading */}
        <h1 
          className="font-bold text-[32px] md:text-[48px] text-primary-foreground text-center mb-16"
        >
          What you<br /> want to do?
        </h1>

        {/* Cards Container */}
        <div className="flex flex-col md:grid md:grid-cols-2 items-center gap-6 md:gap-8">
          {/* Listen Card */}
          <button 
            onClick={() => handleNavigation('listen')}
            className="w-[200px] h-[200px] md:w-[348px] md:h-[348px] border border-border bg-background rounded-[32px] md:rounded-[64px] p-6 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6"
          >
            <Image
              src="/images/mic.svg"
              alt="Listen"
              width={56}
              height={56}
              className="w-[56px] h-[56px] md:w-20 md:h-20"
            />
            <span className="text-[20px] md:text-2xl text-primary-foreground">Listen</span>
          </button>

          {/* Create Card */}
          <button 
            onClick={() => handleNavigation('create')}
            className="w-[200px] h-[200px] md:w-[348px] md:h-[348px] border border-border bg-background rounded-[32px] md:rounded-[64px] p-6 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6"
          >
            <Image
              src="/images/video.svg"
              alt="Create"
              width={56}
              height={56}
              className="w-[56px] h-[56px] md:w-20 md:h-20"
            />
            <span className="text-[20px] md:text-2xl text-primary-foreground">Create</span>
          </button>
        </div>
      </div>
    </div>
  );
}
