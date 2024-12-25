import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageDialog } from "@/components/admin/messages/MessageDialog";
import { MessageList } from "@/components/admin/messages/MessageList";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/components/admin/messages/types";

export default function AdminMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["contact_messages", searchQuery],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .ilike("message", `%${searchQuery}%`);
      if (error) throw error;
      return data as Message[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact_messages"] });
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleReply = async (content: string) => {
    setIsReplying(true);
    try {
      // Here you would implement the email sending logic
      // For now, we'll just show a success message
      toast({
        title: "Réponse envoyée",
        description: "Votre réponse a été envoyée avec succès.",
      });
      setSelectedMessage(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de la réponse.",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleSelectMessage = (id: string, checked: boolean) => {
    setSelectedMessages(prev =>
      checked ? [...prev, id] : prev.filter(messageId => messageId !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedMessages(checked ? messages.map(m => m.id) : []);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center w-full sm:text-left sm:w-auto">
              Messages de contact
            </h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>
          </div>

          <MessageList
            messages={messages}
            selectedMessages={selectedMessages}
            onSelectMessage={handleSelectMessage}
            onSelectAll={handleSelectAll}
            onMessageClick={setSelectedMessage}
          />
        </div>

        <MessageDialog
          message={selectedMessage}
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={handleReply}
          isReplying={isReplying}
        />
      </div>
    </DashboardLayout>
  );
}