import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Message } from "./types";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const markAsRead = async () => {
      if (message && !message.is_read) {
        try {
          const { error } = await supabase
            .from("contact_messages")
            .update({ is_read: true })
            .eq("id", message.id);

          if (error) throw error;

          queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
        } catch (error) {
          console.error("Error marking message as read:", error);
        }
      }
    };

    if (isOpen && message) {
      markAsRead();
    }
  }, [isOpen, message, queryClient]);

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
        <DialogHeader className="flex flex-row justify-between items-start border-b pb-4">
          <DialogTitle className="text-lg">
            MESSAGE DE {message.name.toUpperCase()} ({message.email})
          </DialogTitle>
          <span className="text-sm text-gray-500">
            {format(new Date(message.created_at), "dd/MM/yyyy HH:mm", {
              locale: fr,
            })}
          </span>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="font-medium">
              SUJET: {message.subject.toUpperCase()}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
          </div>
          
          <div className="space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={6}
              className="w-full"
              placeholder="Votre réponse..."
            />
          </div>
          
          <DialogFooter className="flex justify-end gap-2">
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