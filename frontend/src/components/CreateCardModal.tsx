import { useState } from "react";
import axios from "axios";
import type { CardType } from "../types/types";
import Modal from "./Modal";

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: string;
  onCardCreated: (card: CardType) => void;
}

const CreateCardModal = ({
  isOpen,
  onClose,
  columnId,
  onCardCreated,
}: CreateCardModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/api/cards", {
        title,
        description,
        columnId,
      });

      onCardCreated(res.data);
      setTitle("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Card">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCardModal;
