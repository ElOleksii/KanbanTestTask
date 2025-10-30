import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { BoardType, CardType } from "../types/types";
import axios from "axios";
import { type DropResult } from "@hello-pangea/dnd";

interface BoardState {
  boards: BoardType[];
  currentBoard: BoardType | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk("board/fetchBoards", async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/boards`);
  return res.data as BoardType[];
});

export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async (id: string) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/boards/${id}`
    );
    return res.data as BoardType;
  }
);

export const updateBoard = createAsyncThunk(
  "board/updateBoard",
  async (boardData: { id: string; name: string }) => {
    const { id, name } = boardData;
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/boards/${id}`,
      {
        name,
      }
    );
    return response.data;
  }
);

export const deleteBoard = createAsyncThunk(
  "board/deleteBoard",
  async (boardId: string) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/boards/${boardId}`);
    return boardId;
  }
);

export const createCard = createAsyncThunk(
  "board/createCard",
  async (
    {
      columnId,
      title,
      description,
    }: { columnId: string; title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cards`,
        {
          columnId,
          title,
          description,
        }
      );
      return { card: res.data as CardType, columnId };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to create card");
    }
  }
);

export const updateCard = createAsyncThunk(
  "board/updateCard",
  async (
    {
      cardId,
      title,
      description,
    }: { cardId: string; title: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cards/${cardId}`,
        {
          title,
          description,
        }
      );
      return res.data as CardType;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to update card");
    }
  }
);

export const deleteCard = createAsyncThunk(
  "board/deleteCard",
  async (
    { cardId, columnId }: { cardId: string; columnId: string },
    { rejectWithValue }
  ) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cards/${cardId}`);
      return { cardId, columnId };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to delete card");
    }
  }
);

const saveCardOrder = createAsyncThunk(
  "board/saveCardOrder",
  async (board: BoardType, { rejectWithValue }) => {
    try {
      const columnUpdates = board.columns.map((col) => ({
        _id: col._id,
        cards: col.cards.map((card) => card._id),
      }));

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/boards/${board._id}/update-order`,
        { columns: columnUpdates }
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Failed to save card order");
    }
  }
);

export const moveCard = createAsyncThunk(
  "board/moveCard",
  async (
    { result, board }: { result: DropResult; board: BoardType },
    { dispatch, rejectWithValue }
  ) => {
    const { source, destination } = result;
    if (!destination) return rejectWithValue("No destination");

    dispatch(moveCardOptimistic(result));

    const updatedBoard = JSON.parse(JSON.stringify(board)) as BoardType;
    const sourceCol = updatedBoard.columns.find(
      (col) => col._id === source.droppableId
    );
    const destCol = updatedBoard.columns.find(
      (col) => col._id === destination.droppableId
    );
    if (!sourceCol || !destCol) return rejectWithValue("Column not found");

    const [removedCard] = sourceCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, removedCard);

    try {
      await dispatch(saveCardOrder(updatedBoard));
    } catch (error) {
      console.log(error);
      return rejectWithValue("Failed to save move");
    }
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
    moveCardOptimistic: (state, action: PayloadAction<DropResult>) => {
      const { source, destination } = action.payload;
      if (!destination || !state.currentBoard) return;

      const sourceCol = state.currentBoard.columns.find(
        (col) => col._id === source.droppableId
      );
      const destCol = state.currentBoard.columns.find(
        (col) => col._id === destination.droppableId
      );

      if (!sourceCol || !destCol) return;

      const [removedCard] = sourceCol.cards.splice(source.index, 1);
      destCol.cards.splice(destination.index, 0, removedCard);
    },
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<BoardType[]>) => {
          state.loading = false;
          state.boards = action.payload;
        }
      )
      .addCase(
        fetchBoard.fulfilled,
        (state, action: PayloadAction<BoardType>) => {
          state.loading = false;
          state.currentBoard = action.payload;
        }
      )
      .addCase(
        updateBoard.fulfilled,
        (state, action: PayloadAction<BoardType>) => {
          state.loading = false;
          const updatedBoard = action.payload;
          if (
            state.currentBoard &&
            state.currentBoard._id === updatedBoard._id
          ) {
            state.currentBoard = updatedBoard;
          }
          state.boards = state.boards.map((board) =>
            board._id === updatedBoard._id ? updatedBoard : board
          );
        }
      )
      .addCase(
        deleteBoard.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          const deletedBoardId = action.payload;
          state.boards = state.boards.filter(
            (board) => board._id !== deletedBoardId
          );
          if (state.currentBoard && state.currentBoard._id === deletedBoardId) {
            state.currentBoard = null;
          }
        }
      )

      .addCase(
        createCard.fulfilled,
        (
          state,
          action: PayloadAction<{ card: CardType; columnId: string }>
        ) => {
          if (state.currentBoard) {
            const column = state.currentBoard.columns.find(
              (col) => col._id === action.payload.columnId
            );
            if (column) {
              column.cards.push(action.payload.card);
            }
          }
        }
      )
      .addCase(
        updateCard.fulfilled,
        (state, action: PayloadAction<CardType>) => {
          if (state.currentBoard) {
            for (const column of state.currentBoard.columns) {
              const cardIndex = column.cards.findIndex(
                (card) => card._id === action.payload._id
              );
              if (cardIndex !== -1) {
                column.cards[cardIndex] = action.payload;
                break;
              }
            }
          }
        }
      )
      .addCase(
        deleteCard.fulfilled,
        (
          state,
          action: PayloadAction<{ cardId: string; columnId: string }>
        ) => {
          if (state.currentBoard) {
            const column = state.currentBoard.columns.find(
              (col) => col._id === action.payload.columnId
            );
            if (column) {
              column.cards = column.cards.filter(
                (card) => card._id !== action.payload.cardId
              );
            }
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: PayloadAction<string | { message?: string }>) => {
          state.loading = false;
          if (typeof action.payload === "string") {
            state.error = action.payload;
          } else if (action.payload && action.payload.message) {
            state.error = action.payload.message;
          } else {
            state.error = "An unknown error occurred";
          }
          console.error("API Error:", state.error);
        }
      );
  },
});

export const { clearCurrentBoard, moveCardOptimistic, setBoards } =
  boardSlice.actions;
export default boardSlice.reducer;
