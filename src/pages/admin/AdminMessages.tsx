import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminMessages = () => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Message[];
    },
  });

  const handleSendReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsReplying(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          to: [selectedMessage.email],
          subject: `Re: ${selectedMessage.subject}`,
          message: replyContent,
          name: selectedMessage.name,
        },
      });

      if (error) throw error;

      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      });

      setReplyContent("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Messages de contact</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(message.created_at), "dd MMM yyyy HH:mm", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell className="max-w-xs truncate">{message.message}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Reply className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Répondre au message</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <h4 className="font-medium mb-2">Message original :</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">{message.message}</p>
                          </div>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedMessage(null);
                              setReplyContent("");
                            }}
                          >
                            Annuler
                          </Button>
                          <Button
                            onClick={handleSendReply}
                            disabled={isReplying || !replyContent.trim()}
                          >
                            {isReplying ? "Envoi en cours..." : "Envoyer"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;