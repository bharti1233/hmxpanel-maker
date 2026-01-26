import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface BirthdayQuizProps {
  onComplete?: () => void;
  questions?: Question[];
  recipientName?: string;
}

const defaultQuestions: Question[] = [
  {
    question: "What makes Dristi smile the most?",
    options: ["Kind words", "Good food", "Quality time", "All of the above! 💖"],
    correct: 3,
  },
  {
    question: "What's the best way to celebrate her?",
    options: ["Throw a surprise party", "Write heartfelt wishes", "Give her cake", "Just be there for her"],
    correct: 3,
  },
  {
    question: "What makes today special?",
    options: ["It's just another day", "It's DRISTI'S BIRTHDAY! 🎂", "Nothing much", "I forgot..."],
    correct: 1,
  },
];

const BirthdayQuiz = ({ 
  onComplete, 
  questions = defaultQuestions,
  recipientName = "Dristi" 
}: BirthdayQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const getResultMessage = () => {
    if (score === questions.length) {
      return {
        emoji: "🏆",
        title: `You know ${recipientName} too well!`,
        message: "You're truly an amazing friend! 💖",
      };
    } else if (score >= questions.length / 2) {
      return {
        emoji: "🌟",
        title: "Great job!",
        message: `You really care about ${recipientName}! 💕`,
      };
    } else {
      return {
        emoji: "💝",
        title: "Still love you anyway!",
        message: "What matters is that you're here celebrating! 🎉",
      };
    }
  };

  if (showResult) {
    const result = getResultMessage();
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        {score === questions.length && <Confetti />}
        
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="text-7xl block mb-6"
        >
          {result.emoji}
        </motion.span>
        
        <h3 className="text-3xl font-display font-bold text-gradient mb-4">
          {result.title}
        </h3>
        
        <p className="text-xl text-muted-foreground mb-2">
          You scored {score}/{questions.length}
        </p>
        
        <p className="text-birthday-pink text-lg mb-8">{result.message}</p>
        
        <Button variant="birthday" size="lg" onClick={onComplete}>
          Continue ✨
        </Button>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                index < currentQuestion
                  ? "bg-birthday-pink"
                  : index === currentQuestion
                  ? "bg-birthday-purple"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="glass-card rounded-3xl p-8"
          >
            <span className="text-sm uppercase tracking-widest text-birthday-cyan mb-4 block">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            
            <h3 className="text-2xl font-display font-semibold mb-8">
              {question.question}
            </h3>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                  whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                  onClick={() => handleAnswer(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedAnswer === null
                      ? "bg-muted hover:bg-muted/80 hover:border-birthday-pink/50"
                      : selectedAnswer === index
                      ? index === question.correct
                        ? "bg-green-500/20 border-green-500"
                        : "bg-red-500/20 border-red-500"
                      : index === question.correct && isAnswered
                      ? "bg-green-500/20 border-green-500"
                      : "bg-muted opacity-50"
                  } border-2 border-transparent`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default BirthdayQuiz;
