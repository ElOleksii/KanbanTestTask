import { Router } from "express";
import {
  createCard,
  deleteCard,
  getCardById,
} from "../controllers/card.controller";

const router = Router();

router.post("/", createCard);
router.get("/:id", getCardById);
router.delete("/:id", deleteCard);

export default router;
