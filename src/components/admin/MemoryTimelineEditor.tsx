import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { MemoryItem, MediaType } from "@/contexts/AdminContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Trash2,
  Plus,
  GripVertical,
  Image,
  Video,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";

interface MemoryTimelineEditorProps {
  memories: MemoryItem[];
  onChange: (memories: MemoryItem[]) => void;
  isInputFocused?: boolean;
  onInputFocusChange?: (focused: boolean) => void;
}

const MediaTypeButton = ({
  type,
  selected,
  onClick,
  icon: Icon,
  label,
}: {
  type: MediaType;
  selected: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
      ${
        selected
          ? "bg-gradient-to-r from-birthday-pink to-birthday-purple text-white shadow-lg"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      }
    `}
    style={{
      transform: selected ? "translateZ(10px)" : "translateZ(0)",
      boxShadow: selected
        ? "0 8px 25px -5px hsl(320, 80%, 65%, 0.4)"
        : undefined,
    }}
  >
    <Icon className="w-4 h-4" />
    {label}
  </motion.button>
);

const MemoryCard = ({
  memory,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onInputFocus,
  onInputBlur,
}: {
  memory: MemoryItem;
  index: number;
  onUpdate: (field: keyof MemoryItem, value: string | MediaType) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  onInputFocus: () => void;
  onInputBlur: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMediaPreview, setShowMediaPreview] = useState(true);

  return (
    <Reorder.Item
      value={memory}
      id={memory.id}
      className="touch-manipulation"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative mb-4"
      >
        {/* 3D Card Container */}
        <div
          className="relative bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl overflow-hidden border border-border/50"
          style={{
            boxShadow: `
              0 4px 6px -1px hsl(var(--birthday-pink) / 0.1),
              0 10px 20px -5px hsl(var(--birthday-purple) / 0.15),
              0 20px 40px -10px hsl(var(--background) / 0.3),
              inset 0 1px 0 hsl(var(--foreground) / 0.05)
            `,
          }}
        >
          {/* Drag Handle & Header */}
          <div className="flex items-center gap-3 p-4 border-b border-border/30">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </motion.div>

            <Input
              value={memory.emoji}
              onChange={(e) => onUpdate("emoji", e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              className="w-14 text-center text-xl bg-transparent border-none focus-visible:ring-1 focus-visible:ring-birthday-pink/50"
              placeholder="✨"
            />

            <Input
              value={memory.title}
              onChange={(e) => onUpdate("title", e.target.value)}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              className="flex-1 font-medium bg-transparent border-none focus-visible:ring-1 focus-visible:ring-birthday-pink/50"
              placeholder="Memory title..."
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

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                      Description
                    </Label>
                    <Textarea
                      value={memory.description}
                      onChange={(e) => onUpdate("description", e.target.value)}
                      onFocus={onInputFocus}
                      onBlur={onInputBlur}
                      className="min-h-[80px] bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-birthday-pink/50 resize-none"
                      placeholder="Share the memory..."
                    />
                  </div>

                  {/* Media Type Toggle */}
                  <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                      Media Type
                    </Label>
                    <div className="flex gap-2">
                      <MediaTypeButton
                        type="none"
                        selected={memory.mediaType === "none"}
                        onClick={() => onUpdate("mediaType", "none")}
                        icon={X}
                        label="None"
                      />
                      <MediaTypeButton
                        type="image"
                        selected={memory.mediaType === "image"}
                        onClick={() => onUpdate("mediaType", "image")}
                        icon={Image}
                        label="Image"
                      />
                      <MediaTypeButton
                        type="video"
                        selected={memory.mediaType === "video"}
                        onClick={() => onUpdate("mediaType", "video")}
                        icon={Video}
                        label="Video"
                      />
                    </div>
                  </div>

                  {/* Media URL Input */}
                  <AnimatePresence mode="wait">
                    {memory.mediaType !== "none" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                            {memory.mediaType === "image"
                              ? "Image URL"
                              : "Video URL"}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMediaPreview(!showMediaPreview)}
                            className="h-6 text-xs gap-1"
                          >
                            {showMediaPreview ? (
                              <>
                                <EyeOff className="w-3 h-3" /> Hide Preview
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" /> Show Preview
                              </>
                            )}
                          </Button>
                        </div>

                        <Input
                          value={memory.mediaUrl}
                          onChange={(e) => onUpdate("mediaUrl", e.target.value)}
                          onFocus={onInputFocus}
                          onBlur={onInputBlur}
                          className="bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-birthday-pink/50"
                          placeholder={
                            memory.mediaType === "image"
                              ? "https://example.com/image.jpg"
                              : "https://example.com/video.mp4"
                          }
                        />

                        {/* Media Preview */}
                        {showMediaPreview && memory.mediaUrl && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative rounded-xl overflow-hidden bg-muted/30 aspect-video"
                          >
                            {memory.mediaType === "image" ? (
                              <img
                                src={memory.mediaUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              <video
                                src={memory.mediaUrl}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapsed Preview */}
          {!isExpanded && (
            <div className="px-4 pb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {memory.description}
              </p>
              {memory.mediaType !== "none" && memory.mediaUrl && (
                <div className="flex items-center gap-2 mt-2 text-xs text-birthday-pink">
                  {memory.mediaType === "image" ? (
                    <Image className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  <span className="truncate max-w-[200px]">{memory.mediaUrl}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Reorder.Item>
  );
};

const MemoryTimelineEditor = ({
  memories,
  onChange,
}: MemoryTimelineEditorProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputFocus = useCallback(() => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
    setIsInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    // Small delay to prevent flicker when moving between inputs
    focusTimeoutRef.current = setTimeout(() => {
      setIsInputFocused(false);
    }, 100);
  }, []);

  const handleUpdate = (
    index: number,
    field: keyof MemoryItem,
    value: string | MediaType
  ) => {
    const newMemories = [...memories];
    newMemories[index] = { ...newMemories[index], [field]: value };
    onChange(newMemories);
  };

  const handleRemove = (index: number) => {
    onChange(memories.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    const newMemory: MemoryItem = {
      id: `m${Date.now()}`,
      title: "New Memory",
      description: "Share your special moment...",
      emoji: "✨",
      mediaType: "none",
      mediaUrl: "",
    };
    onChange([...memories, newMemory]);
  };

  const handleReorder = (newOrder: MemoryItem[]) => {
    // Don't reorder while typing
    if (isInputFocused) return;
    onChange(newOrder);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= memories.length) return;

    const newMemories = [...memories];
    [newMemories[index], newMemories[newIndex]] = [
      newMemories[newIndex],
      newMemories[index],
    ];
    onChange(newMemories);
  };

  return (
    <div
      className="space-y-4"
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg">Memory Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {memories.length} {memories.length === 1 ? "memory" : "memories"}
          </p>
        </div>
      </div>

      <Reorder.Group
        axis="y"
        values={memories}
        onReorder={handleReorder}
        className="space-y-0"
      >
        <AnimatePresence mode="popLayout">
          {memories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              index={index}
              onUpdate={(field, value) => handleUpdate(index, field, value)}
              onRemove={() => handleRemove(index)}
              onMoveUp={() => moveItem(index, "up")}
              onMoveDown={() => moveItem(index, "down")}
              isFirst={index === 0}
              isLast={index === memories.length - 1}
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          onClick={handleAdd}
          variant="outline"
          className="w-full gap-2 h-14 rounded-2xl border-dashed border-2 hover:border-birthday-pink hover:bg-birthday-pink/5 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Memory
        </Button>
      </motion.div>
    </div>
  );
};

export default MemoryTimelineEditor;
