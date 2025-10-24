import Column from "./Column";

const Board = () => {
  return (
    <div className="flex w-full max-w-6xl bg-white gap-4 overflow-x-auto">
      <Column title="Todo" />
      <Column title="In Progress" />
      <Column title="Done" />
    </div>
  );
};

export default Board;
