import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery(["messages", searchQuery], async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .ilike("content", `%${searchQuery}%`);
    if (error) throw new Error(error.message);
    return data;
  });

  const mutation = useMutation(
    async (id: string) => {
      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("messages");
        toast({
          title: "Message supprimé",
          description: "Le message a été supprimé avec succès.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      },
    }
  );

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Message list */}
          <MessageList
            messages={filteredMessages}
            isLoading={isLoading}
            onMessageClick={setSelectedMessage}
            onDeleteClick={handleDelete}
          />
        </div>

        {/* Message dialog */}
        <MessageDialog
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
        />
      </div>
    </DashboardLayout>
  );
}
