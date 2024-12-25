import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MessageSquare, Reply, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

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
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Messages de contact</h1>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    messages?.length === selectedMessages.length && selectedMessages.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages?.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedMessages([...selectedMessages, message.id]);
                      } else {
                        setSelectedMessages(selectedMessages.filter((id) => id !== message.id));
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(message.created_at), "dd MMM yyyy HH:mm", {
                    locale: fr,
                  })}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell className="max-w-xs truncate">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto hover:bg-transparent"
                    onClick={() => setSelectedMessage(message)}
                  >
                    <span className="truncate">{message.message}</span>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
                          <DialogFooter>
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
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce message ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMessagesMutation.mutate([message.id])}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for viewing full message */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Message de {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>De: {selectedMessage?.email}</span>
                <span>
                  {selectedMessage &&
                    format(new Date(selectedMessage.created_at), "dd MMM yyyy HH:mm", {
                      locale: fr,
                    })}
                </span>
              </div>
              <h3 className="text-lg font-medium">Sujet: {selectedMessage?.subject}</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminMessages;