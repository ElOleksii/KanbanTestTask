import type { BoardType } from "../types/types";
import Column from "./Column";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"; // 1. Прибрано Droppable
import { useDispatch } from "react-redux";
import { moveCard } from "../store/boardSlice"; // 2. Прибрано moveColumn
import { type AppDispatch } from "../store/store";

interface BoardProps {
  board: BoardType;
}

const Board = ({ board }: BoardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // 3. Прибрано логіку для "COLUMN"
    // Тепер обробляємо лише перетягування карток
    if (type === "CARD") {
      dispatch(moveCard(result));
      // TODO: Додайте API-виклик для збереження нового порядку карток
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex justify-center w-full h-full flex-grow gap-4 sm:gap-6 overflow-x-auto rounded-xl bg-slate-50 p-4 sm:p-6">
        {board.columns.map((col) => (
          <Column key={col._id} column={col} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default Board;
