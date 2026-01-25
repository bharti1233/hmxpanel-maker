import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  rotation: number;
  delay: number;
  size: number;
  type: "circle" | "square" | "star";
}

const COLORS = [
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#fbbf24", // gold
  "#f472b6", // light pink
  "#a78bfa", // lavender
];

const Confetti = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.5,
      size: Math.random() * 8 + 4,
      type: ["circle", "square", "star"][Math.floor(Math.random() * 3)] as "circle" | "square" | "star",
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: "-10vh",
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: "110vh",
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.type !== "star" ? piece.color : "transparent",
            borderRadius: piece.type === "circle" ? "50%" : "0",
          }}
        >
          {piece.type === "star" && (
            <span style={{ color: piece.color, fontSize: piece.size * 1.5 }}>✦</span>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default Confetti;
