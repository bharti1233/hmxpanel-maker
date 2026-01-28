import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Types
export type MediaType = "none" | "image" | "video";

export interface MemoryItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  mediaType: MediaType;
  mediaUrl: string;
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
  isLoading: boolean;
  isSyncing: boolean;
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

const defaultConfig: SiteConfig = {
  recipientName: "Birthday Star",
  birthdayDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  timezone: "UTC",
  
  profileImageUrl: "",
  voiceMessageUrl: "",
  backgroundMusicUrl: "",
  instagramLink: "",
  
  countdownTitle: "🎉 Birthday Countdown 🎉",
  countdownSubtitle: "✨ A special day is on the way… Let's countdown to the magical moment! ✨",
  starPageMessage: "🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it's YOUR day. 🌸",
  cakePageTitle: "🎂 Cake Cutting 🎂",
  cakePageSubtitle: "Make a wish and celebrate!",
  letterTitle: "💌 To My Amazing Friend",
  letterParagraphs: [
    { id: "1", content: "Happy Birthday! 🎉 Today is all about celebrating YOU!" },
  ],
  letterSignature: "With loads of love & friendship,",
  senderName: "HMXPANEL",
  finalRevealMessage: "May your day be filled with joy, laughter, and all the love in the world!",
  
  memories: [],
  quizQuestions: [],
  
  showMemoryTimeline: true,
  showVoiceMessage: true,
  showWishVault: true,
  showFinalReveal: true,
};

// Helper to convert database row to SiteConfig
const dbToConfig = (row: any): SiteConfig => ({
  recipientName: row.recipient_name || "Birthday Star",
  birthdayDate: row.birthday_date || new Date().toISOString(),
  timezone: row.timezone || "UTC",
  profileImageUrl: row.profile_image_url || "",
  voiceMessageUrl: row.voice_message_url || "",
  backgroundMusicUrl: row.background_music_url || "",
  instagramLink: row.instagram_link || "",
  countdownTitle: row.countdown_title || "🎉 Birthday Countdown 🎉",
  countdownSubtitle: row.countdown_subtitle || "",
  starPageMessage: row.star_page_message || "",
  cakePageTitle: row.cake_page_title || "🎂 Cake Cutting 🎂",
  cakePageSubtitle: row.cake_page_subtitle || "",
  letterTitle: row.letter_title || "💌 To My Amazing Friend",
  letterParagraphs: Array.isArray(row.letter_paragraphs) ? row.letter_paragraphs : [],
  letterSignature: row.letter_signature || "",
  senderName: row.sender_name || "HMXPANEL",
  finalRevealMessage: row.final_reveal_message || "",
  memories: Array.isArray(row.memories) ? row.memories : [],
  quizQuestions: Array.isArray(row.quiz_questions) ? row.quiz_questions : [],
  showMemoryTimeline: row.show_memory_timeline ?? true,
  showVoiceMessage: row.show_voice_message ?? true,
  showWishVault: row.show_wish_vault ?? true,
  showFinalReveal: row.show_final_reveal ?? true,
});

// Helper to convert SiteConfig to database format
const configToDb = (config: Partial<SiteConfig>): Record<string, any> => {
  const mapping: Record<string, string> = {
    recipientName: "recipient_name",
    birthdayDate: "birthday_date",
    timezone: "timezone",
    profileImageUrl: "profile_image_url",
    voiceMessageUrl: "voice_message_url",
    backgroundMusicUrl: "background_music_url",
    instagramLink: "instagram_link",
    countdownTitle: "countdown_title",
    countdownSubtitle: "countdown_subtitle",
    starPageMessage: "star_page_message",
    cakePageTitle: "cake_page_title",
    cakePageSubtitle: "cake_page_subtitle",
    letterTitle: "letter_title",
    letterParagraphs: "letter_paragraphs",
    letterSignature: "letter_signature",
    senderName: "sender_name",
    finalRevealMessage: "final_reveal_message",
    memories: "memories",
    quizQuestions: "quiz_questions",
    showMemoryTimeline: "show_memory_timeline",
    showVoiceMessage: "show_voice_message",
    showWishVault: "show_wish_vault",
    showFinalReveal: "show_final_reveal",
  };

  const dbData: Record<string, any> = {};
  for (const [key, value] of Object.entries(config)) {
    if (mapping[key]) {
      dbData[mapping[key]] = value;
    }
  }
  return dbData;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AdminState>({
    isAdminMode: false,
    isPreviewMode: false,
    config: defaultConfig,
    isLoading: true,
    isSyncing: false,
  });

  // Fetch config from database on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("site_config")
          .select("*")
          .eq("config_key", "main")
          .maybeSingle();

        if (error) {
          console.error("Error fetching config:", error);
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (data) {
          setState(prev => ({
            ...prev,
            config: dbToConfig(data),
            isLoading: false,
          }));
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error("Failed to fetch config:", err);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchConfig();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("site_config_changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_config",
          filter: "config_key=eq.main",
        },
        (payload) => {
          console.log("Real-time update received:", payload);
          if (payload.new) {
            setState(prev => ({
              ...prev,
              config: dbToConfig(payload.new),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Admin access is now permanent - no birthday date restriction
  const canAccessAdmin = useCallback((): boolean => {
    return true;
  }, []);

  const setAdminMode = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isAdminMode: value, isPreviewMode: false }));
  }, []);

  const setPreviewMode = useCallback((value: boolean) => {
    // Preview mode is disabled after birthday
    const birthdayDate = new Date(state.config.birthdayDate);
    const now = new Date();
    if (value && now >= birthdayDate) return;
    
    setState(prev => ({ ...prev, isPreviewMode: value, isAdminMode: false }));
  }, [state.config.birthdayDate]);

  const updateConfig = useCallback(async (updates: Partial<SiteConfig>) => {
    // Optimistically update local state
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...updates },
      isSyncing: true,
    }));

    // Sync to database
    try {
      const dbUpdates = configToDb(updates);
      const { error } = await supabase
        .from("site_config")
        .update(dbUpdates)
        .eq("config_key", "main");

      if (error) {
        console.error("Error updating config:", error);
      }
    } catch (err) {
      console.error("Failed to sync config:", err);
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, []);

  const resetConfig = useCallback(async () => {
    setState(prev => ({
      ...prev,
      config: defaultConfig,
      isSyncing: true,
    }));

    try {
      const dbData = configToDb(defaultConfig);
      const { error } = await supabase
        .from("site_config")
        .update(dbData)
        .eq("config_key", "main");

      if (error) {
        console.error("Error resetting config:", error);
      }
    } catch (err) {
      console.error("Failed to reset config:", err);
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, []);

  const clearWishVault = useCallback(() => {
    localStorage.removeItem("dristi_birthday_wish_2025");
  }, []);

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
