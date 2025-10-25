import { useState } from "react";
import type { CardType, ColumnType } from "../types/types";
import Card from "./Card";
import CreateCardModal from "./CreateCardModal";

interface ColumnProps {
  column: ColumnType;
}

const Column = ({ column }: ColumnProps) => {
  const [cards, setCards] = useState(column.cards || []);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCardCreated = (newCard: CardType) => {
    setCards([...cards, newCard]);
  };

  return (
    <div className="bg-gray-100 p-4 rounded w-72 flex-shrink-0">
      <h3 className="font-bold mb-2">{column.name}</h3>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="mt-2 px-2 py-1 bg-green-500 text-white rounded"
      >
        + Add Card
      </button>

      <CreateCardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        columnId={column._id}
        onCardCreated={handleCardCreated}
      />
    </div>
  );
};

export default Column;
