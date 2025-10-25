import mongoose, { model, Schema, Types } from "mongoose";

interface IColumn {
  name: "ToDo" | "InProgress" | "Done";
  cards: Types.ObjectId[];
}

const ColumnSchema = new Schema<IColumn>({
  name: { type: String, enum: ["ToDo", "InProgress", "Done"], required: true },
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
});

const Column = mongoose.model<IColumn>("Column", ColumnSchema);
export default Column;
