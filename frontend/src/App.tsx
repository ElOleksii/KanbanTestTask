import { useEffect, useState } from "react";
import Board from "./components/Board";
import "./index.css";
import axios from "axios";
import CreateBoard from "./components/CreateBord";
import type { BoardType } from "./types/types";
import Navbar from "./components/Navbar";

function App() {
  const [boardId, setBoardId] = useState("");
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [boardData, setBoardData] = useState<BoardType | null>({
    _id: "",
    name: "",
    columns: [],
  });

  useEffect(() => {
    const savedBoards = localStorage.getItem("boards");
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards));
    } else {
      axios.get("http://localhost:8000/api/boards").then((res) => {
        setBoards(res.data);
        localStorage.setItem("boards", JSON.stringify(res.data));
      });
    }
  }, []);

  const loadBoard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/boards/${boardId}`
      );
      setBoardData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectBoard = async (boardId: string) => {
    const res = await axios.get(`http://localhost:8000/api/boards/${boardId}`);
    setBoards(res.data);
  };

  return (
    <>
      <Navbar boards={boards} onSelectBoard={handleSelectBoard} />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <header className="w-full max-w-4xl flex justify-center gap-4 mb-6">
          <CreateBoard onBoardCreated={setBoardData} />
          <input
            className="border rounded-lg p-2 flex-1 max-w-sm focus:outline-none focus:ring-1"
            placeholder="Enter a board ID here..."
            type="text"
            onChange={(e) => setBoardId(e.target.value)}
          />
          <button
            className="cursor-pointer text-white rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 transition"
            onClick={loadBoard}
          >
            Load
          </button>
        </header>
        <Board board={boardData} />
      </div>
    </>
  );
}

export default App;
