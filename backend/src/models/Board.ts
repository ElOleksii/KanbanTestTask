import mongoose, { model, Schema, Types } from "mongoose";

interface IBoard {
  name: string;
  columns: Types.ObjectId[];
}

const BoardSchema = new Schema<IBoard>({
  name: { type: String, required: true },
  columns: [{ type: Schema.Types.ObjectId, ref: "Column" }],
});

const Board = mongoose.model<IBoard>("Board", BoardSchema);
export default Board;
