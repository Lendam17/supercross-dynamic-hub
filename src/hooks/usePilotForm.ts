import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PilotFormData {
  first_name: string;
  last_name: string;
  image_url: string;
}

interface UsePilotFormProps {
  initialData?: PilotFormData;
  isEditing: boolean;
  onSubmit: (data: PilotFormData) => void;
}

export const usePilotForm = ({ initialData, isEditing, onSubmit }: UsePilotFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<PilotFormData>({
    first_name: "",
    last_name: "",
    image_url: "",
  });

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData(initialData);
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        image_url: "",
      });
    }
  }, [initialData, isEditing]);

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('pilots-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pilots-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({
        title: "Succès",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement de l'image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {
    formData,
    setFormData,
    isUploading,
    handleImageUpload,
    handleSubmit,
  };
};