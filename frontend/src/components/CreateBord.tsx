import { useState } from "react";
import axios from "axios";
import type { BoardType } from "../types/types";

interface CreateBoardProps {
  onBoardCreated: (board: BoardType) => void;
}

const CreateBoard = ({ onBoardCreated }: CreateBoardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!boardName.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/api/boards", {
        name: boardName,
      });
      onBoardCreated(res.data);
      setBoardName("");
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error creating board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="w-full sm:w-auto cursor-pointer text-white rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600 transition disabled:opacity-50"
        onClick={() => setIsOpen(true)}
      >
        Create Board
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded p-6 w-80">
            <h2 className="text-lg font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              className="border p-2 w-full rounded mb-4"
              placeholder="Board Name"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBoard;
