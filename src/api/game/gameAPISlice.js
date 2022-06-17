import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	status: "idle",
};

export const gameAPISlice = createSlice({
	name: "game",
	initialState,
	reducers: {
		loadingGame: (state) => {
			state.status = "loading game";
		},
		gameLoaded: (state, action) => {
			state.status = "game loaded";
		},
    playingGame: (state) => {
      state.status = "playing game";
    },
		savingGame: (state) => {
			state.status = "saving game";
		},
		gameSaved: (state) => {
			state.status = "playing game";
		},
	},
});

export const selectGameStatus = (state) => state.gameAPI.status;
export const selectGame = (state) => state.gameAPI.game;

export const { loadingGame, gameLoaded, savingGame, gameSaved, playingGame } =
	gameAPISlice.actions;

export default gameAPISlice.reducer;
