import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { logger } from "@/lib/logger";

interface BackgroundMusicProps {
  audioUrl: string;
}

const BackgroundMusic = ({ audioUrl }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;
    
    // Create audio element
    audioRef.current = new Audio(audioUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handleToggle = async () => {
    if (!audioRef.current || !audioUrl) return;

    setHasInteracted(true);
    setShowPrompt(false);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      logger.log("Audio playback failed:", error);
    }
  };

  // Don't render if no audio URL
  if (!audioUrl) return null;

  return (
    <>
      {/* Floating Music Toggle */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <motion.button
          onClick={handleToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative w-14 h-14 rounded-full flex items-center justify-center
            shadow-lg backdrop-blur-md transition-all duration-300
            ${isPlaying 
              ? "bg-gradient-to-br from-birthday-pink to-birthday-purple shadow-[0_0_30px_hsl(320,80%,65%,0.4)]" 
              : "bg-card/80 border border-border/50 hover:border-birthday-pink/50"
            }
          `}
          aria-label={isPlaying ? "Mute music" : "Play music"}
        >
          <AnimatePresence mode="wait">
            {isPlaying ? (
              <motion.div
                key="playing"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Volume2 className="w-6 h-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="muted"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <VolumeX className="w-6 h-6 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full bg-birthday-pink/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.button>

        {/* Initial prompt tooltip */}
        <AnimatePresence>
          {showPrompt && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, x: 10, y: 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: 1.5 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border border-border/50 shadow-lg">
                <Music className="w-4 h-4 text-birthday-pink" />
                <span className="text-sm font-medium text-foreground">
                  Tap for music 🎵
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default BackgroundMusic;
