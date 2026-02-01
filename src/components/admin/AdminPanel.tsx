import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, MemoryItem, LetterParagraph, QuizQuestion } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import MemoryTimelineEditor from "./MemoryTimelineEditor";
import {
  X, Save, Eye, RotateCcw, User, Calendar, Image, MessageSquare,
  Layout, Cake, Heart, Trash2, Plus, GripVertical, Music, Link, Cloud, CloudOff
} from "lucide-react";

const AdminPanel = () => {
  const { state, setAdminMode, setPreviewMode, updateConfig, resetConfig, clearWishVault } = useAdmin();
  const { config, isSyncing } = state;
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    updateConfig({ [key]: value });
    setHasChanges(true);
  };

  const handleMemoryChange = (index: number, field: keyof MemoryItem, value: string) => {
    const newMemories = [...config.memories];
    newMemories[index] = { ...newMemories[index], [field]: value };
    handleChange("memories", newMemories);
  };

  const addMemory = () => {
    const newMemory: MemoryItem = {
      id: `m${Date.now()}`,
      title: "New Memory",
      description: "Description...",
      emoji: "✨",
      mediaType: "none",
      mediaUrl: "",
    };
    handleChange("memories", [...config.memories, newMemory]);
  };

  const removeMemory = (index: number) => {
    handleChange("memories", config.memories.filter((_, i) => i !== index));
  };

  const handleLetterParagraphChange = (id: string, content: string) => {
    const newParagraphs = config.letterParagraphs.map(p =>
      p.id === id ? { ...p, content } : p
    );
    handleChange("letterParagraphs", newParagraphs);
  };

  const addLetterParagraph = () => {
    const newParagraph: LetterParagraph = {
      id: Date.now().toString(),
      content: "New paragraph...",
    };
    handleChange("letterParagraphs", [...config.letterParagraphs, newParagraph]);
  };

  const removeLetterParagraph = (id: string) => {
    handleChange("letterParagraphs", config.letterParagraphs.filter(p => p.id !== id));
  };

  const handleQuizChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...config.quizQuestions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    handleChange("quizQuestions", newQuestions);
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handleClose = () => {
    setAdminMode(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center">
            <span className="text-lg">🔧</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">Admin Panel</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isSyncing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Cloud className="w-3 h-3 text-birthday-cyan" />
                  </motion.div>
                  <span className="text-birthday-cyan">Syncing...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">Real-time sync active</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreview} className="gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 pb-24 max-w-4xl mx-auto">
          <Tabs defaultValue="core" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="core" className="gap-1 text-xs">
                <User className="w-3 h-3" />
                Core
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1 text-xs">
                <MessageSquare className="w-3 h-3" />
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="gap-1 text-xs">
                <Image className="w-3 h-3" />
                Media
              </TabsTrigger>
              <TabsTrigger value="sections" className="gap-1 text-xs">
                <Layout className="w-3 h-3" />
                Sections
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-1 text-xs">
                <Cake className="w-3 h-3" />
                Advanced
              </TabsTrigger>
            </TabsList>

            {/* Core Details */}
            <TabsContent value="core" className="space-y-6">
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-birthday-pink" />
                  Birthday Details
                </h3>

                <div className="grid gap-4">
                  <div>
                    <Label>Recipient Name</Label>
                    <Input
                      value={config.recipientName}
                      onChange={(e) => handleChange("recipientName", e.target.value)}
                      placeholder="Enter name..."
                    />
                  </div>

                  <div>
                    <Label>Birthday Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={config.birthdayDate.slice(0, 16)}
                      onChange={(e) => handleChange("birthdayDate", e.target.value + ":00")}
                    />
                  </div>

                  <div>
                    <Label>Timezone</Label>
                    <Input
                      value={config.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      placeholder="e.g., Asia/Kolkata"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Link className="w-4 h-4 text-birthday-cyan" />
                  Links
                </h3>

                <div>
                  <Label>Instagram/Gift Link</Label>
                  <Input
                    value={config.instagramLink}
                    onChange={(e) => handleChange("instagramLink", e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* Page Content */}
            <TabsContent value="content" className="space-y-6">
              {/* Countdown */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Countdown Page</h3>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={config.countdownTitle}
                    onChange={(e) => handleChange("countdownTitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Textarea
                    value={config.countdownSubtitle}
                    onChange={(e) => handleChange("countdownSubtitle", e.target.value)}
                  />
                </div>
              </div>

              {/* Star Page */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Star Page</h3>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={config.starPageMessage}
                    onChange={(e) => handleChange("starPageMessage", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Cake Page */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Cake Page</h3>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={config.cakePageTitle}
                    onChange={(e) => handleChange("cakePageTitle", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={config.cakePageSubtitle}
                    onChange={(e) => handleChange("cakePageSubtitle", e.target.value)}
                  />
                </div>
              </div>

              {/* Letter */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-birthday-pink" />
                  Birthday Letter
                </h3>
                <div>
                  <Label>Letter Title</Label>
                  <Input
                    value={config.letterTitle}
                    onChange={(e) => handleChange("letterTitle", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Paragraphs</Label>
                  <div className="space-y-3 mt-2">
                    {(config.letterParagraphs || []).map((paragraph, index) => (
                      <div key={paragraph.id} className="flex gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground mt-3 cursor-move" />
                        <Textarea
                          value={paragraph.content}
                          onChange={(e) => handleLetterParagraphChange(paragraph.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLetterParagraph(paragraph.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addLetterParagraph} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Paragraph
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Signature Text</Label>
                    <Input
                      value={config.letterSignature}
                      onChange={(e) => handleChange("letterSignature", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Sender Name</Label>
                    <Input
                      value={config.senderName}
                      onChange={(e) => handleChange("senderName", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Final Reveal */}
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Final Reveal</h3>
                <div>
                  <Label>Message</Label>
                  <Textarea
                    value={config.finalRevealMessage}
                    onChange={(e) => handleChange("finalRevealMessage", e.target.value)}
                  />
                </div>
              </div>

              {/* Memories */}
              <div className="glass-card rounded-2xl p-6">
                <MemoryTimelineEditor
                  memories={config.memories}
                  onChange={(newMemories) => handleChange("memories", newMemories)}
                />
              </div>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="space-y-6">
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Image className="w-4 h-4 text-birthday-pink" />
                  Images
                </h3>

                <div>
                  <Label>Profile Image URL</Label>
                  <Input
                    value={config.profileImageUrl}
                    onChange={(e) => handleChange("profileImageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                  {config.profileImageUrl && (
                    <div className="mt-2 w-20 h-20 rounded-full overflow-hidden border-2 border-birthday-pink/30">
                      <img src={config.profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Music className="w-4 h-4 text-birthday-cyan" />
                  Audio
                </h3>

                <div>
                  <Label>Voice Message URL (MP3)</Label>
                  <Input
                    value={config.voiceMessageUrl}
                    onChange={(e) => handleChange("voiceMessageUrl", e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Audio plays only after user interaction
                  </p>
                </div>

                <div>
                  <Label>Background Music URL (MP3)</Label>
                  <Input
                    value={config.backgroundMusicUrl}
                    onChange={(e) => handleChange("backgroundMusicUrl", e.target.value)}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Will not autoplay - user must enable
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Sections Visibility */}
            <TabsContent value="sections" className="space-y-6">
              <div className="glass-card rounded-2xl p-6 space-y-6">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Layout className="w-4 h-4 text-birthday-pink" />
                  Section Visibility
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Memory Timeline</p>
                      <p className="text-sm text-muted-foreground">Show memories page</p>
                    </div>
                    <Switch
                      checked={config.showMemoryTimeline}
                      onCheckedChange={(checked) => handleChange("showMemoryTimeline", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Voice Message</p>
                      <p className="text-sm text-muted-foreground">Show audio message button</p>
                    </div>
                    <Switch
                      checked={config.showVoiceMessage}
                      onCheckedChange={(checked) => handleChange("showVoiceMessage", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Wish Vault</p>
                      <p className="text-sm text-muted-foreground">Show wish writing feature</p>
                    </div>
                    <Switch
                      checked={config.showWishVault}
                      onCheckedChange={(checked) => handleChange("showWishVault", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">Final Reveal</p>
                      <p className="text-sm text-muted-foreground">Show final surprise page</p>
                    </div>
                    <Switch
                      checked={config.showFinalReveal}
                      onCheckedChange={(checked) => handleChange("showFinalReveal", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced" className="space-y-6">
              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold">Quiz Questions</h3>
                <div className="space-y-4">
                  {(config.quizQuestions || []).map((q, qIndex) => (
                    <div key={qIndex} className="p-4 bg-muted/50 rounded-xl space-y-3">
                      <div>
                        <Label>Question {qIndex + 1}</Label>
                        <Input
                          value={q.question}
                          onChange={(e) => handleQuizChange(qIndex, "question", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correct === oIndex}
                              onChange={() => handleQuizChange(qIndex, "correct", oIndex)}
                              className="accent-birthday-pink"
                            />
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[oIndex] = e.target.value;
                                handleQuizChange(qIndex, "options", newOptions);
                              }}
                              className="flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <h3 className="font-display font-semibold text-destructive">Danger Zone</h3>

                <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div>
                    <p className="font-medium">Clear Wish Vault</p>
                    <p className="text-sm text-muted-foreground">Remove all saved wishes</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={clearWishVault}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div>
                    <p className="font-medium">Reset All Settings</p>
                    <p className="text-sm text-muted-foreground">Restore default configuration</p>
                  </div>
                  <Button variant="destructive" size="sm" onClick={resetConfig}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default AdminPanel;
