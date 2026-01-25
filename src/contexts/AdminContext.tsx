import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SiteContent {
  // General
  recipientName: string;
  senderName: string;
  birthdayDate: string;
  birthdayImage: string;
  instagramLink: string;
  
  // Countdown Page
  countdownTitle: string;
  countdownSubtitle: string;
  
  // Star Page
  starTitle: string;
  starSubtitle: string;
  starMessage: string;
  
  // Memories Page
  memoriesTitle: string;
  memories: Array<{
    title: string;
    description: string;
    emoji: string;
  }>;
  
  // Quiz Page
  quizTitle: string;
  quizSubtitle: string;
  
  // Cake Page
  cakeTitle: string;
  cakeSubtitle: string;
  cakeMessage: string;
  
  // Letter Page
  letterTitle: string;
  letterSubtitle: string;
  letterContent: string[];
  
  // Final Page
  finalTitle: string;
  finalMessage: string;
}

const defaultContent: SiteContent = {
  recipientName: "Dristi",
  senderName: "HMXPANEL",
  birthdayDate: "2026-08-29T00:00:00",
  birthdayImage: "https://i.supaimg.com/3c6ca851-1689-4e6a-a7aa-6c30931afd1a.jpg",
  instagramLink: "https://www.instagram.com/reel/DMPCXX_I8pO/?igsh=MWVzeXZhd3YzdnByNg==",
  
  countdownTitle: "🎉 Birthday Countdown 🎉",
  countdownSubtitle: "✨ A Queen's special day is on the way… Let's countdown to the magical moment! ✨",
  
  starTitle: "⭐ Birthday Star ⭐",
  starSubtitle: "Celebrating the amazing person you are!",
  starMessage: "🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it's YOUR day. You're not just the star, you're the whole sky filled with love, laughter, and light! 🌸",
  
  memoriesTitle: "✨ Our Journey Together ✨",
  memories: [
    { title: "The Day We First Met", description: "That moment when our paths crossed and a beautiful friendship began 💫", emoji: "👋" },
    { title: "Our Endless Conversations", description: "Hours of talking, laughing, and sharing our deepest thoughts 💬", emoji: "💭" },
    { title: "The Funniest Memory", description: "Remember when we couldn't stop laughing? Those are the best moments! 😂", emoji: "🤣" },
    { title: "Supporting Each Other", description: "Through thick and thin, we've always had each other's backs 🤝", emoji: "💪" },
    { title: "Adventures Together", description: "Every moment with you turns into an unforgettable adventure ✨", emoji: "🌟" },
    { title: "Today & Forever", description: "Celebrating you today and cherishing our friendship always 💖", emoji: "🎂" },
  ],
  
  quizTitle: "🎯 Birthday Quiz 🎯",
  quizSubtitle: "How well do you know the birthday star?",
  
  cakeTitle: "🎂 Cake Cutting 🎂",
  cakeSubtitle: "Make a wish and celebrate!",
  cakeMessage: "🎂 Make a Wish! 🎂",
  
  letterTitle: "💌 Birthday Letter 💌",
  letterSubtitle: "A letter filled with love, just for you.",
  letterContent: [
    "Happy Birthday, bestie! 🎉 Today is all about celebrating YOU – the laughter you bring, the craziness we share, and the countless memories that make our friendship so special. 💕",
    "From silly jokes to endless talks, you've been a constant source of happiness in my life. 🌸 Thank you for always being the kind, caring, and wonderful person that you are.",
    "On this special day, I wish you loads of happiness, unlimited cake, and all the success your heart desires. 🎂✨",
    "May this year bring you new adventures, exciting opportunities, and moments that you'll never forget. Because honestly, you deserve nothing less than the absolute best. 🌟",
    "Keep shining, keep smiling, and never forget that your friends will always be here to cheer you on. 💖",
  ],
  
  finalTitle: "🎁 Happy Birthday! 🎁",
  finalMessage: "Thank you for being an amazing person. Here's to another year of wonderful memories together! 🎉",
};

interface AdminContextType {
  isAdmin: boolean;
  isUnlocked: boolean;
  content: SiteContent;
  setIsAdmin: (value: boolean) => void;
  setIsUnlocked: (value: boolean) => void;
  updateContent: (updates: Partial<SiteContent>) => void;
  resetContent: () => void;
  showAdminModal: boolean;
  setShowAdminModal: (value: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CODE = "4157";
const STORAGE_KEY = "birthday_site_content";
const UNLOCK_KEY = "birthday_site_unlocked";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultContent, ...JSON.parse(saved) } : defaultContent;
  });

  useEffect(() => {
    const unlocked = localStorage.getItem(UNLOCK_KEY);
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem(UNLOCK_KEY, isUnlocked ? "true" : "false");
  }, [isUnlocked]);

  const updateContent = (updates: Partial<SiteContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
  };

  const resetContent = () => {
    setContent(defaultContent);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isUnlocked,
        content,
        setIsAdmin,
        setIsUnlocked,
        updateContent,
        resetContent,
        showAdminModal,
        setShowAdminModal,
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

export const verifyAdminCode = (code: string): boolean => {
  return code === ADMIN_CODE;
};

export type { SiteContent };
