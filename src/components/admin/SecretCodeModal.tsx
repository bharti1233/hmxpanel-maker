import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { Lock, Eye, AlertCircle, Mail, KeyRound, LogIn, UserPlus } from "lucide-react";

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecretCodeModal = ({ isOpen, onClose }: SecretCodeModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const { signIn, signUp, setAdminMode } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
        } else {
          setAdminMode(true);
          onClose();
          resetForm();
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error);
        } else {
          setSignupSuccess(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSignupSuccess(false);
    setMode("login");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-birthday-pink/20">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-birthday-pink" />
            {mode === "login" ? "Admin Login" : "Create Account"}
          </DialogTitle>
        </DialogHeader>

        {signupSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold">Check your email!</h3>
            <p className="text-muted-foreground text-sm">
              We've sent you a confirmation link. Please check your email to verify your account.
            </p>
            <p className="text-muted-foreground text-xs">
              Note: You'll need an admin to grant you access after verification.
            </p>
            <Button onClick={() => { setSignupSuccess(false); setMode("login"); }} variant="outline">
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Email address"
                  className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-birthday-pink"
                  autoFocus
                  required
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Password"
                  className="pl-10 bg-muted/50 border-muted-foreground/20 focus:border-birthday-pink"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-destructive text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="birthday"
                className="flex-1 gap-2"
                disabled={!email.trim() || !password.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : mode === "login" ? (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </>
                )}
              </Button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="text-sm text-muted-foreground hover:text-birthday-pink transition-colors"
              >
                {mode === "login" 
                  ? "Need an account? Sign up" 
                  : "Already have an account? Login"}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SecretCodeModal;
