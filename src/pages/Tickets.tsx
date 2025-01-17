import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Tickets = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTicketClick = async () => {
    if (isProcessing) {
      console.log("Tickets: Already processing click, skipping");
      return;
    }
    
    setIsProcessing(true);
    console.log("Tickets: Starting ticket click process");
    
    try {
      const { error } = await supabase
        .from('ticket_button_clicks')
        .insert([{ clicked_at: new Date().toISOString() }]);

      if (error) throw error;

      console.log("Tickets: Click recorded successfully");
      
      // Ouvrir dans un nouvel onglet en utilisant window.open avec noopener et noreferrer
      // pour des raisons de sécurité et pour éviter les problèmes de contexte
      window.open('https://www.ticketmaster.fr', '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('Tickets: Error tracking ticket click:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-blue via-white to-soft-purple flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-8 animate-fade-in">
          Billetterie
        </h1>
        <p className="text-xl text-gray-600 mb-12 animate-fade-in [animation-delay:200ms]">
          Réservez vos places pour le SX TOUR 2024 et vivez une expérience inoubliable
        </p>
        <Button
          size="lg"
          className="animate-fade-in [animation-delay:400ms] bg-primary hover:bg-primary/90 text-white font-bold py-8 px-12 text-2xl rounded-xl transition-all duration-300 hover:scale-105"
          onClick={handleTicketClick}
          disabled={isProcessing}
        >
          {isProcessing ? "Traitement..." : "Acheter des tickets"} <ExternalLink className="ml-2 h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default Tickets;