import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import ParticleBackground from "@/components/birthday/ParticleBackground";
import ProgressIndicator from "@/components/birthday/ProgressIndicator";
import CountdownTimer from "@/components/birthday/CountdownTimer";
import Cake3D from "@/components/birthday/Cake3D";
import MemoryTimeline from "@/components/birthday/MemoryTimeline";
import BirthdayQuiz from "@/components/birthday/BirthdayQuiz";
import VoiceMessage from "@/components/birthday/VoiceMessage";
import WishVault from "@/components/birthday/WishVault";
import BirthdayLetter from "@/components/birthday/BirthdayLetter";
import FinalReveal from "@/components/birthday/FinalReveal";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";

// Configuration
const BIRTHDAY_DATE = new Date("2025-08-29T00:00:00");
const RECIPIENT_NAME = "Dristi";
const INSTAGRAM_LINK = "https://www.instagram.com/reel/DMPCXX_I8pO/?igsh=MWVzeXZhd3YzdnByNg==";
const BIRTHDAY_IMAGE = "https://i.supaimg.com/3c6ca851-1689-4e6a-a7aa-6c30931afd1a.jpg";

const STEPS = [
  { label: "Countdown", icon: "⏰" },
  { label: "Star", icon: "⭐" },
  { label: "Memories", icon: "💭" },
  { label: "Quiz", icon: "🎯" },
  { label: "Cake", icon: "🎂" },
  { label: "Letter", icon: "💌" },
  { label: "Final", icon: "🎁" },
];

type PageId = "countdown" | "star" | "memories" | "quiz" | "cake" | "letter" | "final";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isBirthdayUnlocked, setIsBirthdayUnlocked] = useState(false);

  useEffect(() => {
    // Check if birthday has arrived
    const checkBirthday = () => {
      const now = new Date();
      setIsBirthdayUnlocked(now >= BIRTHDAY_DATE);
    };
    
    checkBirthday();
    const interval = setInterval(checkBirthday, 1000);
    return () => clearInterval(interval);
  }, []);

  const pages: PageId[] = ["countdown", "star", "memories", "quiz", "cake", "letter", "final"];

  const goToNext = () => {
    if (currentStep < pages.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedFromCountdown = isBirthdayUnlocked;

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -30 },
    };

    switch (pages[currentStep]) {
      case "countdown":
        return (
          <motion.div
            key="countdown"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4">
                🎉 Birthday Countdown 🎉
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                ✨ A Queen's special day is on the way… Let's countdown to the magical moment! ✨
              </p>
              <p className="text-birthday-cyan font-display text-lg mt-4">
                August 29, 2025
              </p>
            </motion.div>

            <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-3xl">
              <CountdownTimer 
                targetDate={BIRTHDAY_DATE} 
                onComplete={() => setIsBirthdayUnlocked(true)} 
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-muted-foreground mb-6">
                  {isBirthdayUnlocked 
                    ? "🎉 The special day is here! Let's celebrate!" 
                    : "🎈 The anticipation is building..."}
                </p>
                
                <Button
                  onClick={goToNext}
                  disabled={!canProceedFromCountdown}
                  variant={canProceedFromCountdown ? "birthday" : "outline"}
                  size="lg"
                  className="gap-2"
                >
                  {canProceedFromCountdown ? (
                    <>
                      ⭐ Meet the Birthday Star
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Wait for Birthday!
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        );

      case "star":
        return (
          <motion.div
            key="star"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                ⭐ Birthday Star ⭐
              </h1>
              <p className="text-lg text-muted-foreground">
                Celebrating the amazing person you are!
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 max-w-lg text-center">
              <h2 className="text-2xl font-display text-birthday-cyan mb-6">
                🌟 A Queen Deserves Her Day to Sparkle! 🌟
              </h2>
              
              <motion.div
                animate={{ 
                  boxShadow: [
                    "0 0 30px hsl(320, 80%, 65%, 0.3)",
                    "0 0 50px hsl(280, 60%, 50%, 0.5)",
                    "0 0 30px hsl(320, 80%, 65%, 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-birthday-pink/30"
              >
                <img
                  src={BIRTHDAY_IMAGE}
                  alt={`${RECIPIENT_NAME}'s photo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-6xl">👑</span>';
                      parent.className += " flex items-center justify-center bg-gradient-to-br from-birthday-pink to-birthday-purple";
                    }
                  }}
                />
              </motion.div>

              <p className="text-muted-foreground mb-6">
                🌸 Happy Birthday, beautiful soul! 💕 Today the universe shines brighter because it's YOUR day. 
                You're not just the star, you're the whole sky filled with love, laughter, and light! 🌸
              </p>

              <VoiceMessage />
            </div>

            <NavigationButtons />
          </motion.div>
        );

      case "memories":
        return (
          <motion.div
            key="memories"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-20 px-6"
          >
            <MemoryTimeline />
            <NavigationButtons />
          </motion.div>
        );

      case "quiz":
        return (
          <motion.div
            key="quiz"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                🎯 Birthday Quiz 🎯
              </h1>
              <p className="text-lg text-muted-foreground">
                How well do you know {RECIPIENT_NAME}?
              </p>
            </div>

            <BirthdayQuiz onComplete={goToNext} />
            
            <div className="mt-8">
              <Button variant="ghost" onClick={goToPrev} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
            </div>
          </motion.div>
        );

      case "cake":
        return (
          <motion.div
            key="cake"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                🎂 Cake Cutting 🎂
              </h1>
              <p className="text-lg text-muted-foreground">
                Make a wish and celebrate!
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl font-display text-birthday-pink text-center mb-8">
                🎂 Make a Wish! 🎂
              </h2>
              <Cake3D onComplete={goToNext} />
            </div>

            <div className="mt-8">
              <Button variant="ghost" onClick={goToPrev} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
            </div>
          </motion.div>
        );

      case "letter":
        return (
          <motion.div
            key="letter"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen py-20 px-6"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                💌 Birthday Letter 💌
              </h1>
              <p className="text-lg text-muted-foreground">
                A letter filled with love, just for you.
              </p>
            </div>

            <BirthdayLetter recipientName={RECIPIENT_NAME} senderName="HMXPANEL" />
            
            <div className="max-w-3xl mx-auto mt-12">
              <WishVault />
            </div>

            <NavigationButtons />
          </motion.div>
        );

      case "final":
        return (
          <motion.div
            key="final"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <FinalReveal recipientName={RECIPIENT_NAME} instagramLink={INSTAGRAM_LINK} />
            
            <div className="mt-8">
              <Button variant="ghost" onClick={goToPrev} className="gap-2">
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const NavigationButtons = () => (
    <div className="flex items-center justify-center gap-4 mt-12">
      <Button
        variant="ghost"
        onClick={goToPrev}
        disabled={currentStep === 0}
        className="gap-2"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </Button>
      <Button
        variant="birthday"
        onClick={goToNext}
        disabled={currentStep === pages.length - 1}
        className="gap-2"
      >
        Next
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      
      {/* Progress indicator - only show after countdown is unlocked */}
      {isBirthdayUnlocked && (
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
        />
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </div>
  );
};

export default Index;
