import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { label: string; icon: string }[];
}

const ProgressIndicator = ({ currentStep, totalSteps, steps }: ProgressIndicatorProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                opacity: index <= currentStep ? 1 : 0.4,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300",
                index < currentStep && "bg-birthday-pink/30 text-birthday-pink",
                index === currentStep && "bg-birthday-pink text-white shadow-glow",
                index > currentStep && "bg-muted text-muted-foreground"
              )}
            >
              {step.icon}
            </motion.div>
            {index < totalSteps - 1 && (
              <div
                className={cn(
                  "w-6 h-0.5 mx-1 transition-all duration-500",
                  index < currentStep ? "bg-birthday-pink" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
