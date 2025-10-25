import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import type { CardType } from "../types/types";

interface CardProps {
  card: CardType;
}

const Card = ({ card }: CardProps) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-3 border border-gray-200 hover:shadow-md transition">
      <h3 className="text-lg">{card.title}</h3>
      <p className="">{card.description}</p>
      <div className="flex justify-end gap-2 mt-3">
        <button
          className="text-blue-500 hover:text-blue-600 transition cursor-pointer"
          title="Edit"
        >
          <FaEdit size={18} />
        </button>
        <button
          className="text-red-500 hover:text-red-600 transition cursor-pointer"
          title="Delete"
        >
          <MdOutlineDelete size={20} />
        </button>
      </div>
    </div>
  );
};

export default Card;
