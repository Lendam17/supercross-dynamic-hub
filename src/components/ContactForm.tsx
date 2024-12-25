import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import FormField from "./contact/FormField";
import SubmitButton from "./contact/SubmitButton";

// Schema de validation pour le formulaire de contact
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
        });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description:
            "Une erreur s'est produite. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        id="name"
        name="name"
        type="text"
        label="Nom"
        value={formData.name}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        aria-label="Votre nom"
      />
      <FormField
        id="email"
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        aria-label="Votre adresse email"
      />
      <FormField
        id="subject"
        name="subject"
        type="text"
        label="Sujet"
        value={formData.subject}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        aria-label="Sujet de votre message"
      />
      <FormField
        id="message"
        name="message"
        label="Message"
        value={formData.message}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        isTextarea
        aria-label="Votre message"
      />
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default ContactForm;