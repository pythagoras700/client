"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, LucideEar, Video } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const params = useSearchParams(); 
    console.log(params);
    const type = params.get('type');
    return (
      <header className="absolute top-0 left-0 right-0 z-50 p-6 md:p-12 bg-transparent">
        <div className="w-full mx-auto flex justify-between items-center">
          <button onClick={() => router.push(`/home`)} className="text-2xl font-merriweather text-muted-foreground/60">
            Tuna
          </button>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => router.push(`/home?type=${type}`)}
              className="w-12 h-12 rounded-[16px] bg-primary-orange text-white flex items-center justify-center shadow-sm"
              aria-label="Add new"
            >
              <Plus />
            </button>
  
            {/* Divider */}
            <div className="w-[2px] h-12 bg-border" />
  
            <button 
              onClick={() =>  type === 'create' ? router.push(`/home?type=listen`) : router.push(`/home?type=create`)}
              className="w-12 h-12 rounded-[16px] bg-[#FEDBC9] text-primary-foreground flex items-center justify-center shadow-sm"
              aria-label="Help"
            >
             {type !== 'listen' ? <LucideEar color="#ff6b3d" /> : <Video color="#ff6b3d" />}
            </button>
          </div>
        </div>
      </header>
    );
  };
  