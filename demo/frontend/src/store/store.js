import { configureStore } from "@reduxjs/toolkit";
import puzzleReducer from "./puzzleSlice";

const store = configureStore({
  reducer: {
    puzzle: puzzleReducer,
  },
});

export default store;
