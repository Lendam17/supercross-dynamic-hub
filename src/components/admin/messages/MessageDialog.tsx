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
import { useState } from "react";

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

  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Message de {message.name}</DialogTitle>
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
              onClick={async () => {
                await onReply(replyContent);
                setReplyContent("");
              }}
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