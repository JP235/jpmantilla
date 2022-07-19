import React from "react";

import "./playGame.css";

import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { createGame, getGame, saveGame } from "../../api/game/gameAPI";
import { selectGameStatus } from "../../api/game/gameAPISlice";
import { getCanvasImageURI } from "../../common/canvas/getCanvasImage";

import {
	undoMove,
	redoMove,
	selectGame,
	selectBlocks,
	activeMovingBlock,
	selectPastMoves,
	selectFutureMoves,
	selectNumberOfMoves,
	selectCols,
	selectRows,
	selectSolved,
	startMovingBlock,
	stopMovingBlock,
	trackMove,
} from "./playGameSlice";

import BoardCanvas from "../../common/canvas/BoardCanvas";
import { getMousePosCanvas } from "../../common/canvas/getMousePosCanvas";
import { posToCoord } from "../../common/canvas/posToCoord";
import { OPENCODES } from "../../api/game/openGamesData";

function PlayGame() {
	const dispatch = useDispatch();
	const params = useParams();

	const game = useSelector(selectGame);
	const moves = useSelector(selectNumberOfMoves);
	const solved = useSelector(selectSolved);
	const status = useSelector(selectGameStatus);

	const cols = useSelector(selectCols);
	const rows = useSelector(selectRows);
	const blocks = useSelector(selectBlocks);
	const pastMoves = useSelector(selectPastMoves);
	const futureMoves = useSelector(selectFutureMoves);

	const movingBlock = useSelector(activeMovingBlock);

	const canvas = useRef(null);

	useEffect(() => {
		dispatch(getGame(params.gameCode));
	}, [dispatch, params.gameCode]);

	const startMove = useCallback((event) => {
		// console.log("startMove");
		const canvasPos = getMousePosCanvas(event.target, event);
		const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
		dispatch(startMovingBlock({ x, y }));
	}, [dispatch]);

	const track = useCallback(
		(event) => {
			// console.log("track");
			const canvasPos = getMousePosCanvas(event.target, event);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
			dispatch(trackMove(x, y));
		},
		[dispatch]
	);

	const endMove = useCallback((event) => {
		event.preventDefault();
		// console.log("endMove");
		dispatch(stopMovingBlock());
	}, [dispatch]);

	const startMoveRef = useRef(startMove);
	startMoveRef.current = startMove;
	const makeMoveRef = useRef(track);
	makeMoveRef.current = track;
	const endMoveRef = useRef(endMove);
	endMoveRef.current = endMove;

	useEffect(() => {
		if (solved) {
			startMoveRef.current = null;
			endMoveRef.current = null;
			makeMoveRef.current = null;
		}
	}, [solved]);

	useEffect(() => {
		if (status === "game loaded") {
			canvas.current = document.getElementById("playBoard");
			canvas.current.addEventListener("mousedown", startMoveRef.current);
			canvas.current.addEventListener(
				"touchstart",
				startMoveRef.current,
				{ passive: true }
			);
			canvas.current.addEventListener("mousemove", makeMoveRef.current);
			canvas.current.addEventListener("touchmove", makeMoveRef.current, {
				passive: true,
			});
			canvas.current.addEventListener("touchend", endMoveRef.current);
			canvas.current.addEventListener("mouseup", endMoveRef.current);
			canvas.current.addEventListener("mouseleave", endMoveRef.current);
			return () => {
				canvas.current.removeEventListener(
					"mousedown",
					startMoveRef.current
				);
				canvas.current.removeEventListener(
					"touchstart",
					startMoveRef.current
				);
				canvas.current.removeEventListener(
					"mouseup",
					endMoveRef.current
				);
				canvas.current.removeEventListener(
					"mousemove",
					makeMoveRef.current
				);
				canvas.current.removeEventListener(
					"mouseleave",
					endMoveRef.current
				);
				canvas.current.removeEventListener(
					"touchend",
					endMoveRef.current
				);
				canvas.current.removeEventListener(
					"touchmove",
					makeMoveRef.current
				);
			};
		}
	}, [status]);

	return (
		<>
			<div className="boards-container">
				<BoardCanvas
					rows={rows}
					cols={cols}
					blocks={blocks}
					id="playBoard"
				/>

				<BoardCanvas
					rows={rows}
					cols={cols}
					blocks={[
						{
							...blocks.find((bl) => bl.name === "GG"),
							x: game.win_block_x,
							y: game.win_block_y,
							color: "#c0ca33",
						},
					]}
					id="winBoard"
				/>

				<div className="game-buttons-container">
					<button
						className="btn-menu undo"
						type="button"
						disabled={
							!pastMoves || pastMoves.length === 0 ? true : false
						}
						onClick={() => dispatch(undoMove())}
					>
						Undo
					</button>
					{"  "}
					<button
						className="btn-menu redo"
						type="button"
						disabled={futureMoves.length > 0 ? false : true}
						onClick={() => dispatch(redoMove())}
					>
						Redo
					</button>
					<button
						className="btn-menu save"
						type="button"
						onClick={() => {
							const gameToSave = {
								...game,
								number_of_moves: moves,
								img_curr: getCanvasImageURI("playBoard"),
								img_win: getCanvasImageURI("winBoard"),
							};
							OPENCODES.includes(params.gameCode)
								? dispatch(createGame(gameToSave, blocks))
								: dispatch(
										saveGame(gameToSave, blocks, pastMoves)
								  );
						}}
					>
						{movingBlock ? "Save" : "Save Game"}
						{/* Save Game */}
					</button>
				</div>
			</div>
		</>
	);
}

export default PlayGame;
