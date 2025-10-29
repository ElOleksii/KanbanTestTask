import { Request, Response } from "express";
import mongoose from "mongoose";
import Card from "../models/Card.js";
import Column from "../models/Column.js";

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
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid card ID" });
    }

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    await Column.findOneAndUpdate({ cards: id }, { $pull: { cards: id } });

    res.status(200).json({ message: "Card deleted successfully" });
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

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid card ID" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(updatedCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
