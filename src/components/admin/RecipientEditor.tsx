import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemoryTimelineEditor from "./MemoryTimelineEditor";
import QuizEditor from "./QuizEditor";
import { MemoryItem, LetterParagraph, QuizQuestion } from "@/contexts/AdminContext";
import { logger } from "@/lib/logger";
import {
  ArrowLeft, Save, User, Calendar, Image, MessageSquare,
  Layout, Cake, Heart, Trash2, Plus, GripVertical, Music, Link, Loader2
} from "lucide-react";

interface RecipientEditorProps {
  recipientId: string;
  onBack: () => void;
}

interface RecipientData {
  id: string;
  slug: string;
  recipient_name: string;
  birthday_date: string;
  timezone: string;
  profile_image_url: string;
  voice_message_url: string;
  background_music_url: string;
  instagram_link: string;
  countdown_title: string;
  countdown_subtitle: string;
  star_page_message: string;
  cake_page_title: string;
  cake_page_subtitle: string;
  letter_title: string;
  letter_paragraphs: LetterParagraph[];
  letter_signature: string;
  sender_name: string;
  final_reveal_message: string;
  memories: MemoryItem[];
  quiz_questions: QuizQuestion[];
  show_memory_timeline: boolean;
  show_voice_message: boolean;
  show_wish_vault: boolean;
  show_final_reveal: boolean;
  show_quiz: boolean;
}

