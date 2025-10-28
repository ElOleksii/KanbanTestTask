import { Router } from "express";
import {
  createCard,
  deleteCard,
  getCardById,
  updateCard,
} from "../controllers/card.controller";

const router = Router();

router.post("/", createCard);
router.get("/:id", getCardById);
router.delete("/:id", deleteCard);
router.put("/:id", updateCard);

export default router;
