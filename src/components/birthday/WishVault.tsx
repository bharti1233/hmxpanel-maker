import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Unlock, Sparkles } from "lucide-react";

const STORAGE_KEY = "dristi_birthday_wish_2025";

const WishVault = () => {
  const [wish, setWish] = useState("");
  const [savedWish, setSavedWish] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedWish(stored);
      setIsLocked(true);
    }
  }, []);

  const handleSave = () => {
    if (wish.trim()) {
      localStorage.setItem(STORAGE_KEY, wish);
      setSavedWish(wish);
      setIsLocked(true);
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 2000);
    }
  };

  const handleUnlock = () => {
    setIsLocked(false);
    setWish(savedWish || "");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-3xl p-8 max-w-lg mx-auto relative overflow-hidden"
    >
      {/* Sparkle effect */}
      <AnimatePresence>
        {showSparkle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: "50%",
                  y: "50%"
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`
                }}
                transition={{ duration: 1, delay: i * 0.05 }}
                className="absolute text-birthday-gold"
              >
                ✦
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-3 mb-6">
        <motion.div
          animate={isLocked ? { rotateY: 0 } : { rotateY: 180 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-birthday-gold to-birthday-coral flex items-center justify-center"
        >
          {isLocked ? (
            <Lock className="w-6 h-6 text-white" />
          ) : (
            <Unlock className="w-6 h-6 text-white" />
          )}
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-gradient">
          Wish Vault
        </h3>
      </div>

      <p className="text-muted-foreground text-center mb-6">
        {isLocked
          ? "Your wish is safely locked away ✨"
          : "Write a wish for yourself. Only you will see this!"}
      </p>

      <AnimatePresence mode="wait">
        {isLocked ? (
          <motion.div
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="p-6 rounded-2xl bg-muted/50 mb-6">
              <p className="text-sm text-muted-foreground italic">
                "Your wish is written in the stars..."
              </p>
              <Sparkles className="w-8 h-8 mx-auto mt-4 text-birthday-gold" />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnlock}
              className="gap-2"
            >
              <Unlock className="w-4 h-4" />
              View My Wish
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Write your birthday wish here... 🌟"
              className="min-h-[120px] bg-muted/50 border-birthday-pink/20 focus:border-birthday-pink resize-none mb-4"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {wish.length}/500
              </span>
              <Button
                onClick={handleSave}
                disabled={!wish.trim()}
                variant="birthday"
                className="gap-2"
              >
                <Lock className="w-4 h-4" />
                Lock My Wish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground text-center mt-6">
        🔒 Your wish is stored locally and will be here when you return!
      </p>
    </motion.div>
  );
};

export default WishVault;
