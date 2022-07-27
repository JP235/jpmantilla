import { createSlice } from "@reduxjs/toolkit";
import { blockSample } from "../../common/canvas/constants";
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
	shownBlocks: [blockSample],

	winBlock: {},

	X0: null,
	Y0: null,
	// there is no touches array in event touchend, have to keep track of them
	Xcurr: null,
	Ycurr: null,

	takenCoords: [],
	coordsToBlocks: {},
	minumumEmptySpaces: 2,
	maxH: 2,
	maxL: 2,
	maxSizeBlock: null,

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
		changedStep: (state, action) => {
			state.step = action.payload;
			switch (state.step) {
				case 0:
					state.blocks = [];
					state.shownBlocks = [blockSample];
					state.winBlock = null;
					state.currentBlockName = 1;
					state.takenCoords = [];
					state.newBlock = null;
					break;
				case 1:
					state.shownBlocks = [...state.blocks];
					state.winBlock = {
						...state.blocks.find((b) => b.name === 1),
						name: "GG",
						color: "#c0ca33",
						id: 1,
					};
					break;
				case 2:
					state.shownBlocks = makeWinBoard(state);
					break;
				case 3:
					state.blocks = makeWinBoard(state, true);
					break;
				default:
					break;
			}
		},
		changedCols: (state, action) => {
			state.game.cols = Math.max(2, Math.min(9, action.payload));
			state.maxL = Math.floor(state.game.cols / 2);
			state.minumumEmptySpaces = Math.min(state.maxH, state.maxL);
		},
		changedRows: (state, action) => {
			state.game.rows = Math.max(2, Math.min(9, action.payload));
			state.maxH = Math.floor(state.game.rows / 2);
			state.minumumEmptySpaces = Math.min(state.maxH, state.maxL);
		},
		changedWinBlock: (state, action) => {
			state.winBlock = {
				...state.blocks.find(
					(b) => Number(b.name) === Number(action.payload)
				),
				name: "GG",
				id: action.payload,
				color: "#c0ca33",
			};
			state.shownBlocks = makeWinBoard(state);
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
				if (
					state.takenCoords.length + state.minumumEmptySpaces >=
					state.game.rows * state.game.cols
				)
					return;
				state.operation = "draw";
				state.X0 = x;
				state.Y0 = y;
				state.newBlock = {
					name: state.currentBlockName,
					id: state.currentBlockName,
					x: x,
					y: y,
					h: 1,
					l: 1,
				};
				state.shownBlocks = [...state.blocks, state.newBlock];
			} else if (state.step === 2) {
				state.winBlock = moveWinBlock(state, x, y);
				state.operation = "move";
			}
		},
		trackMove: (state, action) => {
			const { x, y } = action.payload;
			if (!isInBoard(state, x, y)) return;
			switch (state.operation) {
				case "draw":
					const nb = changeNewBlockXY(state, x, y);
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
					state.winBlock = moveWinBlock(state, x, y);
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
							id: 1,
						});
					state.currentBlockName += 1;
					if (
						state.newBlock.h === state.maxH &&
						state.newBlock.l === state.maxL
					) {
						state.maxSizeBlock = state.newBlock.name;
					}

					break;
				case "delete":
					if (
						state.coordsToBlocks[state.markedBlock] !==
						state.coordsToBlocks[strXY(state.Xcurr, state.Ycurr)] //at mouse up
					)
						return;
					const [bls, mxBl] = removedBlock(state);
					state.blocks = bls;
					state.maxSizeBlock = mxBl;
					state.currentBlockName -= 1;
					break;
				default:
					return;
			}

			state.shownBlocks = [...state.blocks];
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
			state.operation = null;
		},
	},
});

export const {
	changedStep,
	changedCols,
	changedRows,
	changedWinBlock,
	handleDownPlayBoard,
	trackMove,
	handleEnd,
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

export const prevStep = () => (dispatch, getState) => {
	dispatch(changedStep(getState().customGame.step - 1));
};
export const nextStep = () => (dispatch, getState) => {
	dispatch(changedStep(getState().customGame.step + 1));
};

const isInBoard = (state, x, y) => {
	return x >= 0 && x < state.game.rows && y >= 0 && y < state.game.cols;
};

function removedBlock(state) {
	let blHolder = [];
	let delName = state.coordsToBlocks[state.markedBlock];
	for (let b of state.blocks) {
		if (Number(b.name) > Number(delName)) {
			blHolder.push({
				...b,
				name: Number(b.name) - 1,
			});
		} else if (Number(b.name) < Number(delName)) {
			blHolder.push(b);
		}
	}
	if (state.maxSizeBlock > delName) {
		return [blHolder, state.maxSizeBlock - 1];
	} else if (state.maxSizeBlock === delName) {
		return [blHolder, null];
	}
	return [blHolder, state.maxSizeBlock];
}

function moveWinBlock(state, x, y) {
	return {
		...state.winBlock,
		x: Math.min(state.game.rows - state.winBlock.h, x),
		y: Math.min(state.game.cols - state.winBlock.l, y),
	};
}

const makeWinBoard = (state, shift) => {
	let shiftedNames = [];
	let notShiftedNames = [];

	for (let b of state.blocks) {
		if (Number(b.name) === Number(state.winBlock.id)) {
			const wb = { ...state.b, name: "GG", color: "#c0ca33" };
			shiftedNames.push(wb);
			notShiftedNames.push(wb);
		} else if (Number(b.name) > Number(state.winBlock.id)) {
			shiftedNames.push({
				...b,
				name: Number(b.name) - 1,
			});
			notShiftedNames.push(b);
		} else {
			shiftedNames.push(b);
			notShiftedNames.push(b);
		}
	}
	if (shift) return shiftedNames;
	else return notShiftedNames;
};
function changeNewBlockXY(state, x, y) {
	const newBlock = { ...state.newBlock };
	if (x <= state.X0) {
		newBlock.x = x;
		newBlock.h = Math.min(state.maxH, state.X0 - x + 1);
	} else {
		newBlock.h = Math.min(state.maxH, x - state.X0 + 1);
	}
	if (y <= state.Y0) {
		newBlock.y = y;
		newBlock.l = Math.min(state.maxL, state.Y0 - y + 1);
	} else {
		newBlock.l = Math.min(state.maxL, y - state.Y0 + 1);
	}
	const newBlockCoords = calcBlockCoords(newBlock);
	if (
		!state.takenCoords.some((coord) => newBlockCoords.includes(coord)) &&
		state.takenCoords.length +
			newBlockCoords.length +
			state.minumumEmptySpaces <=
			state.game.rows * state.game.cols
	) {
		if (
			state.maxSizeBlock &&
			newBlock.h === state.maxH &&
			newBlock.l === state.maxL
		)
			return false;

		return newBlock;
	}
	return false;
}

export default customGameSlice.reducer;
