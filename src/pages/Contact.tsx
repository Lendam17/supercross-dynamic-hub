import ContactForm from "@/components/ContactForm";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-soft-blue via-white to-soft-purple flex items-center justify-center p-4">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">
            CONTACTEZ-NOUS
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Une question ? N'hésitez pas à nous contacter. Notre équipe vous
            répondra dans les plus brefs délais.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default Contact;