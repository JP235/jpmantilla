import { createSlice } from "@reduxjs/toolkit";
import {
	calcBoardCoords,
	calcBlockCoords,
	calcCoordsToBlocks,
	strXY,
} from "../../common/utils/TupOpps";

const initialState = {
	game: {
		cols: 4,
		rows: 5,
		win_block_x: null,
		win_block_y: null,
	},

	blocks: [],

	step: 0,
	currentBlockName: 1,
	shownBlocks: [],

	winBlock: {},

	X0: null,
	Y0: null,
  // there is no touches array in event touchend
  Xcurr: null,
  Ycurr: null,

	takenCoords: [],
	coordsToBlocks: {},

	operation: null,

	markedBlock: null,

	newBlock: {
		name: null,
		x: null,
		y: null,
		h: null,
		w: null,
	},
};

export const customGameSlice = createSlice({
	name: "customGame",
	initialState,
	reducers: {
		prevStep: (state) => {
			state.step -= 1;
			if (state.step === 0) {
				state.blocks = [];
				state.winBlock = null;
				state.currentBlockName = 1;
				state.takenCoords = [];
			}
		},
		nextStep: (state) => {
			state.step += 1;
		},
		changeCols: (state, action) => {
			state.game.cols = Math.max(2, Math.min(9, action.payload));
		},
		changeRows: (state, action) => {
			state.game.rows = Math.max(2, Math.min(9, action.payload));
		},
		handleDownPlayBoard: (state, action) => {
			const { x, y } = action.payload;
			if (!isInBoard(state, x, y)) return;
			if (state.step === 1) {
				if (state.takenCoords.includes(strXY(x, y))) {
					state.markedBlock = strXY(x, y);
          state.Xcurr = x;
          state.Ycurr = y;
					state.operation = "delete";
					return;
				}
				state.operation = "draw";
				state.X0 = x;
				state.Y0 = y;
				state.newBlock = {
					name: state.currentBlockName.toString().padStart(2, "0"),
					x: x,
					y: y,
					h: 1,
					l: 1,
				};
				state.shownBlocks = [...state.blocks, state.newBlock];
			}
		},
		trackMove: (state, action) => {
			const { x, y } = action.payload;
			if (!isInBoard(state, x, y)) return;
			switch (state.operation) {
				case "draw":
					const nb = changeBlock(state, x, y);
					if (nb) {
						state.newBlock = nb;
						state.shownBlocks = [...state.blocks, nb];
					}
					break;
				case "delete":
          state.Xcurr = x;
          state.Ycurr = y;
					break;
				case "move":
					break;
				default:
					break;
			}
		},

		handleEnd(state) {
			switch (state.operation) {
				case "draw":
					state.blocks = [...state.blocks, state.newBlock];
					state.currentBlockName === 1 &&
						(state.winBlock = {
							...state.newBlock,
							name: "GG",
							color: "#c0ca33",
						});
					state.currentBlockName += 1;
					break;
				case "move":
					break;
				case "delete":
					if (
						state.coordsToBlocks[state.markedBlock] !==
						state.coordsToBlocks[strXY(state.Xcurr, state.Ycurr)]
					)
						return;
					state.blocks = removedBlock(
						state,
						state.coordsToBlocks[state.markedBlock]
					);
					state.currentBlockName -= 1;
          
					break;
				default:
					break;
			}

			state.shownBlocks = [...state.blocks];
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
			state.operation = null;
		},
		removeLast(state) {
			state.blocks = removedBlock(state, state.blockName - 1);
			state.currentBlockName -= 1;
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
			state.shownBlocks = [...state.blocks];
		},

		// addBlock: (state) => {
		// 	state.blocks = [...state.blocks, state.newBlock];
		// 	state.currentBlockName === 1 &&
		// 		(state.winBlock = {
		// 			...state.newBlock,
		// 			name: "GG",
		// 			color: "#c0ca33",
		// 		});
		// 	state.currentBlockName += 1;

		// 	state.takenCoords = calcBoardCoords(state.blocks);
		// 	state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		// },

		placeWinBlock: (state, action) => {
			const { x, y } = action.payload;

			if (action.payload.name) {
				state.winBlock = action.payload;
			} else if (
				x >= 0 &&
				x < state.game.rows &&
				y >= 0 &&
				y < state.game.cols
			) {
				if (
					x + state.winBlock.h - 1 < state.game.rows &&
					y + state.winBlock.l - 1 < state.game.cols
				) {
					state.winBlock = { ...state.winBlock, x, y };
				} else {
					const new_x = Math.min(
						state.game.rows - state.winBlock.h,
						x
					);
					const new_y = Math.min(
						state.game.cols - state.winBlock.l,
						y
					);
					state.winBlock = { ...state.winBlock, x: new_x, y: new_y };
				}
			}
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
	},
});

export const {
	prevStep,
	nextStep,
	changeCols,
	changeRows,
	handleDownPlayBoard,
	trackMove,
	handleEnd,
	changeNewBlock,
	markBlock,
	addBlock,
	removeBlock,
  removeLast,
	placeWinBlock,
} = customGameSlice.actions;

export const selectStep = (state) => state.customGame.step;
export const selectCols = (state) => state.customGame.game.cols;
export const selectRows = (state) => state.customGame.game.rows;
export const selectBlockName = (state) => state.customGame.currentBlockName;
export const selectBlocks = (state) => state.customGame.blocks;
export const selectTakenCoords = (state) => state.customGame.takenCoords;
export const selectCoordsToBlocks = (state) => state.customGame.coordsToBlocks;
export const selectMarkedBlock = (state) => state.customGame.markedBlock;
export const selectWinBlock = (state) => state.customGame.winBlock;

const isInBoard = (state, x, y) => {
	return x >= 0 && x < state.game.rows && y >= 0 && y < state.game.cols;
};

function removedBlock(state, delName) {
	let blHolder = [];
	for (let b of state.blocks) {
		if (Number(b.name) > Number(delName)) {
			blHolder.push({
				...b,
				name: (Number(b.name) - 1).toString().padStart(2, "0"),
			});
		} else if (Number(b.name) < Number(delName)) {
			blHolder.push(b);
		}
	}
	return blHolder;
}

function changeBlock(state, x, y) {
	const newBlock = { ...state.newBlock };
	if (x <= state.X0) {
		newBlock.h = state.X0 - x + 1;
		newBlock.x = x;
	} else {
		newBlock.h = x - state.X0 + 1;
	}
	if (y <= state.Y0) {
		newBlock.l = state.Y0 - y + 1;
		newBlock.y = y;
	} else {
		newBlock.l = y - state.Y0 + 1;
	}
	if (
		!state.takenCoords.some((coord) =>
			calcBlockCoords(newBlock).includes(coord)
		)
	) {
		return newBlock;
	}
	return false;
}

export default customGameSlice.reducer;
