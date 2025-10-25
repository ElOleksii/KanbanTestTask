import { Request, Response } from "express";
import mongoose from "mongoose";
import Card from "../models/Card";
import Column from "../models/Column";

export const createCard = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(columnId)) {
      return res.status(400).json({ message: "Invalid column ID" });
    }

    const card = await Card.create({ title, description });

    await Column.findByIdAndUpdate(columnId, {
      $push: { cards: card._id },
    });

    res.status(201).json(card);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id, columnId } = req.params;

    if (
      !id ||
      !columnId ||
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(columnId)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    await Card.findByIdAndDelete(id);

    await Column.findByIdAndUpdate(columnId, {
      $pull: { cards: id },
    });

    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid card ID" });
    }

    const card = await Card.findById(id);

    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
