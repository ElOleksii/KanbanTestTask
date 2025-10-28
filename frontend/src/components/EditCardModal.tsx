import { useState, useEffect } from "react";
import axios from "axios";
import type { CardType } from "../types/types";
// Припускаємо, що у вас є компонент Modal, аналогічний до EditBoardModal
import Modal from "./Modal";

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardType;
  onCardUpdated: (updatedCard: CardType) => void;
}

const EditCardModal = ({
  isOpen,
  onClose,
  card,
  onCardUpdated,
}: EditCardModalProps) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  // Синхронізуємо стан, якщо відкривається модальне вікно для іншої картки
  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
  }, [card, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/cards/${card._id}`,
        { title, description }
      );
      onCardUpdated(response.data); // Відправляємо оновлену картку батьку
      onClose(); // Закриваємо модальне вікно
    } catch (error) {
      console.error("Failed to update card:", error);
      alert("Не вдалося оновити картку.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редагувати картку">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Заголовок
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Опис
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Скасувати
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Зберегти
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCardModal;
