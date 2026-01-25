import { useState } from "react";
import { motion } from "framer-motion";
import SecretCodeModal from "./SecretCodeModal";

interface MadeByBadgeProps {
  showUnlockOption?: boolean;
}

const MadeByBadge = ({ showUnlockOption = false }: MadeByBadgeProps) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"unlock" | "admin">("admin");

  const handleClick = () => {
    setModalMode("admin");
    setShowModal(true);
  };

  const handleUnlockClick = () => {
    setModalMode("unlock");
    setShowModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
      >
        {showUnlockOption && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUnlockClick}
            className="px-4 py-2 text-sm text-birthday-cyan hover:text-birthday-pink transition-colors glass-card rounded-full"
          >
            🔓 Early Access
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="group flex items-center gap-2 px-4 py-2 glass-card rounded-full cursor-pointer transition-all duration-300"
          style={{
            boxShadow: "0 4px 20px -5px hsl(320, 80%, 65%, 0.3)",
          }}
        >
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            made by
          </span>
          <span className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-birthday-pink via-birthday-purple to-birthday-cyan">
            hmxpanel
          </span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-sm"
          >
            ✨
          </motion.span>
        </motion.button>
      </motion.div>

      <SecretCodeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
      />
    </>
  );
};

export default MadeByBadge;
