import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { QuizQuestion } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Check,
  X,
} from "lucide-react";

interface QuizEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

interface QuizQuestionWithId extends QuizQuestion {
  id: string;
}

const ensureId = (q: QuizQuestion, index: number): QuizQuestionWithId => ({
  ...q,
  id: (q as any).id || `q${index}-${Date.now()}`,
});

const QuestionCard = ({
  question,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  question: QuizQuestionWithId;
  index: number;
  onUpdate: (field: keyof QuizQuestion, value: any) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleOptionChange = (optionIndex: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onUpdate("options", newOptions);
  };

  const addOption = () => {
    if (question.options.length >= 6) return;
    onUpdate("options", [...question.options, `Option ${question.options.length + 1}`]);
  };

  const removeOption = (optionIndex: number) => {
    if (question.options.length <= 2) return;
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onUpdate("options", newOptions);
    // Adjust correct answer if needed
    if (question.correct >= newOptions.length) {
      onUpdate("correct", newOptions.length - 1);
    } else if (question.correct > optionIndex) {
      onUpdate("correct", question.correct - 1);
    }
  };

  return (
    <Reorder.Item
      value={question}
      id={question.id}
      className="touch-manipulation"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative mb-4"
      >
        <div
          className="relative bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl overflow-hidden border border-border/50"
          style={{
            boxShadow: `
              0 4px 6px -1px hsl(var(--birthday-pink) / 0.1),
              0 10px 20px -5px hsl(var(--birthday-purple) / 0.15)
            `,
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border/30">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>

            <Input
              value={question.question}
              onChange={(e) => onUpdate("question", e.target.value)}
              className="flex-1 font-medium bg-transparent border-none focus-visible:ring-1 focus-visible:ring-birthday-pink/50"
              placeholder="Enter your question..."
            />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveUp}
                disabled={isFirst}
                className="h-8 w-8"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveDown}
                disabled={isLast}
                className="h-8 w-8"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Content - Options */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-3 h-3" />
                    Options (tap radio to set correct answer)
                  </Label>

                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <motion.div
                        key={optIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: optIndex * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                          question.correct === optIndex
                            ? "bg-green-500/10 border border-green-500/30"
                            : "bg-muted/30 border border-transparent"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onUpdate("correct", optIndex)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all touch-manipulation ${
                            question.correct === optIndex
                              ? "border-green-500 bg-green-500 text-white"
                              : "border-muted-foreground/50 hover:border-birthday-pink"
                          }`}
                        >
                          {question.correct === optIndex && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>

                        <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {String.fromCharCode(65 + optIndex)}
                        </span>

                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                          className="flex-1 bg-transparent border-none focus-visible:ring-1 focus-visible:ring-birthday-pink/50"
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        />

                        {question.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(optIndex)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {question.options.length < 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addOption}
                      className="w-full gap-2 border border-dashed border-border hover:border-birthday-pink/50 mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Option
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Preview */}
          {!isExpanded && (
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {question.options.map((opt, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2 py-1 rounded-full ${
                      question.correct === i
                        ? "bg-green-500/20 text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}: {opt.slice(0, 15)}
                    {opt.length > 15 ? "..." : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Reorder.Item>
  );
};

const QuizEditor = ({ questions, onChange }: QuizEditorProps) => {
  // Ensure all questions have IDs
  const questionsWithIds: QuizQuestionWithId[] = questions.map((q, i) => ensureId(q, i));

  const handleUpdate = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    onChange(newQuestions);
  };

  const handleRemove = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newQuestion: QuizQuestion = {
      question: "New Question?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
    };
    onChange([...questions, newQuestion]);
  };

  const handleReorder = (newOrder: QuizQuestionWithId[]) => {
    // Strip the id field when saving back
    const cleanQuestions: QuizQuestion[] = newOrder.map(({ id, ...rest }) => rest);
    onChange(cleanQuestions);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [
      newQuestions[newIndex],
      newQuestions[index],
    ];
    onChange(newQuestions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-birthday-cyan" />
            Quiz Questions
          </h3>
          <p className="text-sm text-muted-foreground">
            {questions.length} {questions.length === 1 ? "question" : "questions"}
          </p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="mb-4">No quiz questions yet</p>
          <Button variant="birthday" onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add First Question
          </Button>
        </div>
      ) : (
        <>
          <Reorder.Group
            axis="y"
            values={questionsWithIds}
            onReorder={handleReorder}
            className="space-y-0"
          >
            <AnimatePresence mode="popLayout">
              {questionsWithIds.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(field, value) => handleUpdate(index, field, value)}
                  onRemove={() => handleRemove(index)}
                  onMoveUp={() => moveItem(index, "up")}
                  onMoveDown={() => moveItem(index, "down")}
                  isFirst={index === 0}
                  isLast={index === questions.length - 1}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              onClick={handleAdd}
              variant="outline"
              className="w-full gap-2 h-14 rounded-2xl border-dashed border-2 hover:border-birthday-cyan hover:bg-birthday-cyan/5 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Question
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default QuizEditor;
