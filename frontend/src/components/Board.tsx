import type { BoardType } from "../types/types";
import Column from "./Column";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useDispatch } from "react-redux";
import { moveCard } from "../store/boardSlice";
import type { AppDispatch } from "../store/store";

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

    if (type === "CARD") {
      dispatch(moveCard({ result, board }));
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex justify-center w-full h-full flex-grow gap-4 sm:gap-6 overflow-x-auto rounded-xl bg-slate-50 p-4 sm:p-6"
          >
            {board.columns.map((col, index) => (
              <Column key={col._id} column={col} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
