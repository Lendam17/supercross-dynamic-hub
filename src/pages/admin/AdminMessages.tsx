import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { MessageList } from "@/components/admin/messages/MessageList";
import { MessageDialog } from "@/components/admin/messages/MessageDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Message } from "@/components/admin/messages/types";

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
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

  const deleteMessagesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      setSelectedMessages([]);
      toast({
        title: "Messages supprimés",
        description: "Les messages ont été supprimés avec succès.",
      });
    },
    onError: (error) => {
      console.error("Error deleting messages:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression des messages.",
        variant: "destructive",
      });
    },
  });

  const handleSendReply = async (replyContent: string) => {
    if (!selectedMessage) return;

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

  const handleSelectAll = (checked: boolean) => {
    if (checked && messages) {
      setSelectedMessages(messages.map((msg) => msg.id));
    } else {
      setSelectedMessages([]);
    }
  };

  const filteredMessages = messages?.filter((message) =>
    Object.values(message).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center sm:text-left">Messages de contact</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              {selectedMessages.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer {selectedMessages.length} message
                        {selectedMessages.length > 1 ? "s" : ""} ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMessagesMutation.mutate(selectedMessages)}
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <MessageList
            messages={filteredMessages || []}
            selectedMessages={selectedMessages}
            onSelectMessage={(id, checked) => {
              if (checked) {
                setSelectedMessages([...selectedMessages, id]);
              } else {
                setSelectedMessages(selectedMessages.filter((msgId) => msgId !== id));
              }
            }}
            onSelectAll={handleSelectAll}
            onMessageClick={setSelectedMessage}
          />
        </div>

        <MessageDialog
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={handleSendReply}
          isReplying={isReplying}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminMessages;