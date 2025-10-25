// components/Navbar.tsx
import { useEffect, useState } from "react";
import type { BoardType } from "../types/types";

interface NavbarProps {
  boards: BoardType[];
  onSelectBoard: (boardId: string) => void;
}

const Navbar = ({ boards, onSelectBoard }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedBoards = JSON.parse(localStorage.getItem("boards") || "[]");
    if (savedBoards.length === 0 && boards.length > 0) {
      localStorage.setItem("boards", JSON.stringify(boards));
    } else if (boards.length > 0) {
      localStorage.setItem("boards", JSON.stringify(boards));
    }
  }, [boards]);

  return (
    <nav className=" px-6 py-3 flex items-center justify-between">
      <div className="relative ml-auto">
        <button
          onClick={() => setOpen(!open)}
          className="bg-gray-700 text-white  px-3 py-2 rounded hover:bg-gray-600"
        >
          History
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded w-48">
            {boards.length === 0 ? (
              <p className="p-3 text-gray-500 text-sm">No boards yet</p>
            ) : (
              boards.map((board) => (
                <button
                  key={board._id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    onSelectBoard(board._id);
                    setOpen(false);
                  }}
                >
                  {board.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
