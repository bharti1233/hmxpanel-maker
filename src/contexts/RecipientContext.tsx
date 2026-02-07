import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MemoryItem, LetterParagraph, QuizQuestion } from "@/contexts/AdminContext";
import { logger } from "@/lib/logger";

// Recipient config uses snake_case from database
export interface RecipientConfig {
  id: string;
  slug: string;
  recipient_name: string;
  birthday_date: string;
  timezone: string;
  profile_image_url: string;
  voice_message_url: string;
  background_music_url: string;
  instagram_link: string;
  countdown_title: string;
  countdown_subtitle: string;
  star_page_message: string;
  cake_page_title: string;
  cake_page_subtitle: string;
  letter_title: string;
  letter_paragraphs: LetterParagraph[];
  letter_signature: string;
  sender_name: string;
  final_reveal_message: string;
  memories: MemoryItem[];
  quiz_questions: QuizQuestion[];
  show_memory_timeline: boolean;
  show_voice_message: boolean;
  show_wish_vault: boolean;
  show_final_reveal: boolean;
  show_quiz: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database format to frontend format
const dbToRecipientConfig = (row: any): RecipientConfig => ({
  id: row.id,
  slug: row.slug,
  recipient_name: row.recipient_name || "Birthday Star",
  birthday_date: row.birthday_date || new Date().toISOString(),
  timezone: row.timezone || "UTC",
  profile_image_url: row.profile_image_url || "",
  voice_message_url: row.voice_message_url || "",
  background_music_url: row.background_music_url || "",
  instagram_link: row.instagram_link || "",
  countdown_title: row.countdown_title || "🎉 Birthday Countdown 🎉",
  countdown_subtitle: row.countdown_subtitle || "",
  star_page_message: row.star_page_message || "",
  cake_page_title: row.cake_page_title || "🎂 Cake Cutting 🎂",
  cake_page_subtitle: row.cake_page_subtitle || "",
  letter_title: row.letter_title || "💌 To My Amazing Friend",
  letter_paragraphs: Array.isArray(row.letter_paragraphs) ? row.letter_paragraphs : [],
  letter_signature: row.letter_signature || "",
  sender_name: row.sender_name || "HMXPANEL",
  final_reveal_message: row.final_reveal_message || "",
  memories: Array.isArray(row.memories) ? row.memories : [],
  quiz_questions: Array.isArray(row.quiz_questions) ? row.quiz_questions : [],
  show_memory_timeline: row.show_memory_timeline ?? true,
  show_voice_message: row.show_voice_message ?? true,
  show_wish_vault: row.show_wish_vault ?? true,
  show_final_reveal: row.show_final_reveal ?? true,
  show_quiz: row.show_quiz ?? true,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

interface RecipientState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  config: RecipientConfig | null;
  slug: string | null;
}

interface RecipientContextType {
  state: RecipientState;
  verifyPassword: (slug: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const RecipientContext = createContext<RecipientContextType | undefined>(undefined);

export const RecipientProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<RecipientState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    config: null,
    slug: null,
  });

  const verifyPassword = useCallback(async (slug: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke("verify-recipient-password", {
        body: { slug, password },
      });

      if (error) {
        logger.error("Password verification error:", error);
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Failed to verify password. Please try again." 
        }));
        return false;
      }

      if (!data.success) {
        setState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: data.error || "Invalid password" 
        }));
        return false;
      }

      const config = dbToRecipientConfig(data.recipient);
      
      // Store in session storage for persistence during session
      sessionStorage.setItem(`recipient_${slug}`, JSON.stringify(config));

      setState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        config,
        slug,
      });

      return true;
    } catch (err) {
      logger.error("Password verification failed:", err);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "An unexpected error occurred" 
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    if (state.slug) {
      sessionStorage.removeItem(`recipient_${state.slug}`);
    }
    setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      config: null,
      slug: null,
    });
  }, [state.slug]);

  return (
    <RecipientContext.Provider value={{ state, verifyPassword, logout }}>
      {children}
    </RecipientContext.Provider>
  );
};

export const useRecipient = () => {
  const context = useContext(RecipientContext);
  if (!context) {
    throw new Error("useRecipient must be used within RecipientProvider");
  }
  return context;
};
