import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  updateBoard,
  updateBoardCardOrder,
} from "../controllers/board.controller.js";

const router = Router();

router.get("/", getBoards);
router.post("/", createBoard);
router.get("/:id", getBoardById);
router.put("/:id", updateBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.put("/:id/update-order", updateBoardCardOrder);

export default router;
