import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Schema de validation pour le formulaire de contact
// Définit les règles de validation pour chaque champ
const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

// Type pour les données du formulaire basé sur le schema de validation
type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État initial du formulaire avec tous les champs requis
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
      // Validation des données du formulaire avec Zod
      const validatedData = contactSchema.parse(formData);

      // Insertion du message dans la base de données
      // Les champs correspondent exactement à ce que Supabase attend
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          subject: validatedData.subject,
          message: validatedData.message,
        });

      if (error) throw error;

      // Notification de succès
      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès.",
      });

      // Réinitialisation du formulaire après envoi réussi
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      if (error instanceof z.ZodError) {
        // Affichage de la première erreur de validation
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        // Affichage d'une erreur générique en cas d'échec de l'insertion
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          required
          disabled={isSubmitting}
          aria-label="Votre nom"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          required
          disabled={isSubmitting}
          aria-label="Votre adresse email"
        />
      </div>
      <div>
        <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
          Sujet
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full p-3 rounded-lg bg-white/50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          required
          disabled={isSubmitting}
          aria-label="Sujet de votre message"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full p-3 rounded-lg bg-white/50 border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
          required
          disabled={isSubmitting}
          aria-label="Votre message"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label={isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
};

export default ContactForm;