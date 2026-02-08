import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Users, 
  Calendar,
  Loader2,
  Check,
  Eye,
  Settings
} from "lucide-react";
import { logger } from "@/lib/logger";

interface Recipient {
  id: string;
  slug: string;
  recipient_name: string;
  birthday_date: string;
  created_at: string;
}

interface RecipientManagerProps {
  onEditRecipient: (recipientId: string) => void;
}

const RecipientManager = ({ onEditRecipient }: RecipientManagerProps) => {
  const { state } = useAdmin();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchRecipients = async () => {
    try {
      const { data, error } = await supabase
        .from("birthday_recipients")
        .select("id, slug, recipient_name, birthday_date, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Error fetching recipients:", error);
        return;
      }

      setRecipients(data || []);
    } catch (err) {
      logger.error("Failed to fetch recipients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPassword.trim()) return;

    setIsCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        logger.error("No session found");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-recipient", {
        body: { recipientName: newName.trim(), password: newPassword.trim() },
      });

      if (error) {
        logger.error("Error creating recipient:", error);
        return;
      }

      if (data.success) {
        setNewName("");
        setNewPassword("");
        setShowCreateForm(false);
        fetchRecipients();
      }
    } catch (err) {
      logger.error("Failed to create recipient:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipient? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("birthday_recipients")
        .delete()
        .eq("id", id);

      if (error) {
        logger.error("Error deleting recipient:", error);
        return;
      }

      setRecipients(recipients.filter(r => r.id !== id));
    } catch (err) {
      logger.error("Failed to delete recipient:", err);
    }
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/b/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const openLink = (slug: string) => {
    window.open(`/b/${slug}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-birthday-pink" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 px-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-birthday-pink flex-shrink-0" />
          <h2 className="text-lg md:text-xl font-display font-bold">Birthday Recipients</h2>
        </div>
        
        {!showCreateForm && (
          <Button 
            variant="birthday" 
            size="default"
            onClick={() => setShowCreateForm(true)}
            className="gap-2 touch-target touch-feedback w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Recipient
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="font-display font-semibold mb-4">Create New Recipient</h3>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label className="text-responsive-sm">Recipient Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Sarah"
                disabled={isCreating}
                className="touch-target text-base"
              />
            </div>

            <div>
              <Label className="text-responsive-sm">Password</Label>
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a simple password..."
                disabled={isCreating}
                className="touch-target text-base"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Share this password with the recipient to unlock their experience
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                variant="birthday"
                disabled={isCreating || !newName.trim() || !newPassword.trim()}
                className="gap-2 touch-target touch-feedback flex-1 sm:flex-initial"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewName("");
                  setNewPassword("");
                }}
                disabled={isCreating}
                className="touch-target touch-feedback flex-1 sm:flex-initial"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Recipients List */}
      {recipients.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Users className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold mb-2">No Recipients Yet</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Create your first birthday recipient to get started
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh] md:max-h-[500px] smooth-scroll">
          <div className="space-y-3 pr-1">
            {recipients.map((recipient) => (
              <motion.div
                key={recipient.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-4 touch-action-pan-y"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-base md:text-lg truncate">
                      {recipient.recipient_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        {formatDate(recipient.birthday_date)}
                      </span>
                      <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded truncate max-w-[120px] sm:max-w-none">
                        /b/{recipient.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyLink(recipient.slug)}
                      title="Copy link"
                      className="touch-target touch-feedback h-10 w-10"
                    >
                      {copiedSlug === recipient.slug ? (
                        <Check className="w-5 h-5 text-birthday-cyan" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openLink(recipient.slug)}
                      title="Open in new tab"
                      className="touch-target touch-feedback h-10 w-10"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditRecipient(recipient.id)}
                      title="Edit"
                      className="touch-target touch-feedback h-10 w-10"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(recipient.id)}
                      className="text-destructive hover:text-destructive touch-target touch-feedback h-10 w-10"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default RecipientManager;
