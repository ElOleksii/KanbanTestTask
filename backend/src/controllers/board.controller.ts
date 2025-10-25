import { Request, Response } from "express";
import Board from "../models/Board";
import Column from "../models/Column";

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
