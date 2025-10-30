import { useState } from "react";
import { useDispatch } from "react-redux";
import type { CardType, ColumnType } from "../types/types";
import Card from "./Card";
import CreateCardModal from "./CreateCardModal";
import EditCardModal from "./EditCardModal";
import { Droppable } from "@hello-pangea/dnd";
import { type AppDispatch } from "../store/store";
import { createCard, updateCard, deleteCard } from "../store/boardSlice";

interface ColumnProps {
  column: ColumnType;
  index: number;
}

const Column = ({ column }: ColumnProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

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

  const isEmpty = column.cards.length === 0;

  return (
    <div
      className={`flex w-72 flex-shrink-0 flex-col rounded-lg p-3 shadow-sm min-h-[20rem] transition 
      ${
        isEmpty
          ? "bg-gray-50 border-2 border-dashed border-gray-300"
          : "bg-gray-100"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{column.name}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-sm font-medium text-gray-600">
          {column.cards.length}
        </span>
      </div>

      <Droppable droppableId={column._id} type="CARD">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-grow flex-col gap-3 overflow-y-auto rounded-md p-1
              ${snapshot.isDraggingOver ? "bg-blue-100" : ""}
              ${isEmpty ? "items-center justify-center text-gray-400" : ""}`}
          >
            {isEmpty ? (
              <p className="text-sm italic select-none">No cards yet</p>
            ) : (
              column.cards.map((card, index) => (
                <Card
                  key={card._id}
                  card={card}
                  index={index}
                  onDelete={handleCardDeleted}
                  onUpdate={setEditingCard}
                />
              ))
            )}
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
        columnId={column._id}
        onCardCreated={(card) =>
          handleCardCreated(card.title, card.description)
        }
      />
      {editingCard && (
        <EditCardModal
          isOpen={true}
          onClose={() => setEditingCard(null)}
          card={editingCard}
          onCardUpdated={handleCardUpdated}
        />
      )}
    </div>
  );
};

export default Column;
