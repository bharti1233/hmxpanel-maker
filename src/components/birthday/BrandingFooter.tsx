import { motion } from "framer-motion";

interface BrandingFooterProps {
  onEditorClick?: () => void;
}

const BrandingFooter = ({ onEditorClick }: BrandingFooterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10"
    >
      <button
        onClick={onEditorClick}
        className="glass-card rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform touch-target"
      >
        <span className="text-xs text-muted-foreground">Made with</span>
        <span className="text-birthday-pink">💖</span>
        <span className="text-xs font-display font-semibold text-gradient">
          HMXPANEL
        </span>
      </button>
    </motion.div>
  );
};

export default BrandingFooter;
