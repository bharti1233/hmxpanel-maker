import { useState } from "react";
import { motion } from "framer-motion";
import { Play, ImageOff } from "lucide-react";
import type { MediaType } from "@/contexts/AdminContext";

interface Memory {
  id: string;
  title: string;
  description: string;
  emoji: string;
  mediaType: MediaType;
  mediaUrl: string;
}

interface MemoryTimelineProps {
  memories?: Memory[];
}

const defaultMemories: Memory[] = [
  { id: "m1", title: "The Day We First Met", description: "That moment when our paths crossed and a beautiful friendship began 💫", emoji: "👋", mediaType: "none", mediaUrl: "" },
  { id: "m2", title: "Our Endless Conversations", description: "Hours of talking, laughing, and sharing our deepest thoughts 💬", emoji: "💭", mediaType: "none", mediaUrl: "" },
  { id: "m3", title: "The Funniest Memory", description: "Remember when we couldn't stop laughing? Those are the best moments! 😂", emoji: "🤣", mediaType: "none", mediaUrl: "" },
  { id: "m4", title: "Supporting Each Other", description: "Through thick and thin, we've always had each other's backs 🤝", emoji: "💪", mediaType: "none", mediaUrl: "" },
  { id: "m5", title: "Adventures Together", description: "Every moment with you turns into an unforgettable adventure ✨", emoji: "🌟", mediaType: "none", mediaUrl: "" },
  { id: "m6", title: "Today & Forever", description: "Celebrating you today and cherishing our friendship always 💖", emoji: "🎂", mediaType: "none", mediaUrl: "" },
];

const MediaDisplay = ({ memory }: { memory: Memory }) => {
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (memory.mediaType === "none" || !memory.mediaUrl || hasError) {
    return null;
  }

  if (memory.mediaType === "image") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mt-3 rounded-xl overflow-hidden aspect-square bg-muted/30"
      >
        <img
          src={memory.mediaUrl}
          alt={memory.title}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </motion.div>
    );
  }

  if (memory.mediaType === "video") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mt-3 rounded-xl overflow-hidden aspect-square bg-muted/30"
      >
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:bg-white transition-colors"
            >
              <Play className="w-8 h-8 text-birthday-pink fill-birthday-pink ml-1" />
            </motion.div>
          </button>
        ) : (
          <video
            src={memory.mediaUrl}
            controls
            className="w-full h-full object-cover"
            onError={() => {
              setHasError(true);
              setIsPlaying(false);
            }}
          />
        )}
      </motion.div>
    );
  }

  return null;
};

const MemoryTimeline = ({ memories = defaultMemories }: MemoryTimelineProps) => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-display font-bold text-center text-gradient mb-12"
      >
        ✨ Our Journey Together ✨
      </motion.h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-birthday-pink via-birthday-purple to-birthday-cyan" />

        {memories.map((memory, index) => (
          <motion.div
            key={memory.id || index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative flex items-start mb-8 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline dot */}
            <motion.div
              whileHover={{ scale: 1.3 }}
              className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-birthday-pink z-10 mt-6"
              style={{ boxShadow: "0 0 20px hsl(320, 80%, 65%)" }}
            />

            {/* Content card */}
            <div
              className={`ml-16 md:ml-0 md:w-[45%] ${
                index % 2 === 0 ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card rounded-2xl p-5 cursor-default"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{memory.emoji}</span>
                  <h3 className="font-display font-semibold text-lg text-birthday-pink">
                    {memory.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {memory.description}
                </p>
                <MediaDisplay memory={memory} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemoryTimeline;
