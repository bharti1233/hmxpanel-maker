import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";

interface Cake3DProps {
  onComplete?: () => void;
}

const Cake3D = ({ onComplete }: Cake3DProps) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [cakeCut, setCakeCut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [isCutting, setIsCutting] = useState(false);

  const blowCandles = () => {
    setIsBlowing(true);
    setTimeout(() => {
      setCandlesLit(false);
      setIsBlowing(false);
    }, 1500);
  };

  const cutCake = () => {
    if (!candlesLit) {
      setIsCutting(true);
      setTimeout(() => {
        setCakeCut(true);
        setIsCutting(false);
      }, 1000);
    }
  };

  const celebrate = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  return (
    <div className="relative perspective-2000 flex flex-col items-center">
      {showConfetti && <Confetti />}
      
      {/* Wind effect when blowing */}
      <AnimatePresence>
        {isBlowing && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 50 }}
            exit={{ opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 text-4xl z-10"
          >
            💨💨💨
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Cake Container */}
      <motion.div
        className="preserve-3d relative"
        animate={cakeCut ? {} : { rotateY: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Candles */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Candle stick */}
              <div className="w-3 h-12 bg-gradient-to-b from-birthday-pink to-birthday-coral rounded-t-full mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
              
              {/* Flame */}
              <AnimatePresence>
                {candlesLit && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: isBlowing ? [1, 0.5, 1.2, 0] : 1,
                      x: isBlowing ? [0, 10, -5, 15] : 0 
                    }}
                    exit={{ scale: 0, y: -10 }}
                    transition={{ duration: isBlowing ? 1.5 : 0.3 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  >
                    <motion.div
                      animate={{ 
                        scaleY: [1, 1.2, 0.9, 1.1, 1],
                        scaleX: [1, 0.9, 1.1, 0.95, 1],
                      }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                      className="relative"
                    >
                      <div className="w-4 h-6 bg-gradient-to-t from-birthday-gold via-yellow-400 to-orange-300 rounded-full blur-[1px]" 
                        style={{ 
                          clipPath: "ellipse(50% 70% at 50% 70%)",
                          boxShadow: "0 0 15px 5px rgba(255, 200, 50, 0.5)"
                        }}
                      />
                      <div className="absolute inset-0 w-2 h-4 bg-white/80 rounded-full left-1/2 -translate-x-1/2 top-1"
                        style={{ clipPath: "ellipse(50% 60% at 50% 60%)" }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Main Cake - 3D layered effect */}
        <motion.div 
          className="relative"
          animate={!cakeCut ? { y: [0, -3, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Cake layers - 3D perspective */}
          <div className="preserve-3d" style={{ transform: "rotateX(15deg)" }}>
            {/* Top layer (smallest) */}
            <motion.div 
              className="w-32 h-16 mx-auto rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)",
                boxShadow: "0 8px 25px -5px rgba(236, 72, 153, 0.5), inset 0 -5px 15px rgba(0,0,0,0.2)",
                transform: "translateZ(30px)",
              }}
            >
              {/* Frosting drips */}
              <div className="absolute -bottom-2 left-2 w-4 h-6 bg-pink-200 rounded-b-full" />
              <div className="absolute -bottom-3 left-8 w-3 h-7 bg-pink-200 rounded-b-full" />
              <div className="absolute -bottom-2 right-4 w-5 h-5 bg-pink-200 rounded-b-full" />
              {/* Sprinkles */}
              <div className="absolute top-3 left-4 w-2 h-1 bg-birthday-cyan rotate-45 rounded-full" />
              <div className="absolute top-4 left-10 w-2 h-1 bg-birthday-gold -rotate-30 rounded-full" />
              <div className="absolute top-2 right-6 w-2 h-1 bg-birthday-lavender rotate-12 rounded-full" />
            </motion.div>

            {/* Middle layer */}
            <motion.div 
              className="w-44 h-20 mx-auto -mt-2 rounded-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)",
                boxShadow: "0 10px 30px -5px rgba(168, 85, 247, 0.5), inset 0 -5px 15px rgba(0,0,0,0.2)",
                transform: "translateZ(15px)",
              }}
            >
              {/* Decoration band */}
              <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-gradient-to-r from-pink-300 via-white to-pink-300 opacity-60" />
              {/* Frosting drips */}
              <div className="absolute -bottom-3 left-4 w-4 h-8 bg-purple-300 rounded-b-full" />
              <div className="absolute -bottom-4 left-14 w-5 h-10 bg-purple-300 rounded-b-full" />
              <div className="absolute -bottom-2 right-8 w-3 h-6 bg-purple-300 rounded-b-full" />
            </motion.div>

            {/* Bottom layer (largest) */}
            <motion.div 
              className="w-56 h-24 mx-auto -mt-2 rounded-2xl relative overflow-hidden"
              style={{
                background: cakeCut 
                  ? "linear-gradient(135deg, #f472b6 0%, #ec4899 30%, #8b5cf6 70%, #7c3aed 100%)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
                boxShadow: "0 15px 40px -10px rgba(139, 92, 246, 0.6), inset 0 -8px 20px rgba(0,0,0,0.2)",
              }}
            >
              {/* Decoration patterns */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-around">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-birthday-gold/70" />
                ))}
              </div>
              
              {/* Cut slice effect */}
              <AnimatePresence>
                {cakeCut && (
                  <motion.div
                    initial={{ scaleX: 0, originX: 0.5 }}
                    animate={{ scaleX: 1 }}
                    className="absolute right-4 top-0 bottom-0 w-16 bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 rounded-r-2xl"
                    style={{
                      clipPath: "polygon(0 0, 100% 20%, 100% 100%, 0 80%)"
                    }}
                  >
                    {/* Cake interior */}
                    <div className="absolute inset-1 bg-gradient-to-b from-amber-100 to-amber-200 rounded-r-xl"
                      style={{ clipPath: "polygon(5% 5%, 95% 20%, 95% 95%, 5% 80%)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cake plate */}
            <div 
              className="w-64 h-6 mx-auto -mt-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #d4af37 100%)",
                boxShadow: "0 5px 20px rgba(212, 175, 55, 0.4)",
              }}
            />
          </div>
        </motion.div>

        {/* Knife animation */}
        <AnimatePresence>
          {isCutting && (
            <motion.div
              initial={{ x: -150, y: 0, rotate: -45 }}
              animate={{ x: 50, y: 20, rotate: -45 }}
              exit={{ x: 150, y: -20 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute top-20 left-0 text-5xl z-20"
            >
              🔪
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Button
          onClick={blowCandles}
          disabled={!candlesLit || isBlowing}
          variant="birthday"
          size="lg"
          className="gap-2"
        >
          💨 Blow Candles
        </Button>
        <Button
          onClick={cutCake}
          disabled={candlesLit || cakeCut || isCutting}
          variant="birthday"
          size="lg"
          className="gap-2"
        >
          🔪 Cut Cake
        </Button>
        <Button
          onClick={celebrate}
          disabled={!cakeCut}
          variant="birthday"
          size="lg"
          className="gap-2"
        >
          🎉 Celebrate!
        </Button>
      </div>

      {/* Status message */}
      <motion.p
        key={candlesLit ? "lit" : cakeCut ? "cut" : "blown"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground mt-6 max-w-md"
      >
        {candlesLit
          ? "✨ Make a wish and blow out the candles!"
          : !cakeCut
          ? "🌟 Perfect! Now cut the cake!"
          : "🎂 Time to celebrate this wonderful day!"}
      </motion.p>
    </div>
  );
};

export default Cake3D;
