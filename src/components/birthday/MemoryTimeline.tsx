import { motion } from "framer-motion";

interface Memory {
  title: string;
  description: string;
  emoji: string;
  imageUrl?: string;
}

interface MemoryTimelineProps {
  memories?: Memory[];
}

const defaultMemories: Memory[] = [
  { title: "The Day We First Met", description: "That moment when our paths crossed and a beautiful friendship began 💫", emoji: "👋" },
  { title: "Our Endless Conversations", description: "Hours of talking, laughing, and sharing our deepest thoughts 💬", emoji: "💭" },
  { title: "The Funniest Memory", description: "Remember when we couldn't stop laughing? Those are the best moments! 😂", emoji: "🤣" },
  { title: "Supporting Each Other", description: "Through thick and thin, we've always had each other's backs 🤝", emoji: "💪" },
  { title: "Adventures Together", description: "Every moment with you turns into an unforgettable adventure ✨", emoji: "🌟" },
  { title: "Today & Forever", description: "Celebrating you today and cherishing our friendship always 💖", emoji: "🎂" },
];

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
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative flex items-center mb-8 ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Timeline dot */}
            <motion.div
              whileHover={{ scale: 1.3 }}
              className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-birthday-pink z-10"
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
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MemoryTimeline;
