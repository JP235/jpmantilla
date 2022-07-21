import { createSlice } from "@reduxjs/toolkit";
import {
	calcBoardCoords,
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

	step: 1,
	currentBlockName: 1,
	shownBlocks: [],

	winBlock: null,

	takenCoords: [],
	coordsToBlocks: {},

	drawingBlock: false,
	movingWinBlock: false,
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
			if (!isInBoard(x, y)) return;
			if (state.step === 1) {
				if (state.takenCoords.includes(strXY(x, y))) {
					state.markedBlock = strXY(x, y);
					return;
				}
				state.drawingBlock = true;

			} else if (state.step === 2) {
				state.markedBlock = strXY(x, y);
			}
		},
    changeNewBlock : (state, action) => {
       console.log(action.payload);
      state.newBlock = action.payload;
      state.shownBlocks = [...state.blocks, state.newBlock];
    },
		handleEnd(state, action) {
      state.drawingBlock = false;
			return;
		},

		startDrawing: (state) => {
			state.drawingBlock = true;
		},
		stopDrawing: (state) => {
			state.drawingBlock = false;
		},
		startMovingWinBlock: (state,action) => {
			state.movingWinBlock = true;
      this.placeWinBlock(action.payload);
		},
		stopMovingWinBlock: (state) => {
			state.movingWinBlock = false;
		},
		markBlock: (state, action) => {
			state.markedBlock = action.payload;
		},
		addBlock: (state, action) => {
			state.blocks = [...state.blocks, action.payload];
			state.currentBlockName === 1 &&
				(state.winBlock = {
					...action.payload,
					name: "GG",
					color: "#c0ca33",
				});
			state.currentBlockName += 1;

			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
		removeBlock: (state, action) => {
			let blHolder = [];
			for (let b of state.blocks) {
				if (Number(b.name) > Number(action.payload)) {
					blHolder.push({
						...b,
						name: (Number(b.name) - 1).toString().padStart(2, "0"),
					});
				} else if (Number(b.name) < Number(action.payload)) {
					blHolder.push(b);
				}
			}
			state.currentBlockName -= 1;
			state.blocks = blHolder;
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
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
	handleEnd,
	changeNewBlock,
	startDrawing,
	stopDrawing,
	startMovingWinBlock,
	stopMovingWinBlock,
	markBlock,
	addBlock,
	removeBlock,
	placeWinBlock,
} = customGameSlice.actions;

export const selectStep = (state) => state.customGame.step;
export const selectCols = (state) => state.customGame.game.cols;
export const selectRows = (state) => state.customGame.game.rows;
export const selectBlockName = (state) => state.customGame.currentBlockName;
export const selectBlocks = (state) => state.customGame.blocks;
export const selectTakenCoords = (state) => state.customGame.takenCoords;
export const selectCoordsToBlocks = (state) => state.customGame.coordsToBlocks;
export const selectDrawingBlock = (state) => state.customGame.drawingBlock;
export const selectMovingWinBlock = (state) => state.customGame.movingWinBlock;
export const selectMarkedBlock = (state) => state.customGame.markedBlock;
export const selectWinBlock = (state) => state.customGame.winBlock;

export const removeLast = () => (dispatch, getState) => {
	const blockName = selectBlockName(getState());
	dispatch(removeBlock(blockName - 1));
};

const isInBoard = (x, y) => (getState) => {
	const { game } = getState().customGame;
	return x >= 0 && x < game.rows && y >= 0 && y < game.cols;
};

export default customGameSlice.reducer;
