import { createSlice } from "@reduxjs/toolkit";
import {
	calcBoardCoords,
	calcCoordsToBlocks,
} from "../../common/utils/TupOpps";

const initialState = {
	step: 1,

	rows: 5,
	cols: 4,

	blockName: 1,
	winBlock: null,

	blocks: [],
	takenCoords: [],
	coordsToBlocks: {},
  drawingBlock: false,
  movingWinBlock: false,
  markedBlock: null,
};

export const customGameSlice = createSlice({
	name: "customGame",
	initialState,
	reducers: {
    prevStep: (state) => {
      state.step -= 1;
      switch (state.step) {
        case 0:
          state.blocks = [];
          state.winBlock = null;
          state.blockName = 1;
          state.takenCoords = [];
          break;
        default:
          break;
      }
    },
    nextStep: (state) => {
      state.step += 1;
    },
		changeCols: (state, action) => {
			state.cols = action.payload < 1 ? 1 : action.payload > 10 ? 10 : action.payload;
		},
		changeRows: (state, action) => {
			state.rows = action.payload < 1 ? 1 : action.payload > 10 ? 10 : action.payload;
		},
    startDrawing: (state) => {
      state.drawingBlock = true;
    },
    stopDrawing: (state) => {
      state.drawingBlock = false;
    },
    startMovingWinBlock: (state) => {
      state.movingWinBlock = true;
    },
    stopMovingWinBlock: (state) => {
      state.movingWinBlock = false;
    }, 
    markBlock: (state, action) => {
      state.markedBlock = action.payload;
    },
    // unmarkBlock: (state) => {
    //   state.markedBlock = null;
    // },
		addBlock: (state, action) => {
			state.blocks = [...state.blocks, action.payload];
			state.blockName === 1 &&
				(state.winBlock = {
					...action.payload,
					name: "GG",
					color: "#c0ca33",
				});
			state.blockName += 1;

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
			state.blockName -= 1;
			state.blocks = blHolder;
			state.takenCoords = calcBoardCoords(state.blocks);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
		placeWinBlock: (state, action) => {
			const x = action.payload.x;
			const y = action.payload.y;
			if (action.payload.name) {
				state.winBlock = action.payload;
			} else if (x >= 0 && x < state.rows && y >= 0 && y < state.cols) {
				if (
					x + state.winBlock.h - 1 < state.rows &&
					y + state.winBlock.l - 1 < state.cols
				) {
					state.winBlock = { ...state.winBlock, x, y };
				} else {
					const new_x = Math.min(state.rows - state.winBlock.h, x);
					const new_y = Math.min(state.cols - state.winBlock.l, y);
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
  startDrawing,
  stopDrawing,
  startMovingWinBlock,
  stopMovingWinBlock,
  markBlock,
  // unmarkBlock,
  addBlock,
  removeBlock,
  placeWinBlock,
} = customGameSlice.actions;

export const selectStep = (state) => state.customGame.step;
export const selectCols = (state) => state.customGame.cols;
export const selectRows = (state) => state.customGame.rows;
export const selectBlockName = (state) => state.customGame.blockName;
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

export default customGameSlice.reducer;

