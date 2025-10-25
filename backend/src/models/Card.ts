import mongoose, { model, Schema, Types } from "mongoose";

interface ICard {
  title: string;
  description: string;
}

const CardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  description: { type: String },
});

const Card = mongoose.model<ICard>("Card", CardSchema);
export default Card;
