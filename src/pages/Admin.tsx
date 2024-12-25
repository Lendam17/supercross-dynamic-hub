import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import PilotForm from "@/components/admin/PilotForm";
import PilotList from "@/components/admin/PilotList";

interface Pilot {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
}

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);

  const { data: pilots, isLoading } = useQuery({
    queryKey: ["pilots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pilots")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Pilot[];
    },
  });

  const createPilotMutation = useMutation({
    mutationFn: async (newPilot: Omit<Pilot, "id">) => {
      const { data, error } = await supabase.from("pilots").insert([newPilot]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Succès",
        description: "Le pilote a été ajouté avec succès.",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du pilote.",
        variant: "destructive",
      });
      console.error("Error creating pilot:", error);
    },
  });

  const updatePilotMutation = useMutation({
    mutationFn: async (pilot: Pilot) => {
      const { data, error } = await supabase
        .from("pilots")
        .update({
          first_name: pilot.first_name,
          last_name: pilot.last_name,
          image_url: pilot.image_url,
        })
        .eq("id", pilot.id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Succès",
        description: "Le pilote a été mis à jour avec succès.",
      });
      setIsOpen(false);
      setEditingPilot(null);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du pilote.",
        variant: "destructive",
      });
      console.error("Error updating pilot:", error);
    },
  });

  const deletePilotMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pilots").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pilots"] });
      toast({
        title: "Succès",
        description: "Le pilote a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du pilote.",
        variant: "destructive",
      });
      console.error("Error deleting pilot:", error);
    },
  });

  const handleSubmit = (formData: Omit<Pilot, "id">) => {
    if (editingPilot) {
      updatePilotMutation.mutate({
        ...formData,
        id: editingPilot.id,
      } as Pilot);
    } else {
      createPilotMutation.mutate(formData);
    }
  };

  const handleEdit = (pilot: Pilot) => {
    setEditingPilot(pilot);
    setIsOpen(true);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Pilotes</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPilot(null);
                setIsOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un pilote
            </Button>
          </DialogTrigger>
          <PilotForm
            onSubmit={handleSubmit}
            initialData={editingPilot || undefined}
            setIsOpen={setIsOpen}
            isEditing={!!editingPilot}
          />
        </Dialog>
      </div>

      <PilotList
        pilots={pilots || []}
        onEdit={handleEdit}
        onDelete={(id) => deletePilotMutation.mutate(id)}
      />
    </div>
  );
};

export default Admin;