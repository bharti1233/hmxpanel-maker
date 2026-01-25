import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdmin, SiteContent } from "@/contexts/AdminContext";
import { X, Save, RotateCcw, ChevronDown, ChevronUp, Image, Calendar, User, MessageSquare, Gift, Cake, Heart, Star } from "lucide-react";

const AdminPanel = () => {
  const { isAdmin, content, updateContent, resetContent, showAdminModal, setShowAdminModal, setIsAdmin } = useAdmin();
  const [expandedSection, setExpandedSection] = useState<string | null>("general");
  const [saveMessage, setSaveMessage] = useState("");

  if (!isAdmin || !showAdminModal) return null;

  const handleSave = () => {
    setSaveMessage("✅ Changes saved!");
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const handleClose = () => {
    setShowAdminModal(false);
    setIsAdmin(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateMemory = (index: number, field: string, value: string) => {
    const newMemories = [...content.memories];
    newMemories[index] = { ...newMemories[index], [field]: value };
    updateContent({ memories: newMemories });
  };

  const updateLetterContent = (index: number, value: string) => {
    const newContent = [...content.letterContent];
    newContent[index] = value;
    updateContent({ letterContent: newContent });
  };

  const Section = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
  }) => (
    <div className="border border-border/50 rounded-2xl overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-card/50 hover:bg-card/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-birthday-pink to-birthday-purple flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-semibold text-lg">{title}</span>
        </div>
        {expandedSection === id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 bg-background/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = "text",
    placeholder = ""
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-background/50 border-border/50 focus:border-birthday-pink"
      />
    </div>
  );

  const TextareaField = ({ 
    label, 
    value, 
    onChange,
    rows = 3
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    rows?: number;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="bg-background/50 border-border/50 focus:border-birthday-pink resize-none"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="glass-card rounded-3xl w-full max-w-2xl my-8 relative overflow-hidden"
        style={{
          boxShadow: "0 25px 50px -12px hsl(320, 80%, 30%, 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.1)",
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold text-gradient">🔧 Admin Panel</h2>
              <p className="text-sm text-muted-foreground mt-1">Customize everything on the birthday site</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button variant="birthday" size="sm" onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={resetContent} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </Button>
            {saveMessage && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-green-400 text-sm"
              >
                {saveMessage}
              </motion.span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* General Settings */}
          <Section id="general" title="General Settings" icon={User}>
            <InputField
              label="Recipient Name"
              value={content.recipientName}
              onChange={(value) => updateContent({ recipientName: value })}
            />
            <InputField
              label="Sender Name"
              value={content.senderName}
              onChange={(value) => updateContent({ senderName: value })}
            />
            <InputField
              label="Birthday Date"
              value={content.birthdayDate.split("T")[0]}
              onChange={(value) => updateContent({ birthdayDate: value + "T00:00:00" })}
              type="date"
            />
            <InputField
              label="Birthday Image URL"
              value={content.birthdayImage}
              onChange={(value) => updateContent({ birthdayImage: value })}
              placeholder="https://example.com/image.jpg"
            />
            <InputField
              label="Instagram Link"
              value={content.instagramLink}
              onChange={(value) => updateContent({ instagramLink: value })}
              placeholder="https://instagram.com/..."
            />
          </Section>

          {/* Countdown Page */}
          <Section id="countdown" title="Countdown Page" icon={Calendar}>
            <InputField
              label="Title"
              value={content.countdownTitle}
              onChange={(value) => updateContent({ countdownTitle: value })}
            />
            <TextareaField
              label="Subtitle"
              value={content.countdownSubtitle}
              onChange={(value) => updateContent({ countdownSubtitle: value })}
            />
          </Section>

          {/* Star Page */}
          <Section id="star" title="Star Page" icon={Star}>
            <InputField
              label="Title"
              value={content.starTitle}
              onChange={(value) => updateContent({ starTitle: value })}
            />
            <InputField
              label="Subtitle"
              value={content.starSubtitle}
              onChange={(value) => updateContent({ starSubtitle: value })}
            />
            <TextareaField
              label="Message"
              value={content.starMessage}
              onChange={(value) => updateContent({ starMessage: value })}
              rows={4}
            />
          </Section>

          {/* Memories Page */}
          <Section id="memories" title="Memories Page" icon={Heart}>
            <InputField
              label="Section Title"
              value={content.memoriesTitle}
              onChange={(value) => updateContent({ memoriesTitle: value })}
            />
            <div className="space-y-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground">Memory Cards:</p>
              {content.memories.map((memory, index) => (
                <div key={index} className="p-4 bg-card/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{memory.emoji}</span>
                    <span className="text-sm text-birthday-pink font-medium">Memory {index + 1}</span>
                  </div>
                  <InputField
                    label="Emoji"
                    value={memory.emoji}
                    onChange={(value) => updateMemory(index, "emoji", value)}
                  />
                  <InputField
                    label="Title"
                    value={memory.title}
                    onChange={(value) => updateMemory(index, "title", value)}
                  />
                  <TextareaField
                    label="Description"
                    value={memory.description}
                    onChange={(value) => updateMemory(index, "description", value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Quiz Page */}
          <Section id="quiz" title="Quiz Page" icon={MessageSquare}>
            <InputField
              label="Title"
              value={content.quizTitle}
              onChange={(value) => updateContent({ quizTitle: value })}
            />
            <InputField
              label="Subtitle"
              value={content.quizSubtitle}
              onChange={(value) => updateContent({ quizSubtitle: value })}
            />
          </Section>

          {/* Cake Page */}
          <Section id="cake" title="Cake Page" icon={Cake}>
            <InputField
              label="Title"
              value={content.cakeTitle}
              onChange={(value) => updateContent({ cakeTitle: value })}
            />
            <InputField
              label="Subtitle"
              value={content.cakeSubtitle}
              onChange={(value) => updateContent({ cakeSubtitle: value })}
            />
            <InputField
              label="Cake Message"
              value={content.cakeMessage}
              onChange={(value) => updateContent({ cakeMessage: value })}
            />
          </Section>

          {/* Letter Page */}
          <Section id="letter" title="Letter Page" icon={MessageSquare}>
            <InputField
              label="Title"
              value={content.letterTitle}
              onChange={(value) => updateContent({ letterTitle: value })}
            />
            <InputField
              label="Subtitle"
              value={content.letterSubtitle}
              onChange={(value) => updateContent({ letterSubtitle: value })}
            />
            <div className="space-y-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground">Letter Paragraphs:</p>
              {content.letterContent.map((paragraph, index) => (
                <TextareaField
                  key={index}
                  label={`Paragraph ${index + 1}`}
                  value={paragraph}
                  onChange={(value) => updateLetterContent(index, value)}
                  rows={3}
                />
              ))}
            </div>
          </Section>

          {/* Final Page */}
          <Section id="final" title="Final Page" icon={Gift}>
            <InputField
              label="Title"
              value={content.finalTitle}
              onChange={(value) => updateContent({ finalTitle: value })}
            />
            <TextareaField
              label="Message"
              value={content.finalMessage}
              onChange={(value) => updateContent({ finalMessage: value })}
              rows={4}
            />
          </Section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
