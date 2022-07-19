import { createSlice } from "@reduxjs/toolkit";
import { strXY } from "../../common/utils/TupOpps";

import {
	calcCoordsToBlocks,
	calcBlockCoords,
} from "../../common/utils/TupOpps";

const initialState = {
	game: {},
	cols: null,
	rows: null,

	auto_solved: null,
	solved: null,
	number_of_moves: null,

	win_block_x: null,
	win_block_y: null,

	movingBlock: false,
	downX: null,
	downY: null,

	coordsToBlocks: {},
	blocks: [],
	pastMoves: [],
	futureMoves: [],
};

export const playGameSlice = createSlice({
	name: "playGame",
	initialState,
	reducers: {
		startPlaying: (state, action) => {
			state.blocks = action.payload.blocks;
			state.game = action.payload.game;
			state.cols = action.payload.game.cols;
			state.rows = action.payload.game.rows;
			state.pastMoves = action.payload.moves;
			state.number_of_moves = action.payload.game.number_of_moves;
			state.solved = action.payload.game.solved;
			state.win_block_x = action.payload.game.win_block_x;
			state.win_block_y = action.payload.game.win_block_y;
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
		markSolved: (state, action) => {
			state.solved = true;
			state.blocks = action.payload;
		},
		startMovingBlock: (state, action) => {
			state.movingBlock = true;
			state.downX = action.payload.x;
			state.downY = action.payload.y;
		},
		trackMovingBlock: (state, action) => {},
		stopMovingBlock: (state) => {
			state.movingBlock = false;
			state.downX = null;
			state.downY = null;
		},
		undoMove: (state) => {
			const move = state.pastMoves.pop();

			const targetBlock = move.targetBlock;
			const deltX = -move.deltX;
			const deltY = -move.deltY;

			state.futureMoves.push(move);
			state.number_of_moves -= 1;

			state.blocks = changeBlockPos(
				targetBlock,
				deltX,
				deltY,
				state.blocks
			);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
		redoMove: (state) => {
			const move = state.futureMoves.pop();
			const targetBlock = move.targetBlock;
			const deltX = move.deltX;
			const deltY = move.deltY;

			state.pastMoves.push(move);
			state.number_of_moves += 1;

			state.blocks = changeBlockPos(
				targetBlock,
				deltX,
				deltY,
				state.blocks
			);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
		moveBlock: (state, action) => {
			let { targetBlock, deltX, deltY } = action.payload;
			let lastMove = state.pastMoves[state.pastMoves.length - 1];
			let nextMove = state.futureMoves[state.futureMoves.length - 1];
			if (
				lastMove &&
				lastMove.targetBlock === targetBlock &&
				lastMove.deltX === -deltX &&
				lastMove.deltY === -deltY
			) {
				state.futureMoves.push(state.pastMoves.pop());
				state.number_of_moves -= 1;
			} else if (
				nextMove &&
				nextMove.targetBlock === targetBlock &&
				nextMove.deltX === -deltX &&
				nextMove.deltY === -deltY
			) {
				state.pastMoves.push(state.futureMoves.pop());
				state.number_of_moves += 1;
			} else {
				state.pastMoves.push({
					targetBlock,
					deltX,
					deltY,
					game: state.game.id,
				});
				state.futureMoves = [];
				state.number_of_moves += 1;
			}
			state.blocks = changeBlockPos(
				targetBlock,
				deltX,
				deltY,
				state.blocks
			);
			state.coordsToBlocks = calcCoordsToBlocks(state.blocks);
		},
	},
});

export const {
	startPlaying,
	markSolved,
	startMovingBlock,
	stopMovingBlock,
	moveBlock,
	undoMove,
	redoMove,
} = playGameSlice.actions;

export const selectGame = (state) => state.playGame.game;
export const selectBlocks = (state) => state.playGame.blocks;
export const activeMovingBlock = (state) => state.playGame.movingBlock;
export const selectNumberOfMoves = (state) => state.playGame.number_of_moves;
export const selectSolved = (state) => state.playGame.solved;
export const selectTakenCoords = (state) => state.playGame.takenCoords;
export const selectCoordsToBlocks = (state) => state.playGame.coordsToBlocks;

export const selectMadeMove = (state) => state.playGame.madeMove;

export const selectPastMoves = (state) => state.playGame.pastMoves;
export const selectFutureMoves = (state) => state.playGame.futureMoves;

export const selectGameCode = (state) => state.playGame.gameCode;
export const selectCols = (state) => state.playGame.cols;
export const selectRows = (state) => state.playGame.rows;
export const selectAutoSolved = (state) => state.playGame.auto_solved;

export default playGameSlice.reducer;

function changeBlockPos(targetBlock, deltX, deltY, blocks) {
	const b = blocks.find((b) => b.name === targetBlock);
	b.x += deltX;
	b.y += deltY;
	blocks = [...blocks.filter((b) => b.name !== targetBlock), b];
	return blocks;
}

export const trackMove = (x, y) => (dispatch, getState) => {
	const { downX, downY, coordsToBlocks } = getState().playGame;
	const deltX = x - downX;
	const deltY = y - downY;

	if (
		(deltX === 0 && Math.abs(deltY) === 1) ||
		(Math.abs(deltX) === 1 && deltY === 0)
	) {
		if (
			coordsToBlocks[strXY(downX, downY)] &&
			dispatch(
				isLegalMove(coordsToBlocks[strXY(downX, downY)], deltX, deltY)
			)
		) {
			dispatch(startMovingBlock({ x, y }));
			dispatch(isGameWon());
		}
	}
};

export const isLegalMove =
	(targetBlock, deltX, deltY) => (dispatch, getState) => {
		// Check that it moves to an empty space, without overlapping with other blocks,
		// or moving out of bounds and move the block

		const { blocks, coordsToBlocks, rows, cols } = getState().playGame;

		const block = blocks.find((b) => b.name === targetBlock);
		const coordsAfterMove = calcBlockCoords({
			...block,
			x: block.x + deltX,
			y: block.y + deltY,
		});

		if (
			coordsAfterMove.some((c) => !coordsToBlocks[c]) &&
			coordsAfterMove.every(
				(c) => !coordsToBlocks[c] || coordsToBlocks[c] === block.name
			) &&
			coordsAfterMove.every((c) => {
				let crds = c.split(",");
				return (
					crds[0] >= 0 &&
					crds[1] >= 0 &&
					crds[0] < rows &&
					crds[1] < cols
				);
			})
		) {
			dispatch(moveBlock({ targetBlock, deltX, deltY }));
			return true;
		}
	};

export const isGameWon = () => (dispatch, getState) => {
	const blocks = getState().playGame.blocks;
	const win_block_x = getState().playGame.win_block_x;
	const win_block_y = getState().playGame.win_block_y;
	const gg = blocks.find((b) => b.name === "GG");
	if (gg.x === win_block_x && gg.y === win_block_y) {
		alert("YOU WIN!");
		let blocksWon = [];
		for (let b of blocks) {
			blocksWon.push({ ...b, color: "green" });
		}
		dispatch(markSolved(blocksWon));
		dispatch(stopMovingBlock());
	}
};
