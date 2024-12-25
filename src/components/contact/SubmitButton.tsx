interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      aria-label={isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
    >
      {isSubmitting ? "Envoi en cours..." : "Envoyer"}
    </button>
  );
};

export default SubmitButton;