const RecipientEditor = ({ recipientId, onBack }: RecipientEditorProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<RecipientData | null>(null);

  const fetchRecipient = useCallback(async () => {
    try {
      const { data: recipient, error } = await supabase
        .from("birthday_recipients")
        .select("*")
        .eq("id", recipientId)
        .single();

      if (error) {
        logger.error("Error fetching recipient:", error);
        return;
      }

      setData({
        ...recipient,
        letter_paragraphs: Array.isArray(recipient.letter_paragraphs) ? recipient.letter_paragraphs as unknown as LetterParagraph[] : [],
        memories: Array.isArray(recipient.memories) ? recipient.memories as unknown as MemoryItem[] : [],
        quiz_questions: Array.isArray(recipient.quiz_questions) ? recipient.quiz_questions as unknown as QuizQuestion[] : [],
      });
    } catch (err) {
      logger.error("Failed to fetch recipient:", err);
    } finally {
      setIsLoading(false);
    }
  }, [recipientId]);

  useEffect(() => {
    fetchRecipient();
  }, [fetchRecipient]);

  const handleChange = <K extends keyof RecipientData>(key: K, value: RecipientData[K]) => {
    if (!data) return;
    setData({ ...data, [key]: value });
  };

  const handleSave = async () => {
    if (!data) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("birthday_recipients")
        .update({
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
        })
        .eq("id", recipientId);

      if (error) {
        logger.error("Error saving recipient:", error);
      }
    } catch (err) {
      logger.error("Failed to save recipient:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLetterParagraphChange = (id: string, content: string) => {
    if (!data) return;
    const newParagraphs = data.letter_paragraphs.map(p =>
      p.id === id ? { ...p, content } : p
    );
    handleChange("letter_paragraphs", newParagraphs);
  };

  const addLetterParagraph = () => {
    if (!data) return;
    const newParagraph: LetterParagraph = {
      id: Date.now().toString(),
      content: "New paragraph...",
    };
    handleChange("letter_paragraphs", [...data.letter_paragraphs, newParagraph]);
  };

  const removeLetterParagraph = (id: string) => {
    if (!data) return;
    handleChange("letter_paragraphs", data.letter_paragraphs.filter(p => p.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-birthday-pink" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Recipient not found</p>
        <Button variant="ghost" onClick={onBack} className="mt-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-display font-bold">{data.recipient_name}</h2>
            <p className="text-sm text-muted-foreground font-mono">/b/{data.slug}</p>
          </div>
        </div>

        <Button 
          variant="birthday" 
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
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
                  value={data.recipient_name}
                  onChange={(e) => handleChange("recipient_name", e.target.value)}
                  placeholder="Enter name..."
                />
              </div>

              <div>
                <Label>Birthday Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={data.birthday_date.slice(0, 16)}
                  onChange={(e) => handleChange("birthday_date", e.target.value + ":00")}
                />
              </div>

              <div>
                <Label>Timezone</Label>
                <Input
                  value={data.timezone}
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
                value={data.instagram_link}
                onChange={(e) => handleChange("instagram_link", e.target.value)}
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
                value={data.countdown_title}
                onChange={(e) => handleChange("countdown_title", e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={data.countdown_subtitle}
                onChange={(e) => handleChange("countdown_subtitle", e.target.value)}
              />
            </div>
          </div>

          {/* Star Page */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-semibold">Star Page</h3>
            <div>
              <Label>Message</Label>
              <Textarea
                value={data.star_page_message}
                onChange={(e) => handleChange("star_page_message", e.target.value)}
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
                value={data.cake_page_title}
                onChange={(e) => handleChange("cake_page_title", e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={data.cake_page_subtitle}
                onChange={(e) => handleChange("cake_page_subtitle", e.target.value)}
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
                value={data.letter_title}
                onChange={(e) => handleChange("letter_title", e.target.value)}
              />
            </div>

            <div>
              <Label>Paragraphs</Label>
              <div className="space-y-3 mt-2">
                {data.letter_paragraphs.map((paragraph) => (
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
                  value={data.letter_signature}
                  onChange={(e) => handleChange("letter_signature", e.target.value)}
                />
              </div>
              <div>
                <Label>Sender Name</Label>
                <Input
                  value={data.sender_name}
                  onChange={(e) => handleChange("sender_name", e.target.value)}
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
                value={data.final_reveal_message}
                onChange={(e) => handleChange("final_reveal_message", e.target.value)}
              />
            </div>
          </div>

          {/* Memories */}
          <div className="glass-card rounded-2xl p-6">
            <MemoryTimelineEditor
              memories={data.memories}
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
                value={data.profile_image_url}
                onChange={(e) => handleChange("profile_image_url", e.target.value)}
                placeholder="https://..."
              />
              {data.profile_image_url && (
                <div className="mt-2 w-20 h-20 rounded-full overflow-hidden border-2 border-birthday-pink/30">
                  <img src={data.profile_image_url} alt="Preview" className="w-full h-full object-cover" />
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
                value={data.voice_message_url}
                onChange={(e) => handleChange("voice_message_url", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Background Music URL (MP3)</Label>
              <Input
                value={data.background_music_url}
                onChange={(e) => handleChange("background_music_url", e.target.value)}
                placeholder="https://..."
              />
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
                  checked={data.show_memory_timeline}
                  onCheckedChange={(checked) => handleChange("show_memory_timeline", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="font-medium">Voice Message</p>
                  <p className="text-sm text-muted-foreground">Show audio message button</p>
                </div>
                <Switch
                  checked={data.show_voice_message}
                  onCheckedChange={(checked) => handleChange("show_voice_message", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="font-medium">Wish Vault</p>
                  <p className="text-sm text-muted-foreground">Allow writing wishes</p>
                </div>
                <Switch
                  checked={data.show_wish_vault}
                  onCheckedChange={(checked) => handleChange("show_wish_vault", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="font-medium">Final Reveal</p>
                  <p className="text-sm text-muted-foreground">Show final celebration page</p>
                </div>
                <Switch
                  checked={data.show_final_reveal}
                  onCheckedChange={(checked) => handleChange("show_final_reveal", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="font-medium">Quiz</p>
                  <p className="text-sm text-muted-foreground">Show birthday quiz</p>
                </div>
                <Switch
                  checked={data.show_quiz}
                  onCheckedChange={(checked) => handleChange("show_quiz", checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Advanced - Quiz */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <QuizEditor
              questions={data.quiz_questions}
              onChange={(newQuestions) => handleChange("quiz_questions", newQuestions)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipientEditor;
