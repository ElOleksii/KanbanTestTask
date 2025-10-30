import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import type { CardType } from "../types/types";
import { Draggable } from "@hello-pangea/dnd";

interface CardProps {
  card: CardType;
  index: number;
  onDelete: (cardId: string) => void;
  onUpdate: (card: CardType) => void;
}

const Card = ({ card, index, onDelete, onUpdate }: CardProps) => {
  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the card "${card.title}"?`
    );
    if (isConfirmed) {
      onDelete(card._id);
    }
  };

  return (
    <Draggable draggableId={card._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg ${
            snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500" : ""
          }`}
        >
          <h3 className="text-md font-semibold text-gray-900">{card.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{card.description}</p>

          <div className="mt-3 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              className="text-gray-400 cursor-pointer hover:text-blue-500"
              title="Edit Card"
              onClick={() => onUpdate(card)}
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 cursor-pointer hover:text-red-500"
              title="Delete Card"
            >
              <MdOutlineDelete size={18} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Card;
