import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Heart, Pause, Play } from "lucide-react";

interface VoiceMessageProps {
  audioUrl?: string;
}

const VoiceMessage = ({ audioUrl }: VoiceMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
        }
      };
    }
  }, [audioUrl]);

  const handlePlay = () => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        setHasPlayed(true);
      }
    } else {
      // Simulate playback when no URL provided
      setIsPlaying(true);
      setHasPlayed(true);
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-8 max-w-md mx-auto text-center"
    >
      <motion.div
        animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center"
        style={{ boxShadow: "0 0 40px hsl(320, 80%, 65%, 0.4)" }}
      >
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <Volume2 className="w-10 h-10 text-white" />
          </motion.div>
        ) : (
          <Heart className="w-10 h-10 text-white" />
        )}
      </motion.div>

      <h3 className="text-2xl font-display font-bold mb-3 text-gradient">
        🎧 A Message For You
      </h3>
      
      <p className="text-muted-foreground mb-6">
        {isPlaying 
          ? "Playing your special message... 💕" 
          : hasPlayed 
          ? "Hope that made you smile! 🥰"
          : "Tap to hear a heartfelt birthday message"}
      </p>

      {/* Audio wave visualization */}
      {isPlaying && (
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: [10, Math.random() * 30 + 10, 10],
              }}
              transition={{ 
                duration: 0.3, 
                repeat: Infinity, 
                delay: i * 0.05,
                repeatType: "reverse"
              }}
              className="w-1 bg-birthday-pink rounded-full"
              style={{ minHeight: 10 }}
            />
          ))}
        </div>
      )}

      <Button
        onClick={handlePlay}
        variant="birthday"
        size="lg"
        className="gap-2"
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            {hasPlayed ? "Play Again" : "Play Message"}
          </>
        )}
      </Button>

      {!audioUrl && (
        <p className="text-xs text-muted-foreground mt-4">
          💡 Tip: Upload your own voice recording for a personal touch!
        </p>
      )}
    </motion.div>
  );
};

export default VoiceMessage;
