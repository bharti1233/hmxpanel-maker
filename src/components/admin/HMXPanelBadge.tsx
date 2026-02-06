import { useState } from "react";
import { motion } from "framer-motion";
import SecretCodeModal from "./SecretCodeModal";
import { useAdmin } from "@/contexts/AdminContext";

const HMXPanelBadge = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { state, setAdminMode } = useAdmin();

  const handleClick = () => {
    // If already logged in as admin, go directly to admin panel
    if (state.isAdmin && state.user) {
      setAdminMode(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={handleClick}
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
