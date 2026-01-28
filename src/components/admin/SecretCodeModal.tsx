import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdmin, validateAdminCode, validatePreviewCode } from "@/contexts/AdminContext";
import { Lock, Eye, AlertCircle } from "lucide-react";

interface SecretCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SecretCodeModal = ({ isOpen, onClose }: SecretCodeModalProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { setAdminMode, setPreviewMode, canAccessAdmin } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (validateAdminCode(code)) {
      // Admin access is always available (permanent)
      setAdminMode(true);
      onClose();
      setCode("");
    } else if (validatePreviewCode(code)) {
      // Preview mode may be restricted after birthday
      setPreviewMode(true);
      onClose();
      setCode("");
    } else {
      setError("Invalid code");
    }
  };

  const handleClose = () => {
    setCode("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-birthday-pink/20">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Lock className="w-5 h-5 text-birthday-pink" />
            Enter Access Code
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="relative">
            <Input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError("");
              }}
              placeholder="Enter code..."
              className="text-center text-lg tracking-widest bg-muted/50 border-muted-foreground/20 focus:border-birthday-pink"
              autoFocus
            />
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="birthday"
              className="flex-1 gap-2"
              disabled={!code.trim()}
            >
              <Eye className="w-4 h-4" />
              Access
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecretCodeModal;
