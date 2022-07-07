import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoading: true,
	boards: [],
};

export const boardsSlice = createSlice({
	name: "boards",
	initialState,
	reducers: {
		loadingBoards: (state) => {
			state.isLoading = true;
		},
		boardsLoaded: (state, action) => {
			state.boards = action.payload;
			state.isLoading = false;
		},
		deletedGame: (state, action) => {
			state.boards = state.boards.filter(
				(board) => board.code !== action.payload
			);
		},
	},
});

// export const selectActiveBoard = (state) => state.boardsAPI.activeBoard;
export const selectBoards = (state) => state.boardsAPI.boards;
export const selectIsLoading = (state) => state.boardsAPI.isLoading;

export const {
	loadingBoards,
	boardsLoaded,
	// boardSelected,
	deletedGame,
} = boardsSlice.actions;

export default boardsSlice.reducer;
