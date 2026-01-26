import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types
export interface MemoryItem {
  title: string;
  description: string;
  emoji: string;
  imageUrl?: string;
}

export interface LetterParagraph {
  id: string;
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface SiteConfig {
  // Core details
  recipientName: string;
  birthdayDate: string; // ISO string
  timezone: string;
  
  // Media URLs
  profileImageUrl: string;
  voiceMessageUrl: string;
  backgroundMusicUrl: string;
  instagramLink: string;
  
  // Page content
  countdownTitle: string;
  countdownSubtitle: string;
  starPageMessage: string;
  cakePageTitle: string;
  cakePageSubtitle: string;
  letterTitle: string;
  letterParagraphs: LetterParagraph[];
  letterSignature: string;
  senderName: string;
  finalRevealMessage: string;
  
  // Memories
  memories: MemoryItem[];
  
  // Quiz
  quizQuestions: QuizQuestion[];
  
  // Section visibility
  showMemoryTimeline: boolean;
  showVoiceMessage: boolean;
  showWishVault: boolean;
  showFinalReveal: boolean;
}

export interface AdminState {
  isAdminMode: boolean;
  isPreviewMode: boolean;
  config: SiteConfig;
}

interface AdminContextType {
  state: AdminState;
  setAdminMode: (value: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  clearWishVault: () => void;
  canAccessAdmin: () => boolean;
}

const ADMIN_CODE = "4157";
const PREVIEW_CODE = "preview";
const CONFIG_STORAGE_KEY = "birthday_site_config";

const defaultConfig: SiteConfig = {
  recipientName: "Dristi",
  birthdayDate: "2026-08-29T00:00:00",
  timezone: "Asia/Kolkata",
  
  profileImageUrl: "https://i.supaimg.com/3c6ca851-1689-4e6a-a7aa-6c30931afd1a.jpg",
  voiceMessageUrl: "",
  backgroundMusicUrl: "",
  instagramLink: "https://www.instagram.com/reel/DMPCXX_I8pO/?igsh=MWVzeXZhd3YzdnByNg==",
  
  countdownTitle: "🎉 Birthday Countdown 🎉",
  countdownSubtitle: "✨ A Queen's special day is on the way… Let's countdown to the magical moment! ✨",
  starPageMessage: "🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it's YOUR day. You're not just the star, you're the whole sky filled with love, laughter, and light! 🌸",
  cakePageTitle: "🎂 Cake Cutting 🎂",
  cakePageSubtitle: "Make a wish and celebrate!",
  letterTitle: "💌 To My Amazing Friend",
  letterParagraphs: [
    { id: "1", content: "Happy Birthday, bestie! 🎉 Today is all about celebrating YOU – the laughter you bring, the craziness we share, and the countless memories that make our friendship so special. 💕" },
    { id: "2", content: "From silly jokes to endless talks, you've been a constant source of happiness in my life. 🌸 Thank you for always being the kind, caring, and wonderful person that you are." },
    { id: "3", content: "On this special day, I wish you loads of happiness, unlimited cake, and all the success your heart desires. 🎂✨" },
    { id: "4", content: "May this year bring you new adventures, exciting opportunities, and moments that you'll never forget. Because honestly, you deserve nothing less than the absolute best. 🌟" },
    { id: "5", content: "Keep shining, keep smiling, and never forget that your friends will always be here to cheer you on. 💖" },
  ],
  letterSignature: "With loads of love & friendship,",
  senderName: "HMXPANEL",
  finalRevealMessage: "May your day be filled with joy, laughter, and all the love in the world!",
  
  memories: [
    { title: "The Day We First Met", description: "That moment when our paths crossed and a beautiful friendship began 💫", emoji: "👋" },
    { title: "Our Endless Conversations", description: "Hours of talking, laughing, and sharing our deepest thoughts 💬", emoji: "💭" },
    { title: "The Funniest Memory", description: "Remember when we couldn't stop laughing? Those are the best moments! 😂", emoji: "🤣" },
    { title: "Supporting Each Other", description: "Through thick and thin, we've always had each other's backs 🤝", emoji: "💪" },
    { title: "Adventures Together", description: "Every moment with you turns into an unforgettable adventure ✨", emoji: "🌟" },
    { title: "Today & Forever", description: "Celebrating you today and cherishing our friendship always 💖", emoji: "🎂" },
  ],
  
  quizQuestions: [
    { question: "What makes Dristi smile the most?", options: ["Kind words", "Good food", "Quality time", "All of the above! 💖"], correct: 3 },
    { question: "What's the best way to celebrate her?", options: ["Throw a surprise party", "Write heartfelt wishes", "Give her cake", "Just be there for her"], correct: 3 },
    { question: "What makes today special?", options: ["It's just another day", "It's DRISTI'S BIRTHDAY! 🎂", "Nothing much", "I forgot..."], correct: 1 },
  ],
  
  showMemoryTimeline: true,
  showVoiceMessage: true,
  showWishVault: true,
  showFinalReveal: true,
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AdminState>(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
    return {
      isAdminMode: false,
      isPreviewMode: false,
      config: savedConfig ? { ...defaultConfig, ...JSON.parse(savedConfig) } : defaultConfig,
    };
  });

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(state.config));
  }, [state.config]);

  const canAccessAdmin = (): boolean => {
    const birthdayDate = new Date(state.config.birthdayDate);
    const now = new Date();
    return now < birthdayDate;
  };

  const setAdminMode = (value: boolean) => {
    if (value && !canAccessAdmin()) return;
    setState(prev => ({ ...prev, isAdminMode: value, isPreviewMode: false }));
  };

  const setPreviewMode = (value: boolean) => {
    setState(prev => ({ ...prev, isPreviewMode: value, isAdminMode: false }));
  };

  const updateConfig = (updates: Partial<SiteConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...updates },
    }));
  };

  const resetConfig = () => {
    setState(prev => ({
      ...prev,
      config: defaultConfig,
    }));
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  };

  const clearWishVault = () => {
    localStorage.removeItem("dristi_birthday_wish_2025");
  };

  return (
    <AdminContext.Provider
      value={{
        state,
        setAdminMode,
        setPreviewMode,
        updateConfig,
        resetConfig,
        clearWishVault,
        canAccessAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};

export const validateAdminCode = (code: string): boolean => {
  return code === ADMIN_CODE;
};

export const validatePreviewCode = (code: string): boolean => {
  return code === PREVIEW_CODE;
};
