import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-white mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 rounded-md bg-accent text-white border border-gray-700 focus:border-primary focus:outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-white mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 rounded-md bg-accent text-white border border-gray-700 focus:border-primary focus:outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-white mb-2">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows={4}
          className="w-full p-3 rounded-md bg-accent text-white border border-gray-700 focus:border-primary focus:outline-none"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-md transition-colors"
      >
        Envoyer
      </button>
    </form>
  );
};

export default ContactForm;