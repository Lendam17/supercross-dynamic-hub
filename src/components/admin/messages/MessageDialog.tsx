import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "./types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageDialogProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
  onReply: (content: string) => Promise<void>;
  isReplying: boolean;
}

export function MessageDialog({
  message,
  isOpen,
  onClose,
  onReply,
  isReplying,
}: MessageDialogProps) {
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const markAsRead = async () => {
      if (message && !message.is_read) {
        try {
          const { error } = await supabase
            .from("contact_messages")
            .update({ is_read: true })
            .eq("id", message.id);

          if (error) throw error;
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    };

    if (isOpen && message) {
      markAsRead();
    }
  }, [isOpen, message]);

  if (!message) return null;

  const handleReply = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          to: [message.email],
          subject: `Re: ${message.subject}`,
          message: replyContent,
          name: message.name,
        },
      });

      if (error) throw error;

      await onReply(replyContent);
      setReplyContent("");
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi de la réponse.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message de {message.name}</DialogTitle>
          <DialogDescription>
            Répondez directement à ce message. La réponse sera envoyée à {message.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>De: {message.email}</span>
              <span>
                {format(new Date(message.created_at), "dd/MM/yyyy HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>
            <h3 className="text-lg font-medium">Sujet: {message.subject}</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>
          
          <div className="space-y-2">
            <label
              htmlFor="reply"
              className="block text-sm font-medium text-gray-700"
            >
              Votre réponse
            </label>
            <Textarea
              id="reply"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Écrivez votre réponse ici..."
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReplyContent("");
                onClose();
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleReply}
              disabled={isReplying || !replyContent.trim()}
            >
              {isReplying ? "Envoi en cours..." : "Envoyer"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}