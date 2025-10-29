import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import type { BoardType } from "../types/types";

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board: BoardType;
  onBoardUpdated: (updatedBoard: BoardType) => void;
}

const EditBoardModal = ({
  isOpen,
  onClose,
  board,
  onBoardUpdated,
}: EditBoardModalProps) => {
  const [name, setName] = useState(board.name);

  useEffect(() => {
    setName(board.name);
  }, [board]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/api/boards/${board._id}`,
        { name }
      );
      onBoardUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update board:", error);
      alert("Couldn't able to update board");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Board">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Board Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBoardModal;
