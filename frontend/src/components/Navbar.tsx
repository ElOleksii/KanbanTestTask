import { useState } from "react";
import type { BoardType } from "../types/types";
import { deleteBoard, updateBoard } from "../store/boardSlice";
import { type AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditBoardModal from "./EditBoardModal";

interface NavbarProps {
  boards: BoardType[];
  currentBoard: BoardType | null;
  onSelectBoard: (boardId: string) => void;
}

const Navbar = ({ boards, currentBoard, onSelectBoard }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = (boardId: string) => {
    if (
      window.confirm(
        "Ви впевнені, що хочете видалити цю дошку? Це видалить всі її колонки та картки."
      )
    ) {
      dispatch(deleteBoard(boardId));
    }
  };

  const handleUpdate = (updatedBoard: BoardType) => {
    dispatch(updateBoard({ id: updatedBoard._id, name: updatedBoard.name }));
    setIsEditModalOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between  bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {currentBoard ? (
            <>
              <span className="truncate text-lg font-semibold text-gray-800 sm:text-xl">
                {currentBoard.name}
              </span>
              <div className="hidden items-center gap-3 sm:flex">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex-shrink-0 text-gray-500 hover:text-blue-600"
                  title="Edit Board Name"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(currentBoard._id)}
                  className="flex-shrink-0 text-gray-500 hover:text-red-600"
                  title="Delete Board"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </>
          ) : (
            <div></div>
          )}
        </div>

        <div className="relative ml-4 flex-shrink-0">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-white hover:bg-gray-600"
          >
            <span className="text-sm sm:text-lg hidden sm:inline">History</span>
            <span className="text-sm sm:text-lg sm:hidden inline">Edit</span>
          </button>
          {open && (
            <div className="absolute right-0 top-12 z-10 mt-1 w-72 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {boards.length === 0 ? (
                <p className="p-3 text-sm text-gray-500">No boards yet</p>
              ) : (
                boards.map((board) => (
                  <button
                    key={board._id}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      onSelectBoard(board._id);
                      setOpen(false);
                    }}
                  >
                    {board.name}
                    <span className="block text-xs text-gray-400">
                      ID: {board._id}
                    </span>
                  </button>
                ))
              )}

              {currentBoard && (
                <div className="border-t border-gray-100 pt-1 sm:hidden">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaEdit />
                    Edit Board
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(currentBoard._id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FaTrash />
                    Delete Board
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      {currentBoard && (
        <EditBoardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          board={currentBoard}
          onBoardUpdated={handleUpdate}
        />
      )}
    </>
  );
};

export default Navbar;
