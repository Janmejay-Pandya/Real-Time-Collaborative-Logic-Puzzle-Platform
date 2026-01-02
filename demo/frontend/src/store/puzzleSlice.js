import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roomId: null,
  grid: [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  pending: {},   
};

const puzzleSlice = createSlice({
  name: "puzzle",
  initialState,
  reducers: {
    joinRoom(state, action) {
      state.roomId = action.payload;
    },
    loadBoard(state, action) {
      state.grid = action.payload;
    },
    optimisticMove(state, action) {
      const {row, col, value} = action.payload;
      state.pending[`${row}-${col}`] = state.grid[row][col];
      state.grid[row][col] = value;
    },
    rollbackMove(state, action) {
      const {row, col} = action.payload;
      const prev = state.pending[`${row}-${col}`];
      state.grid[row][col] = prev;
      delete state.pending[`${row}-${col}`];
    },
    applyMove(state, action) {
      state.grid = action.payload;
      state.pending = {};
    },
    resetBoard(state) {
      state.grid = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ];
      state.pending = {};
    }
  }
});

export const { joinRoom, loadBoard, optimisticMove, rollbackMove, applyMove, resetBoard } = puzzleSlice.actions;
export default puzzleSlice.reducer;
