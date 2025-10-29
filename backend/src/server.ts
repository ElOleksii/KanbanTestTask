import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import boardRoutes from "./routes/board.routes.js";
import cardRoutes from "./routes/card.routes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/cards", cardRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (_, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Port is running on port ${PORT}`);
});
