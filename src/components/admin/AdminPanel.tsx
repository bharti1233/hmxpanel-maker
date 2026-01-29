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
import ImageCropper from "./ImageCropper";
import {
  X, Eye, RotateCcw, User, Calendar, Image, MessageSquare,
  Layout, Cake, Heart, Trash2, Plus, GripVertical, Music, Link, Cloud, Crop, Upload
} from "lucide-react";

const AdminPanel = () => {
  const { state, setAdminMode, setPreviewMode, updateConfig, resetConfig, clearWishVault } = useAdmin();
  const { config, isSyncing } = state;
  const [activeTab, setActiveTab] = useState("core");
  
  // Image cropping state
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  const handleChange = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    updateConfig({ [key]: value });
  };

  const handleLetterParagraphChange = (id: string, content: string) => {
    const newParagraphs = (config.letterParagraphs || []).map(p =>
      p.id === id ? { ...p, content } : p
    );
    handleChange("letterParagraphs", newParagraphs);
  };

  const addLetterParagraph = () => {
    const newParagraph: LetterParagraph = {
      id: Date.now().toString(),
      content: "New paragraph...",
    };
    handleChange("letterParagraphs", [...(config.letterParagraphs || []), newParagraph]);
  };

  const removeLetterParagraph = (id: string) => {
    handleChange("letterParagraphs", (config.letterParagraphs || []).filter(p => p.id !== id));
  };

  const handleQuizChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...(config.quizQuestions || [])];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    handleChange("quizQuestions", newQuestions);
  };

  const handlePreview = () => {
    setPreviewMode(true);
  };

  const handleClose = () => {
    setAdminMode(false);
  };

  // Image cropping handlers
  const handleOpenCropper = () => {
    if (config.profileImageUrl) {
      setTempImageUrl(config.profileImageUrl);
      setShowCropper(true);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    handleChange("profileImageUrl", croppedImageUrl);
    setShowCropper(false);
    setTempImageUrl("");
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setTempImageUrl("");
  };

  // Touch-friendly card component
  const SettingsCard = ({ 
    title, 
    icon: Icon, 
    children,
    iconColor = "text-birthday-pink"
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    iconColor?: string;
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 space-y-4 touch-manipulation"
    >
      <h3 className="font-display font-semibold flex items-center gap-2 text-base">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        {title}
      </h3>
      {children}
    </motion.div>
  );

  // Touch-friendly input wrapper
  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder,
    type = "text",
    multiline = false,
    hint
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    multiline?: boolean;
    hint?: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] text-base touch-manipulation"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 text-base touch-manipulation"
        />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  // Touch-friendly toggle component
  const ToggleRow = ({ 
    title, 
    description, 
    checked, 
    onChange 
  }: { 
    title: string; 
    description: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl cursor-pointer touch-manipulation active:bg-muted/70 transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div className="pr-4">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="touch-manipulation"
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm overflow-hidden"
    >
      {/* Image Cropper Modal */}
      <AnimatePresence>
        {showCropper && tempImageUrl && (
          <ImageCropper
            imageUrl={tempImageUrl}
            onCropComplete={handleCropComplete}
            onCancel={handleCancelCrop}
            aspectRatio={1}
            cropShape="round"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center"
          >
            <span className="text-lg">🔧</span>
          </motion.div>
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
                  <span className="text-green-500">Synced</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePreview} 
            className="gap-2 h-10 px-4 touch-manipulation"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="h-10 w-10 touch-manipulation"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-65px)]">
        <div className="p-4 pb-32 max-w-2xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Scrollable tab list for mobile */}
            <div className="overflow-x-auto -mx-4 px-4 mb-6">
              <TabsList className="inline-flex w-auto min-w-full sm:grid sm:grid-cols-5 gap-1">
                <TabsTrigger 
                  value="core" 
                  className="gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap touch-manipulation"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Core</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="content" 
                  className="gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap touch-manipulation"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Content</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap touch-manipulation"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Media</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="sections" 
                  className="gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap touch-manipulation"
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>Sections</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="advanced" 
                  className="gap-1.5 px-4 py-2.5 text-xs whitespace-nowrap touch-manipulation"
                >
                  <Cake className="w-3.5 h-3.5" />
                  <span>Advanced</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Core Details */}
            <TabsContent value="core" className="space-y-4 mt-0">
              <SettingsCard title="Birthday Details" icon={Calendar}>
                <InputField
                  label="Recipient Name"
                  value={config.recipientName}
                  onChange={(v) => handleChange("recipientName", v)}
                  placeholder="Enter name..."
                />
                <InputField
                  label="Birthday Date & Time"
                  value={config.birthdayDate.slice(0, 16)}
                  onChange={(v) => handleChange("birthdayDate", v + ":00")}
                  type="datetime-local"
                />
                <InputField
                  label="Timezone"
                  value={config.timezone}
                  onChange={(v) => handleChange("timezone", v)}
                  placeholder="e.g., Asia/Kolkata"
                />
              </SettingsCard>

              <SettingsCard title="Links" icon={Link} iconColor="text-birthday-cyan">
                <InputField
                  label="Instagram/Gift Link"
                  value={config.instagramLink}
                  onChange={(v) => handleChange("instagramLink", v)}
                  placeholder="https://..."
                />
              </SettingsCard>
            </TabsContent>

            {/* Page Content */}
            <TabsContent value="content" className="space-y-4 mt-0">
              <SettingsCard title="Countdown Page" icon={Calendar}>
                <InputField
                  label="Title"
                  value={config.countdownTitle}
                  onChange={(v) => handleChange("countdownTitle", v)}
                />
                <InputField
                  label="Subtitle"
                  value={config.countdownSubtitle}
                  onChange={(v) => handleChange("countdownSubtitle", v)}
                  multiline
                />
              </SettingsCard>

              <SettingsCard title="Star Page" icon={User}>
                <InputField
                  label="Message"
                  value={config.starPageMessage}
                  onChange={(v) => handleChange("starPageMessage", v)}
                  multiline
                />
              </SettingsCard>

              <SettingsCard title="Cake Page" icon={Cake}>
                <InputField
                  label="Title"
                  value={config.cakePageTitle}
                  onChange={(v) => handleChange("cakePageTitle", v)}
                />
                <InputField
                  label="Subtitle"
                  value={config.cakePageSubtitle}
                  onChange={(v) => handleChange("cakePageSubtitle", v)}
                />
              </SettingsCard>

              <SettingsCard title="Birthday Letter" icon={Heart}>
                <InputField
                  label="Letter Title"
                  value={config.letterTitle}
                  onChange={(v) => handleChange("letterTitle", v)}
                />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Paragraphs</Label>
                  {(config.letterParagraphs || []).map((paragraph, index) => (
                    <motion.div 
                      key={paragraph.id} 
                      layout
                      className="flex gap-2 items-start"
                    >
                      <div className="pt-3 cursor-move touch-manipulation">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Textarea
                        value={paragraph.content}
                        onChange={(e) => handleLetterParagraphChange(paragraph.id, e.target.value)}
                        className="flex-1 min-h-[80px] text-base touch-manipulation"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLetterParagraph(paragraph.id)}
                        className="text-destructive h-10 w-10 shrink-0 touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addLetterParagraph} 
                    className="gap-2 h-10 touch-manipulation"
                  >
                    <Plus className="w-4 h-4" />
                    Add Paragraph
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Signature Text"
                    value={config.letterSignature}
                    onChange={(v) => handleChange("letterSignature", v)}
                  />
                  <InputField
                    label="Sender Name"
                    value={config.senderName}
                    onChange={(v) => handleChange("senderName", v)}
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Final Reveal" icon={Heart}>
                <InputField
                  label="Message"
                  value={config.finalRevealMessage}
                  onChange={(v) => handleChange("finalRevealMessage", v)}
                  multiline
                />
              </SettingsCard>

              {/* Memories */}
              <SettingsCard title="Memory Timeline" icon={Image}>
                <MemoryTimelineEditor
                  memories={config.memories || []}
                  onChange={(newMemories) => handleChange("memories", newMemories)}
                />
              </SettingsCard>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media" className="space-y-4 mt-0">
              <SettingsCard title="Profile Image" icon={Image}>
                <div className="space-y-4">
                  <InputField
                    label="Profile Image URL"
                    value={config.profileImageUrl}
                    onChange={(v) => handleChange("profileImageUrl", v)}
                    placeholder="https://..."
                  />

                  {config.profileImageUrl && (
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className="w-24 h-24 rounded-full overflow-hidden border-4 border-birthday-pink/30 shadow-lg"
                      >
                        <img 
                          src={config.profileImageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </motion.div>
                      <Button
                        variant="outline"
                        onClick={handleOpenCropper}
                        className="gap-2 h-12 px-6 touch-manipulation"
                      >
                        <Crop className="w-4 h-4" />
                        Crop & Adjust
                      </Button>
                    </div>
                  )}
                </div>
              </SettingsCard>

              <SettingsCard title="Audio" icon={Music} iconColor="text-birthday-cyan">
                <InputField
                  label="Voice Message URL (MP3)"
                  value={config.voiceMessageUrl}
                  onChange={(v) => handleChange("voiceMessageUrl", v)}
                  placeholder="https://..."
                  hint="Audio plays only after user interaction"
                />
                <InputField
                  label="Background Music URL (MP3)"
                  value={config.backgroundMusicUrl}
                  onChange={(v) => handleChange("backgroundMusicUrl", v)}
                  placeholder="https://..."
                  hint="User will be prompted to enable music"
                />
              </SettingsCard>
            </TabsContent>

            {/* Sections Visibility */}
            <TabsContent value="sections" className="space-y-4 mt-0">
              <SettingsCard title="Section Visibility" icon={Layout}>
                <div className="space-y-3">
                  <ToggleRow
                    title="Memory Timeline"
                    description="Show memories page"
                    checked={config.showMemoryTimeline}
                    onChange={(checked) => handleChange("showMemoryTimeline", checked)}
                  />
                  <ToggleRow
                    title="Voice Message"
                    description="Show audio message button"
                    checked={config.showVoiceMessage}
                    onChange={(checked) => handleChange("showVoiceMessage", checked)}
                  />
                  <ToggleRow
                    title="Wish Vault"
                    description="Show wish writing feature"
                    checked={config.showWishVault}
                    onChange={(checked) => handleChange("showWishVault", checked)}
                  />
                  <ToggleRow
                    title="Final Reveal"
                    description="Show final surprise page"
                    checked={config.showFinalReveal}
                    onChange={(checked) => handleChange("showFinalReveal", checked)}
                  />
                </div>
              </SettingsCard>
            </TabsContent>

            {/* Advanced */}
            <TabsContent value="advanced" className="space-y-4 mt-0">
              <SettingsCard title="Quiz Questions" icon={MessageSquare}>
                <div className="space-y-4">
                  {(config.quizQuestions || []).map((q, qIndex) => (
                    <motion.div 
                      key={qIndex} 
                      layout
                      className="p-4 bg-muted/50 rounded-xl space-y-3"
                    >
                      <InputField
                        label={`Question ${qIndex + 1}`}
                        value={q.question}
                        onChange={(v) => handleQuizChange(qIndex, "question", v)}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              checked={q.correct === oIndex}
                              onChange={() => handleQuizChange(qIndex, "correct", oIndex)}
                              className="accent-birthday-pink w-5 h-5 touch-manipulation"
                            />
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const newOptions = [...q.options];
                                newOptions[oIndex] = e.target.value;
                                handleQuizChange(qIndex, "options", newOptions);
                              }}
                              className="flex-1 h-12 text-base touch-manipulation"
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SettingsCard>

              <SettingsCard title="Danger Zone" icon={Trash2} iconColor="text-destructive">
                <div className="space-y-3">
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl border border-destructive/20"
                  >
                    <div className="pr-4">
                      <p className="font-medium text-sm">Clear Wish Vault</p>
                      <p className="text-xs text-muted-foreground">Remove all saved wishes</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={clearWishVault}
                      className="h-10 touch-manipulation"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </motion.div>

                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl border border-destructive/20"
                  >
                    <div className="pr-4">
                      <p className="font-medium text-sm">Reset All Settings</p>
                      <p className="text-xs text-muted-foreground">Restore default configuration</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={resetConfig}
                      className="h-10 touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </motion.div>
                </div>
              </SettingsCard>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default AdminPanel;
