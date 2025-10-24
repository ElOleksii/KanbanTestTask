import Card from "./Card";

interface ColumnProps {
  title: string;
}

const Column = ({ title }: ColumnProps) => {
  const exmplCards = [
    {
      title: "Read",
      description: "Read my favourite book",
    },
    {
      title: "Learn something new",
      description: "Learn what you like",
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <h2 className="text-3xl">{title}</h2>
      <div className="bg-amber-200 flex flex-col p-4 gap-4">
        {exmplCards.map((card, idx) => (
          <Card title={card.title} description={card.description} key={idx} />
        ))}
        <button className="cursor-pointer py-4 hover:bg-amber-500 transition">
          Add
        </button>
      </div>
    </div>
  );
};

export default Column;
