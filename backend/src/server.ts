import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import boardRoutes from "./routes/board.routes";
import cardRoutes from "./routes/card.routes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/cards", cardRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Port is running on port ${PORT}`);
});
