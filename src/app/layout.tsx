
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Merriweather, Quicksand } from "next/font/google";
import Image from "next/image";
import Header from "./components/Header";
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "AI Agent",
  description: "Transform your ideas into stunning images and videos",
};


// Create a DecorativeElements component for reusability
const DecorativeElements = () => {
  return (
    <>
      {/* Top Left Decoration */}
      <div 
        className="fixed left-[-3px] top-0 md:-translate-x-1/3 w-[70px] md:w-[400px] h-[200px] md:h-[400px] pointer-events-none z-100"
      >
        <Image
          src="/images/up-left.svg"
          alt=""
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Bottom Right Decoration */}
      <div 
        className="fixed right-0 bottom-[-3px] w-[150px] md:w-[250px] h-[150px] md:h-[250px] pointer-events-none z-100"
      >
        <Image
          src="/images/leaves.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </>
  );
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(
        merriweather.className,
        "bg-background text-foreground"
      )}>
        <Header />
        <DecorativeElements />
        <div className="relative min-h-screen">
        
          <main className="relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}