import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards, fetchBoard, setBoards } from "./store/boardSlice";
import { type RootState, type AppDispatch } from "./store/store";
import { v4 as uuidv4 } from "uuid";

import Board from "./components/Board";
import Navbar from "./components/Navbar";
import CreateBoard from "./components/CreateBord";
import "./index.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, currentBoard, loading } = useSelector(
    (state: RootState) => state.board
  );

  const [boardId, setBoardId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    let savedUserId = localStorage.getItem("userId");
    if (!savedUserId) {
      savedUserId = uuidv4();
      localStorage.setItem("userId", savedUserId);
    }
    setUserId(savedUserId);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const savedBoards = localStorage.getItem(`boards_user_${userId}`);
    if (savedBoards) {
      dispatch(setBoards(JSON.parse(savedBoards)));
    } else {
      dispatch(fetchBoards());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && boards.length > 0) {
      localStorage.setItem(`boards_user_${userId}`, JSON.stringify(boards));
    }
  }, [boards, userId]);

  const loadBoard = () => {
    if (boardId) {
      dispatch(fetchBoard(boardId));
    }
  };

  const handleSelectBoard = (boardId: string) => {
    dispatch(fetchBoard(boardId));
  };

  const handleBoardCreated = (board: { _id: string }) => {
    dispatch(fetchBoards());
    dispatch(fetchBoard(board._id));
  };

  return (
    <>
      <Navbar
        currentBoard={currentBoard}
        boards={boards}
        onSelectBoard={handleSelectBoard}
      />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6">
        <header className="w-full max-w-4xl flex flex-col sm:flex-row sm:justify-center sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="w-full sm:w-auto">
            <CreateBoard onBoardCreated={handleBoardCreated} />
          </div>

          <input
            className="w-full sm:flex-1 border rounded-lg p-2 max-w-full sm:max-w-sm focus:outline-none focus:ring-1"
            placeholder="Enter a board ID here..."
            type="text"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
          />
          <button
            className="w-full sm:w-auto cursor-pointer text-white rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 transition disabled:opacity-50"
            onClick={loadBoard}
            disabled={loading || !boardId}
          >
            {loading ? "Loading..." : "Load"}
          </button>
        </header>

        {currentBoard ? (
          <Board board={currentBoard} />
        ) : (
          <p className="text-gray-500 mt-10">Choose or load a board</p>
        )}
      </div>
    </>
  );
}

export default App;
