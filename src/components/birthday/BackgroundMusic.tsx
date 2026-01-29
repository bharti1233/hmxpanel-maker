import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackgroundMusicProps {
  audioUrl: string;
}

const BackgroundMusic = ({ audioUrl }: BackgroundMusicProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  const handleToggle = async () => {
    if (!audioRef.current) return;

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
      console.error("Error playing audio:", error);
    }
  };

  const handleDismissPrompt = () => {
    setShowPrompt(false);
    setHasInteracted(true);
  };

  if (!audioUrl) return null;

  return (
    <>
      {/* Initial music prompt */}
      <AnimatePresence>
        {showPrompt && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="glass-card rounded-2xl p-4 flex items-center gap-4 shadow-glow">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center"
              >
                <Music className="w-5 h-5 text-white" />
              </motion.div>
              <div className="text-sm">
                <p className="font-medium text-foreground">🎵 Enable music?</p>
                <p className="text-muted-foreground text-xs">Enhance your experience</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="birthday"
                  onClick={handleToggle}
                  className="text-xs px-3"
                >
                  Play
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismissPrompt}
                  className="text-xs px-2"
                >
                  No
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating toggle button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            shadow-lg backdrop-blur-md border border-white/10
            transition-all duration-300 touch-manipulation
            ${isPlaying 
              ? "bg-gradient-to-br from-birthday-pink to-birthday-purple text-white shadow-glow" 
              : "bg-card/80 text-muted-foreground hover:text-foreground"
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
                transition={{ duration: 0.2 }}
              >
                <Volume2 className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="muted"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Sound wave animation when playing */}
          {isPlaying && (
            <div className="absolute -inset-1 rounded-full">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-birthday-pink/30"
              />
            </div>
          )}
        </motion.button>
      </motion.div>
    </>
  );
};

export default BackgroundMusic;
