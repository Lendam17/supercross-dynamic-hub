interface TicketCardProps {
  title: string;
  price: string;
  features: string[];
}

const TicketCard = ({ title, price, features }: TicketCardProps) => {
  return (
    <div className="bg-accent p-6 rounded-lg shadow-xl transform hover:scale-105 transition-transform">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="text-3xl font-bold text-primary mb-6">{price}</div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-300 flex items-center">
            <span className="mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded transition-colors">
        Réserver
      </button>
    </div>
  );
};

export default TicketCard;