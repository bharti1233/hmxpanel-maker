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
import MadeByBadge from "@/components/admin/MadeByBadge";
import AdminPanel from "@/components/admin/AdminPanel";
import { useAdmin } from "@/contexts/AdminContext";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";

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
  const { content, isUnlocked } = useAdmin();

  const birthdayDate = new Date(content.birthdayDate);

  useEffect(() => {
    // Check if birthday has arrived or if manually unlocked
    const checkBirthday = () => {
      const now = new Date();
      setIsBirthdayUnlocked(now >= birthdayDate || isUnlocked);
    };
    
    checkBirthday();
    const interval = setInterval(checkBirthday, 1000);
    return () => clearInterval(interval);
  }, [birthdayDate, isUnlocked]);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const renderPage = () => {
    const pageVariants = {
      initial: { opacity: 0, y: 30, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -30, scale: 0.98 },
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-gradient mb-4">
                {content.countdownTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                {content.countdownSubtitle}
              </p>
              <p className="text-birthday-cyan font-display text-lg mt-4">
                {formatDate(birthdayDate)}
              </p>
            </motion.div>

            <motion.div 
              className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-3xl"
              whileHover={{ boxShadow: "0 30px 60px -15px hsl(320, 80%, 65%, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
              <CountdownTimer 
                targetDate={birthdayDate} 
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
            </motion.div>
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                {content.starTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.starSubtitle}
              </p>
            </div>

            <motion.div 
              className="glass-card rounded-3xl p-8 max-w-lg text-center"
              whileHover={{ y: -5, boxShadow: "0 30px 60px -15px hsl(320, 80%, 65%, 0.3)" }}
              transition={{ duration: 0.3 }}
            >
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
                  src={content.birthdayImage}
                  alt={`${content.recipientName}'s photo`}
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
                {content.starMessage}
              </p>

              <VoiceMessage />
            </motion.div>

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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen py-20 px-6"
          >
            <MemoryTimeline 
              title={content.memoriesTitle}
              memories={content.memories}
            />
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                {content.quizTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.quizSubtitle}
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                {content.cakeTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.cakeSubtitle}
              </p>
            </div>

            <motion.div 
              className="glass-card rounded-3xl p-8 md:p-12"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-display text-birthday-pink text-center mb-8">
                {content.cakeMessage}
              </h2>
              <Cake3D onComplete={goToNext} />
            </motion.div>

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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen py-20 px-6"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
                {content.letterTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {content.letterSubtitle}
              </p>
            </div>

            <BirthdayLetter 
              recipientName={content.recipientName} 
              senderName={content.senderName}
              letterContent={content.letterContent}
            />
            
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
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <FinalReveal 
              recipientName={content.recipientName} 
              instagramLink={content.instagramLink}
              title={content.finalTitle}
              message={content.finalMessage}
            />
            
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

      {/* Made by hmxpanel badge - shows on all pages */}
      <MadeByBadge showUnlockOption={!isBirthdayUnlocked} />

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
};

export default Index;
