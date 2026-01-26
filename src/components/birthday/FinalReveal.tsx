import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";
import { ExternalLink, Heart, Star, Sparkles } from "lucide-react";

interface FinalRevealProps {
  recipientName?: string;
  instagramLink?: string;
  message?: string;
}

const FinalReveal = ({ 
  recipientName = "Dristi",
  instagramLink = "https://www.instagram.com",
  message = "May your day be filled with joy, laughter, and all the love in the world!"
}: FinalRevealProps) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-birthday-pink via-birthday-purple to-birthday-cyan flex items-center justify-center"
              style={{ boxShadow: "0 0 60px hsl(320, 80%, 65%, 0.5)" }}
            >
              <Star className="w-16 h-16 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient mb-4">
              One Final Surprise
            </h2>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              You've made it through all the celebrations! Ready for your final birthday surprise?
            </p>

            <Button
              onClick={() => setIsRevealed(true)}
              variant="birthday"
              size="lg"
              className="gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Reveal My Surprise
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Confetti />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <motion.span
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, repeat: 3 }}
                className="text-8xl md:text-9xl block"
              >
                🎉
              </motion.span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-display font-bold mb-6"
            >
              <span className="text-gradient">Happy Birthday, {recipientName}!</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-muted-foreground max-w-lg mx-auto mb-4"
            >
              {message}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-2xl font-script text-birthday-pink mb-10"
            >
              You are truly special! 💖
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                asChild
                variant="birthday"
                size="lg"
                className="gap-2"
              >
                <a href={instagramLink} target="_blank" rel="noopener noreferrer">
                  <Heart className="w-5 h-5" />
                  Special Gift For You
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </motion.div>

            {/* Floating hearts */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: "100vh",
                    x: `${Math.random() * 100}vw`,
                    opacity: 0
                  }}
                  animate={{ 
                    y: "-20vh",
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: 4 + Math.random() * 2,
                    delay: 1 + i * 0.3,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                  className="absolute text-2xl"
                >
                  {["💖", "💕", "💗", "✨", "🌟"][i % 5]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalReveal;
