import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const COLORS = [
  "hsl(320, 80%, 65%)", // pink
  "hsl(260, 60%, 50%)", // purple
  "hsl(185, 100%, 55%)", // cyan
  "hsl(42, 100%, 60%)", // gold
  "hsl(280, 60%, 70%)", // lavender
];

const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const createParticle = useCallback(() => {
    const newParticle: Particle = {
      id: idCounter,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 6 + 4,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 4,
    };
    setIdCounter((prev) => prev + 1);
    return newParticle;
  }, [idCounter]);

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 15 }, () => createParticle());
    setParticles(initialParticles);

    // Add new particles periodically (throttled for performance)
    const interval = setInterval(() => {
      setParticles((prev) => {
        // Remove old particles and add new ones
        const filtered = prev.slice(-20); // Keep max 20 particles
        return [...filtered, createParticle()];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              y: "100vh", 
              x: `${particle.x}vw`,
              opacity: 0,
              scale: 0 
            }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              rotate: 360 
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: "50%",
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleBackground;
