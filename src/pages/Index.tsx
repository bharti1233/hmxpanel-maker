import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
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
import BackgroundMusic from "@/components/birthday/BackgroundMusic";
import HMXPanelBadge from "@/components/admin/HMXPanelBadge";
import AdminPanel from "@/components/admin/AdminPanel";
import { ChevronRight, ChevronLeft, Lock } from "lucide-react";

type PageId = "countdown" | "star" | "memories" | "quiz" | "cake" | "letter" | "final";

const Index = () => {
  const { state } = useAdmin();
  const { config, isAdminMode, isPreviewMode, isLoading } = state;

  const [currentStep, setCurrentStep] = useState(0);
  const [isBirthdayUnlocked, setIsBirthdayUnlocked] = useState(false);

  const BIRTHDAY_DATE = useMemo(() => new Date(config.birthdayDate), [config.birthdayDate]);

  // Build dynamic pages array based on visibility settings
  const pages = useMemo(() => {
    const basePages: PageId[] = ["countdown", "star"];
    if (config.showMemoryTimeline) basePages.push("memories");
    if (config.showQuiz && config.quizQuestions && config.quizQuestions.length > 0) basePages.push("quiz");
    basePages.push("cake", "letter");
    if (config.showFinalReveal) basePages.push("final");
    return basePages;
  }, [config.showMemoryTimeline, config.showFinalReveal, config.showQuiz, config.quizQuestions]);

  // Build dynamic steps for progress indicator
  const STEPS = useMemo(() => {
    const steps = [
      { label: "Countdown", icon: "⏰" },
      { label: "Star", icon: "⭐" },
    ];
    if (config.showMemoryTimeline) steps.push({ label: "Memories", icon: "💭" });
    if (config.showQuiz && config.quizQuestions && config.quizQuestions.length > 0) steps.push({ label: "Quiz", icon: "🎯" });
    steps.push({ label: "Cake", icon: "🎂" });
    steps.push({ label: "Letter", icon: "💌" });
    if (config.showFinalReveal) steps.push({ label: "Final", icon: "🎁" });
    return steps;
  }, [config.showMemoryTimeline, config.showFinalReveal, config.showQuiz, config.quizQuestions]);

  useEffect(() => {
    const checkBirthday = () => {
      const now = new Date();
      setIsBirthdayUnlocked(now >= BIRTHDAY_DATE);
    };
    
    checkBirthday();
    const interval = setInterval(checkBirthday, 1000);
    return () => clearInterval(interval);
  }, [BIRTHDAY_DATE]);

  // Reset step if it exceeds available pages
  useEffect(() => {
    if (currentStep >= pages.length) {
      setCurrentStep(pages.length - 1);
    }
  }, [pages.length, currentStep]);

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

  const formatBirthdayDate = () => {
    return BIRTHDAY_DATE.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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
                {config.countdownTitle}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                {config.countdownSubtitle}
              </p>
              <p className="text-birthday-cyan font-display text-lg mt-4">
                {formatBirthdayDate()}
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
                  src={config.profileImageUrl}
                  alt={`${config.recipientName}'s photo`}
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
                {config.starPageMessage}
              </p>

              {config.showVoiceMessage && <VoiceMessage audioUrl={config.voiceMessageUrl} />}
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
            <MemoryTimeline memories={config.memories} />
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
                How well do you know {config.recipientName}?
              </p>
            </div>

            <BirthdayQuiz 
              questions={config.quizQuestions} 
              recipientName={config.recipientName}
              onComplete={goToNext} 
            />
            
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
                {config.cakePageTitle}
              </h1>
              <p className="text-lg text-muted-foreground">
                {config.cakePageSubtitle}
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

            <BirthdayLetter 
              recipientName={config.recipientName} 
              senderName={config.senderName}
              letterTitle={config.letterTitle}
              paragraphs={config.letterParagraphs}
              signature={config.letterSignature}
            />
            
            {config.showWishVault && (
              <div className="max-w-3xl mx-auto mt-12">
                <WishVault />
              </div>
            )}

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
            <FinalReveal 
              recipientName={config.recipientName} 
              instagramLink={config.instagramLink}
              message={config.finalRevealMessage}
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-birthday-pink/30 border-t-birthday-pink"
          />
          <p className="text-muted-foreground">Loading magic...</p>
        </motion.div>
      </div>
    );
  }

  // Show admin panel when in admin mode
  if (isAdminMode) {
    return <AdminPanel />;
  }

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

      {/* Hidden admin badge - only show when not in preview */}
      {!isPreviewMode && <HMXPanelBadge />}

      {/* Background Music Toggle - show after birthday is unlocked */}
      {isBirthdayUnlocked && config.backgroundMusicUrl && (
        <BackgroundMusic audioUrl={config.backgroundMusicUrl} />
      )}
    </div>
  );
};

export default Index;
