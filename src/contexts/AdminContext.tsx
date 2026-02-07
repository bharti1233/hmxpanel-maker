import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

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
  id?: string;
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
  showQuiz: boolean;
}

export interface AdminState {
  isAdminMode: boolean;
  isPreviewMode: boolean;
  config: SiteConfig;
  isLoading: boolean;
  isSyncing: boolean;
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  authLoading: boolean;
}

interface AdminContextType {
  state: AdminState;
  setAdminMode: (value: boolean) => void;
  setPreviewMode: (value: boolean) => void;
  updateConfig: (updates: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  clearWishVault: () => void;
  canAccessAdmin: () => boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

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
  showQuiz: true,
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
  showQuiz: row.show_quiz ?? true,
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
    showQuiz: "show_quiz",
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
    user: null,
    session: null,
    isAdmin: false,
    authLoading: true,
  });

  // Check if user has admin role
  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        logger.error("Error checking admin role:", error);
        return false;
      }

      return !!data;
    } catch (err) {
      logger.error("Failed to check admin role:", err);
      return false;
    }
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        
        if (user) {
          // Use setTimeout to prevent potential race conditions
          setTimeout(async () => {
            const isAdmin = await checkAdminRole(user.id);
            setState(prev => ({
              ...prev,
              user,
              session,
              isAdmin,
              isAdminMode: isAdmin && prev.isAdminMode,
              authLoading: false,
            }));
          }, 0);
        } else {
          setState(prev => ({
            ...prev,
            user: null,
            session: null,
            isAdmin: false,
            isAdminMode: false,
            authLoading: false,
          }));
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user ?? null;
      
      if (user) {
        const isAdmin = await checkAdminRole(user.id);
        setState(prev => ({
          ...prev,
          user,
          session,
          isAdmin,
          authLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, authLoading: false }));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

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
          logger.error("Error fetching config:", error);
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
        logger.error("Failed to fetch config:", err);
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
          logger.log("Real-time update received:", payload);
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

  const canAccessAdmin = useCallback((): boolean => {
    return state.isAdmin;
  }, [state.isAdmin]);

  const setAdminMode = useCallback((value: boolean) => {
    // Only allow admin mode if user is authenticated admin
    if (value && !state.isAdmin) {
      logger.warn("Cannot enable admin mode: user is not an admin");
      return;
    }
    setState(prev => ({ ...prev, isAdminMode: value, isPreviewMode: false }));
  }, [state.isAdmin]);

  const setPreviewMode = useCallback((value: boolean) => {
    // Preview mode is disabled after birthday
    const birthdayDate = new Date(state.config.birthdayDate);
    const now = new Date();
    if (value && now >= birthdayDate) return;
    
    setState(prev => ({ ...prev, isPreviewMode: value, isAdminMode: false }));
  }, [state.config.birthdayDate]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data.user) {
        const isAdmin = await checkAdminRole(data.user.id);
        if (!isAdmin) {
          await supabase.auth.signOut();
          return { error: "You don't have admin access. Please contact the site owner." };
        }
      }

      return { error: null };
    } catch (err) {
      return { error: "An unexpected error occurred" };
    }
  }, [checkAdminRole]);

  const signUp = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (err) {
      return { error: "An unexpected error occurred" };
    }
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState(prev => ({
      ...prev,
      isAdminMode: false,
      isPreviewMode: false,
      user: null,
      session: null,
      isAdmin: false,
    }));
  }, []);

  const updateConfig = useCallback(async (updates: Partial<SiteConfig>) => {
    // Only allow updates if user is admin
    if (!state.isAdmin) {
      logger.error("Cannot update config: user is not an admin");
      return;
    }

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
        logger.error("Error updating config:", error);
      }
    } catch (err) {
      logger.error("Failed to sync config:", err);
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [state.isAdmin]);

  const resetConfig = useCallback(async () => {
    if (!state.isAdmin) {
      logger.error("Cannot reset config: user is not an admin");
      return;
    }

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
        logger.error("Error resetting config:", error);
      }
    } catch (err) {
      logger.error("Failed to reset config:", err);
    } finally {
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  }, [state.isAdmin]);

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
        signIn,
        signUp,
        signOut,
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
