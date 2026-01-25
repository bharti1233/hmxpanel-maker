import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Lock, Unlock } from "lucide-react";
import { useAdmin, verifyAdminCode } from "@/contexts/AdminContext";

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "unlock" | "admin";
}

const SecretCodeModal = ({ isOpen, onClose, mode }: SecretCodeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const { setIsAdmin, setIsUnlocked, setShowAdminModal } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyAdminCode(code)) {
      if (mode === "unlock") {
        setIsUnlocked(true);
      } else {
        setIsAdmin(true);
        setShowAdminModal(true);
      }
      setCode("");
      setError("");
      onClose();
    } else {
      setError("Invalid code! Try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotateX: 0,
              x: isShaking ? [0, -10, 10, -10, 10, 0] : 0 
            }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{ 
              type: "spring", 
              damping: 20,
              x: { duration: 0.4 }
            }}
            className="glass-card rounded-3xl p-8 max-w-md w-full relative overflow-hidden"
            style={{
              boxShadow: "0 25px 50px -12px hsl(320, 80%, 30%, 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
            }}
          >
            {/* Decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-birthday-pink/10 via-transparent to-birthday-purple/10 pointer-events-none" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center"
                style={{ boxShadow: "0 0 30px hsl(320, 80%, 65%, 0.5)" }}
              >
                {mode === "unlock" ? (
                  <Lock className="w-8 h-8 text-white" />
                ) : (
                  <Unlock className="w-8 h-8 text-white" />
                )}
              </motion.div>

              <h2 className="text-2xl font-display font-bold text-gradient mb-2">
                {mode === "unlock" ? "🔐 Early Access" : "🔧 Admin Access"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {mode === "unlock" 
                  ? "Enter the secret code to unlock the birthday experience early!"
                  : "Enter admin code to customize the site"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter secret code..."
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setError("");
                    }}
                    className="text-center text-xl tracking-[0.5em] bg-background/50 border-birthday-pink/30 focus:border-birthday-pink h-14 rounded-xl"
                    maxLength={10}
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-destructive text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="birthday"
                  size="lg"
                  className="w-full"
                >
                  {mode === "unlock" ? "🔓 Unlock" : "🔧 Open Admin Panel"}
                </Button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SecretCodeModal;
