interface CardProps {
  title: string;
  description: string;
}

const Card = ({ title, description }: CardProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200 hover:shadow-md transition">
      <h3 className="text-lg">{title}</h3>
      <p className="">{description}</p>
    </div>
  );
};

export default Card;
