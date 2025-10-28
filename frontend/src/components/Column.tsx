import { useState } from "react";
import { useDispatch } from "react-redux";
import type { CardType, ColumnType } from "../types/types";
import Card from "./Card";
import CreateCardModal from "./CreateCardModal";
import EditCardModal from "./EditCardModal";
import { Droppable } from "@hello-pangea/dnd"; // Removed Draggable
import { type AppDispatch } from "../store/store";
import { createCard, updateCard, deleteCard } from "../store/boardSlice";

interface ColumnProps {
  column: ColumnType;
  // Removed index prop
}

const Column = ({ column }: ColumnProps) => {
  // Removed index
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  // Handlers now dispatch actions to Redux
  const handleCardCreated = (title: string, description: string) => {
    dispatch(createCard({ columnId: column._id, title, description }));
    setCreateModalOpen(false);
  };

  const handleCardDeleted = (deletedCardId: string) => {
    dispatch(deleteCard({ cardId: deletedCardId, columnId: column._id }));
  };

  const handleCardUpdated = (updatedCard: CardType) => {
    dispatch(
      updateCard({
        cardId: updatedCard._id,
        title: updatedCard.title,
        description: updatedCard.description,
      })
    );
    setEditingCard(null);
  };

  return (
    // Removed the outer Draggable wrapper
    <div className="flex w-72 flex-shrink-0 flex-col rounded-lg bg-gray-100 p-3 shadow-sm min-h-[20rem]">
      {/* Removed ...provided.dragHandleProps from the header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{column.name}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-600">
          {column.cards.length}
        </span>
      </div>

      {/* Droppable for cards remains */}
      <Droppable droppableId={column._id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-grow flex-col gap-3 overflow-y-auto ${
              snapshot.isDraggingOver ? "bg-blue-100" : "" // Highlight
            }`}
          >
            {/* Cards are now mapped directly from Redux state (via props) */}
            {column.cards.map((card, index) => (
              <Card
                key={card._id}
                card={card}
                index={index} // Pass index for card D&D
                onDelete={handleCardDeleted}
                onUpdate={setEditingCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => setCreateModalOpen(true)}
        className="mt-4 w-full rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        + Add Card
      </button>

      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCardCreated={handleCardCreated} // Pass updated handler
      />
      {editingCard && (
        <EditCardModal
          isOpen={true}
          onClose={() => setEditingCard(null)}
          card={editingCard}
          onCardUpdated={handleCardUpdated} // Pass updated handler
        />
      )}
    </div>
  );
};

export default Column;
