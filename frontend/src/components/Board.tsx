import type { BoardType } from "../types/types";
import Column from "./Column";

interface BoardProps {
  board: BoardType;
}

const Board = ({ board }: BoardProps) => {
  return (
    <div className="flex w-full max-w-6xl bg-white gap-4 overflow-x-auto">
      {board.columns?.map((col) => {
        return <Column key={col._id} column={col} />;
      })}
    </div>
  );
};

export default Board;
