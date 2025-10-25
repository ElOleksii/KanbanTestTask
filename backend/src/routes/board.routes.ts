import { Router } from "express";
import {
  createBoard,
  getBoardById,
  getBoards,
} from "../controllers/board.controller";

const router = Router();

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);

export default router;
