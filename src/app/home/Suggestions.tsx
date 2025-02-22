import Image from "next/image";

interface Suggestion {
  icon: string;
  text: string;
}

interface SuggestionButtonProps {
  suggestion: Suggestion;
  onClick: (text: string) => void;
}

interface StorySuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (text: string) => void;
}

const SuggestionButton = ({ suggestion, onClick }: SuggestionButtonProps) => (
  <button
    onClick={() => onClick(suggestion.text)}
    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-[24px] md:rounded-[48px] bg-background border border-border hover:bg-input/50 transition-colors whitespace-nowrap"
  >
    <div className="bg-input rounded-full w-8 h-8 md:w-10 md:h-10 flex items-end justify-end overflow-hidden flex-shrink-0">
      <Image
        src={suggestion.icon}
        alt=""
        width={24}
        height={24}
        className="w-6 h-6 md:w-8 md:h-8"
      />
    </div>
    <span className="font-['Quicksand'] font-bold text-sm md:text-base text-primary-foreground truncate">
      {suggestion.text}
    </span>
  </button>
);

export const StorySuggestions = ({ suggestions, onSuggestionClick }: StorySuggestionsProps) => (
  <div className="flex flex-col w-full md:w-auto items-center justify-center gap-3 md:flex-row md:items-center md:gap-4 px-4 md:px-0">
    <span className="font-['Quicksand'] text-sm md:text-base text-black font-bold whitespace-nowrap">
      Or try with :
    </span>
    
    {/* Mobile View - Vertical Layout */}
    <div className="flex flex-col gap-2 w-full md:hidden">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="w-full flex justify-center">
          <SuggestionButton
            suggestion={suggestion}
            onClick={onSuggestionClick}
          />
        </div>
      ))}
    </div>

    {/* Desktop View - Horizontal Scroll with Fade */}
    <div className="hidden md:block relative w-[500px]">
      {/* Fade left */}
      <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-10" />
      
      {/* Scrollable suggestions */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex-shrink-0">
            <SuggestionButton
              suggestion={suggestion}
              onClick={onSuggestionClick}
            />
          </div>
        ))}
      </div>
      
      {/* Fade right */}
      <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-10" />
    </div>
  </div>
);