import { useState } from "react";
import { motion } from "framer-motion";
import SecretCodeModal from "./SecretCodeModal";

const HMXPanelBadge = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer select-none"
        style={{ fontFamily: "system-ui" }}
      >
        made by hmxpanel
      </motion.button>

      <SecretCodeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HMXPanelBadge;
