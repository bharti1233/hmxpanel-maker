import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import { RecipientConfig } from "@/contexts/RecipientContext";
import {
  Save, User, MessageSquare, Image, Layout,
  Heart, Trash2, Plus, GripVertical, Music, Loader2, X
} from "lucide-react";

interface RecipientEditorPanelProps {
  config: RecipientConfig;
  slug: string;
  editorPassword: string;
  onClose: () => void;
  onConfigUpdate: (config: RecipientConfig) => void;
}

const RecipientEditorPanel = ({ config, slug, editorPassword, onClose, onConfigUpdate }: RecipientEditorPanelProps) => {
  const [data, setData] = useState({ ...config });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = <K extends keyof RecipientConfig>(key: K, value: RecipientConfig[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates: Record<string, any> = {
        recipient_name: data.recipient_name,
        birthday_date: data.birthday_date,
        timezone: data.timezone,
        profile_image_url: data.profile_image_url,
        voice_message_url: data.voice_message_url,
        background_music_url: data.background_music_url,
        instagram_link: data.instagram_link,
        countdown_title: data.countdown_title,
        countdown_subtitle: data.countdown_subtitle,
        star_page_message: data.star_page_message,
        cake_page_title: data.cake_page_title,
        cake_page_subtitle: data.cake_page_subtitle,
        letter_title: data.letter_title,
        letter_paragraphs: JSON.parse(JSON.stringify(data.letter_paragraphs)),
        letter_signature: data.letter_signature,
        sender_name: data.sender_name,
        final_reveal_message: data.final_reveal_message,
        memories: JSON.parse(JSON.stringify(data.memories)),
        quiz_questions: JSON.parse(JSON.stringify(data.quiz_questions)),
        show_memory_timeline: data.show_memory_timeline,
        show_voice_message: data.show_voice_message,
        show_wish_vault: data.show_wish_vault,
        show_final_reveal: data.show_final_reveal,
        show_quiz: data.show_quiz,
      };

      const { data: response, error } = await supabase.functions.invoke("update-recipient-by-editor", {
        body: { slug, editorPassword, updates },
      });

      if (error || !response?.success) {
        toast.error(response?.error || "Failed to save changes");
        return;
      }

      toast.success("Changes saved!");
      onConfigUpdate(data);
    } catch (err) {
      logger.error("Failed to save:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLetterParagraphChange = (id: string, content: string) => {
    const newParagraphs = data.letter_paragraphs.map((p: any) =>
      p.id === id ? { ...p, content } : p
    );
    handleChange("letter_paragraphs", newParagraphs);
  };

  const addLetterParagraph = () => {
    const newParagraph = { id: Date.now().toString(), content: "New paragraph..." };
    handleChange("letter_paragraphs", [...(data.letter_paragraphs as any[]), newParagraph]);
  };

  const removeLetterParagraph = (id: string) => {
    handleChange("letter_paragraphs", (data.letter_paragraphs as any[]).filter((p: any) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-background/90 backdrop-blur-lg py-3 z-10">
          <h2 className="text-lg font-display font-bold">✏️ Edit Experience</h2>
          <div className="flex gap-2">
            <Button
              variant="birthday"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 touch-target"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="touch-target">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 h-auto p-1">
            <TabsTrigger value="content" className="text-[10px] sm:text-xs py-2.5 touch-target flex-col sm:flex-row gap-1">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Content</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="text-[10px] sm:text-xs py-2.5 touch-target flex-col sm:flex-row gap-1">
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Media</span>
            </TabsTrigger>
            <TabsTrigger value="letter" className="text-[10px] sm:text-xs py-2.5 touch-target flex-col sm:flex-row gap-1">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Letter</span>
            </TabsTrigger>
            <TabsTrigger value="sections" className="text-[10px] sm:text-xs py-2.5 touch-target flex-col sm:flex-row gap-1">
              <Layout className="w-4 h-4" />
              <span className="hidden sm:inline">Sections</span>
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">Basic Info</h3>
              <div>
                <Label className="text-xs">Recipient Name</Label>
                <Input value={data.recipient_name} onChange={(e) => handleChange("recipient_name", e.target.value)} className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Countdown Title</Label>
                <Input value={data.countdown_title} onChange={(e) => handleChange("countdown_title", e.target.value)} className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Countdown Subtitle</Label>
                <Textarea value={data.countdown_subtitle} onChange={(e) => handleChange("countdown_subtitle", e.target.value)} className="touch-target text-base min-h-[80px]" />
              </div>
              <div>
                <Label className="text-xs">Star Page Message</Label>
                <Textarea value={data.star_page_message} onChange={(e) => handleChange("star_page_message", e.target.value)} className="touch-target text-base min-h-[80px]" />
              </div>
              <div>
                <Label className="text-xs">Cake Page Title</Label>
                <Input value={data.cake_page_title} onChange={(e) => handleChange("cake_page_title", e.target.value)} className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Cake Page Subtitle</Label>
                <Input value={data.cake_page_subtitle} onChange={(e) => handleChange("cake_page_subtitle", e.target.value)} className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Final Reveal Message</Label>
                <Textarea value={data.final_reveal_message} onChange={(e) => handleChange("final_reveal_message", e.target.value)} className="touch-target text-base min-h-[80px]" />
              </div>
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">Media URLs</h3>
              <div>
                <Label className="text-xs">Profile Image URL</Label>
                <Input value={data.profile_image_url} onChange={(e) => handleChange("profile_image_url", e.target.value)} placeholder="https://..." className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Voice Message URL</Label>
                <Input value={data.voice_message_url} onChange={(e) => handleChange("voice_message_url", e.target.value)} placeholder="https://..." className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Background Music URL</Label>
                <Input value={data.background_music_url} onChange={(e) => handleChange("background_music_url", e.target.value)} placeholder="https://..." className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Instagram/Gift Link</Label>
                <Input value={data.instagram_link} onChange={(e) => handleChange("instagram_link", e.target.value)} placeholder="https://..." className="touch-target text-base" />
              </div>
            </div>
          </TabsContent>

          {/* Letter Tab */}
          <TabsContent value="letter" className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">Birthday Letter</h3>
              <div>
                <Label className="text-xs">Letter Title</Label>
                <Input value={data.letter_title} onChange={(e) => handleChange("letter_title", e.target.value)} className="touch-target text-base" />
              </div>
              <div>
                <Label className="text-xs">Paragraphs</Label>
                <div className="space-y-3 mt-2">
                  {(data.letter_paragraphs as any[]).map((paragraph: any) => (
                    <div key={paragraph.id} className="flex gap-2 items-start">
                      <GripVertical className="w-5 h-5 text-muted-foreground mt-3 flex-shrink-0" />
                      <Textarea
                        value={paragraph.content}
                        onChange={(e) => handleLetterParagraphChange(paragraph.id, e.target.value)}
                        className="flex-1 touch-target text-base min-h-[80px]"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeLetterParagraph(paragraph.id)} className="text-destructive touch-target h-10 w-10 flex-shrink-0">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addLetterParagraph} className="gap-2 touch-target w-full sm:w-auto">
                    <Plus className="w-4 h-4" />
                    Add Paragraph
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Signature</Label>
                  <Input value={data.letter_signature} onChange={(e) => handleChange("letter_signature", e.target.value)} className="touch-target text-base" />
                </div>
                <div>
                  <Label className="text-xs">Sender Name</Label>
                  <Input value={data.sender_name} onChange={(e) => handleChange("sender_name", e.target.value)} className="touch-target text-base" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="space-y-4">
            <div className="glass-card rounded-2xl p-4 space-y-4">
              <h3 className="font-display font-semibold text-sm">Section Visibility</h3>
              {[
                { key: "show_memory_timeline" as const, label: "Memory Timeline" },
                { key: "show_voice_message" as const, label: "Voice Message" },
                { key: "show_wish_vault" as const, label: "Wish Vault" },
                { key: "show_final_reveal" as const, label: "Final Reveal" },
                { key: "show_quiz" as const, label: "Quiz" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl touch-target">
                  <p className="font-medium text-sm">{label}</p>
                  <Switch checked={data[key]} onCheckedChange={(checked) => handleChange(key, checked)} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RecipientEditorPanel;
