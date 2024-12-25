import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Pilot {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
}

const AdminPilots = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    image_url: "",
  });

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
      resetForm();
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
      resetForm();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    setFormData({
      first_name: pilot.first_name,
      last_name: pilot.last_name,
      image_url: pilot.image_url || "",
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      image_url: "",
    });
    setEditingPilot(null);
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
                resetForm();
                setIsOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un pilote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPilot ? "Modifier le pilote" : "Ajouter un pilote"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="first_name" className="block text-sm mb-1">
                  Prénom
                </label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm mb-1">
                  Nom
                </label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label htmlFor="image_url" className="block text-sm mb-1">
                  URL de l'image
                </label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingPilot ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pilots?.map((pilot) => (
            <TableRow key={pilot.id}>
              <TableCell>{pilot.first_name}</TableCell>
              <TableCell>{pilot.last_name}</TableCell>
              <TableCell>
                {pilot.image_url && (
                  <img
                    src={pilot.image_url}
                    alt={`${pilot.first_name} ${pilot.last_name}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(pilot)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePilotMutation.mutate(pilot.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminPilots;