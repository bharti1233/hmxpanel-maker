import { motion } from "framer-motion";

interface BirthdayLetterProps {
  recipientName?: string;
  senderName?: string;
}

const BirthdayLetter = ({ 
  recipientName = "Dristi", 
  senderName = "Your Friend" 
}: BirthdayLetterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="perspective-1000"
    >
      <div 
        className="glass-card rounded-3xl p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, hsl(250 25% 14% / 0.8), hsl(260 30% 10% / 0.9))",
          boxShadow: "0 25px 50px -12px hsl(260 60% 5% / 0.8), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
        }}
      >
        {/* Decorative corner flourishes */}
        <div className="absolute top-4 left-4 text-2xl opacity-30">✧</div>
        <div className="absolute top-4 right-4 text-2xl opacity-30">✧</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-30">✧</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-30">✧</div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-birthday-pink/5 via-transparent to-birthday-purple/5 pointer-events-none" />

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-script text-center text-birthday-pink mb-8"
          >
            💌 To My Amazing Friend {recipientName} 💌
          </motion.h2>

          <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Happy Birthday, bestie! 🎉 Today is all about celebrating <strong className="text-birthday-pink">YOU</strong> – 
              the laughter you bring, the craziness we share, and the countless memories that make our friendship so special. 💕
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              From silly jokes to endless talks, you've been a constant source of happiness in my life. 🌸 
              Thank you for always being the kind, caring, and wonderful person that you are.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              On this special day, I wish you loads of happiness, unlimited cake, and all the success your heart desires. 🎂✨
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              May this year bring you new adventures, exciting opportunities, and moments that you'll never forget. 
              Because honestly, you deserve nothing less than the <em className="text-birthday-gold">absolute best</em>. 🌟
            </motion.p>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              Keep shining, keep smiling, and never forget that your friends will always be here to cheer you on. 💖
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-10 text-right"
          >
            <p className="font-script text-2xl text-birthday-lavender">
              With loads of love & friendship,
            </p>
            <p className="font-script text-3xl text-birthday-pink mt-2">
              {senderName} 💕
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default BirthdayLetter;
