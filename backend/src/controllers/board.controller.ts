import { Request, Response } from "express";
import Board from "../models/Board";
import Column from "../models/Column";
import mongoose from "mongoose";
import Card from "../models/Card";

export const getBoards = async (req: Request, res: Response) => {
  const boards = await Board.find();
  res.json(boards);
};

export const createBoard = async (req: Request, res: Response) => {
  try {
    const board = new Board({ name: req.body.name });
    const todo = await Column.create({ name: "ToDo" });
    const inProgress = await Column.create({ name: "InProgress" });
    const done = await Column.create({ name: "Done" });

    board.columns = [todo._id, inProgress._id, done._id];
    await board.save();

    const fullBoard = await Board.findById(board._id).populate({
      path: "columns",
      populate: { path: "cards" },
    });

    res.status(201).json(fullBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBoardById = async (req: Request, res: Response) => {
  const board = await Board.findById(req.params.id).populate({
    path: "columns",
    populate: { path: "cards" },
  });

  if (!board) return res.status(404).json({ message: "Board is not found" });
  res.json(board);
};

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const columnIds = board.columns;

    if (columnIds && columnIds.length > 0) {
      const columns = await Column.find({ _id: { $in: columnIds } });

      const cardIds = columns.flatMap((col) => col.cards);

      if (cardIds && cardIds.length > 0) {
        await Card.deleteMany({ _id: { $in: cardIds } });
      }

      await Column.deleteMany({ _id: { $in: columnIds } });
    }

    await Board.findByIdAndDelete(id);

    res.status(200).json({ message: "Board and all related content deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid board ID" });
    }

    if (!name) {
      return res.status(400).json({ message: "Board name is required" });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    ).populate({
      path: "columns",
      populate: { path: "cards" },
    });

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json(updatedBoard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBoardCardOrder = async (req: Request, res: Response) => {
  try {
    // Thunk `saveCardOrder` надсилає: { columns: [{ _id, cards: [id1, id2] }] }
    const { columns } = req.body;

    if (!Array.isArray(columns)) {
      return res
        .status(400)
        .json({ message: "Invalid payload: 'columns' array is required" });
    }

    const operations = columns.map((col: { _id: string; cards: string[] }) => ({
      updateOne: {
        filter: { _id: col._id },
        update: { $set: { cards: col.cards } },
      },
    }));

    await Column.bulkWrite(operations);

    res.status(200).json({ message: "Board card order updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
