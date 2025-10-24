import Board from "./components/Board";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-center gap-4 mb-6">
        <input
          className="border rounded-lg p-2 flex-1 max-w-sm focus:outline-none focus:ring-1"
          placeholder="Enter a board ID here..."
          type="text"
        />
        <button className="cursor-pointer text-white rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 transition">
          Load
        </button>
      </header>
      <Board />
    </div>
  );
}

export default App;
