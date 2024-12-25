import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePilotForm } from "@/hooks/usePilotForm";
import ImageUpload from "./ImageUpload";

interface PilotFormProps {
  onSubmit: (formData: {
    first_name: string;
    last_name: string;
    image_url: string;
  }) => void;
  initialData?: {
    first_name: string;
    last_name: string;
    image_url: string;
  };
  setIsOpen: (open: boolean) => void;
  isEditing: boolean;
}

const PilotForm = ({
  onSubmit,
  initialData,
  setIsOpen,
  isEditing,
}: PilotFormProps) => {
  const {
    formData,
    setFormData,
    isUploading,
    handleImageUpload,
    handleSubmit,
  } = usePilotForm({
    initialData,
    isEditing,
    onSubmit,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Modifier le pilote" : "Ajouter un pilote"}
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
        <ImageUpload
          imageUrl={formData.image_url}
          onUpload={handleImageUpload}
          isUploading={isUploading}
        />
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PilotForm;