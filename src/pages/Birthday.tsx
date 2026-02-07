import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecipient } from "@/contexts/RecipientContext";
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
import { ChevronRight, ChevronLeft, Lock, KeyRound, Loader2 } from "lucide-react";

type PageId = "countdown" | "star" | "memories" | "quiz" | "cake" | "letter" | "final";

const Birthday = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { state, verifyPassword } = useRecipient();
  const { isAuthenticated, isLoading, error, config } = state;

  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isBirthdayUnlocked, setIsBirthdayUnlocked] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);

  // Check for cached session on mount
  useEffect(() => {
    if (slug && !isAuthenticated) {
      const cached = sessionStorage.getItem(`recipient_${slug}`);
      if (cached) {
        // Re-verify if cached (user might try to tamper)
        // For now, we require re-entry of password for security
      }
    }
  }, [slug, isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !password.trim()) return;
    await verifyPassword(slug, password.trim());
  };

  const BIRTHDAY_DATE = useMemo(() => {
    if (!config) return new Date();
    return new Date(config.birthday_date);
  }, [config?.birthday_date]);

  // Build dynamic pages array based on visibility settings
  const pages = useMemo(() => {
    if (!config) return ["countdown"] as PageId[];
    const basePages: PageId[] = ["countdown", "star"];
    if (config.show_memory_timeline) basePages.push("memories");
    if (config.show_quiz && config.quiz_questions && config.quiz_questions.length > 0) basePages.push("quiz");
    basePages.push("cake", "letter");
    if (config.show_final_reveal) basePages.push("final");
    return basePages;
  }, [config]);

  // Build dynamic steps for progress indicator
  const STEPS = useMemo(() => {
    if (!config) return [{ label: "Countdown", icon: "⏰" }];
    const steps = [
      { label: "Countdown", icon: "⏰" },
      { label: "Star", icon: "⭐" },
    ];
    if (config.show_memory_timeline) steps.push({ label: "Memories", icon: "💭" });
    if (config.show_quiz && config.quiz_questions && config.quiz_questions.length > 0) steps.push({ label: "Quiz", icon: "🎯" });
    steps.push({ label: "Cake", icon: "🎂" });
    steps.push({ label: "Letter", icon: "💌" });
    if (config.show_final_reveal) steps.push({ label: "Final", icon: "🎁" });
    return steps;
  }, [config]);

  useEffect(() => {
    if (!config) return;
    const checkBirthday = () => {
      const now = new Date();
      setIsBirthdayUnlocked(now >= BIRTHDAY_DATE);
    };
    
    checkBirthday();
    const interval = setInterval(checkBirthday, 1000);
    return () => clearInterval(interval);
  }, [BIRTHDAY_DATE, config]);

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

  // Password Entry Screen
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <ParticleBackground />
        
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center">
              <KeyRound className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-gradient mb-4">
              🎂 Birthday Portal 🎂
            </h1>
            
            <p className="text-muted-foreground mb-6">
              Enter your secret password to unlock your special birthday experience!
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="text-center text-lg"
                disabled={isLoading}
              />

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-destructive text-sm"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                variant="birthday"
                size="lg"
                className="w-full gap-2"
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    Unlock Experience
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
                {config.countdown_title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
                {config.countdown_subtitle}
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
                {profileImageError || !config.profile_image_url ? (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-birthday-pink to-birthday-purple">
                    <span className="text-6xl">👑</span>
                  </div>
                ) : (
                  <img
                    src={config.profile_image_url}
                    alt={`${config.recipient_name}'s photo`}
                    className="w-full h-full object-cover"
                    onError={() => setProfileImageError(true)}
                  />
                )}
              </motion.div>

              <p className="text-muted-foreground mb-6">
                {config.star_page_message}
              </p>

              {config.show_voice_message && config.voice_message_url && (
                <VoiceMessage audioUrl={config.voice_message_url} />
              )}
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
                How well do you know {config.recipient_name}?
              </p>
            </div>

            <BirthdayQuiz 
              questions={config.quiz_questions} 
              recipientName={config.recipient_name}
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
                {config.cake_page_title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {config.cake_page_subtitle}
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
              recipientName={config.recipient_name} 
              senderName={config.sender_name}
              letterTitle={config.letter_title}
              paragraphs={config.letter_paragraphs}
              signature={config.letter_signature}
            />
            
            {config.show_wish_vault && (
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
              recipientName={config.recipient_name} 
              instagramLink={config.instagram_link}
              message={config.final_reveal_message}
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

      {/* Background Music Toggle - show after birthday is unlocked */}
      {isBirthdayUnlocked && config.background_music_url && (
        <BackgroundMusic audioUrl={config.background_music_url} />
      )}
    </div>
  );
};

export default Birthday;
