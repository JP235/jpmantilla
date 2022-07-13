import React from "react";

import "./playGame.css";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { createGame, getGame, saveGame } from "../../api/game/gameAPI";
import { selectGameStatus } from "../../api/game/gameAPISlice";
import { getCanvasImageURI } from "../../common/canvas/getCanvasImage";

import {
	isLegalMove,
	isGameWon,
	undoMove,
	redoMove,
	selectGame,
	selectBlocks,
	selectPastMoves,
	selectFutureMoves,
	selectNumberOfMoves,
	selectCols,
	selectRows,
	selectCoordsToBlocks,
	selectSolved,
} from "./playGameSlice";

import BoardCanvas from "../../common/canvas/BoardCanvas";
import { strXY } from "../../common/utils/TupOpps";
import { getMousePosCanvas } from "../../common/canvas/getMousePosCanvas";
import { posToCoord } from "../../common/canvas/posToCoord";
import { OPENCODES } from "../../api/game/openGamesData";

function PlayGame(props) {
	const dispatch = useDispatch();
	const params = useParams();

	const game = useSelector(selectGame);
	const moves = useSelector(selectNumberOfMoves);
	const solved = useSelector(selectSolved);
	const status = useSelector(selectGameStatus);

	const cols = useSelector(selectCols);
	const rows = useSelector(selectRows);
	const blocks = useSelector(selectBlocks);
	const coordsToBlocks = useSelector(selectCoordsToBlocks);
	const pastMoves = useSelector(selectPastMoves);
	const futureMoves = useSelector(selectFutureMoves);

	const [activeMovingBlock, setActiveMovingBlock] = useState(false);
	const [targetBlock, setTargetBlock] = useState(null);

	const [downX, setDownX] = useState(null);
	const [downY, setDownY] = useState(null);

	const canvas = useRef(null);

	useEffect(() => {
		dispatch(getGame(params.gameCode));
	}, [dispatch, params.gameCode]);

	const handleMouseDown = useCallback(
		(event) => {
			event.preventDefault();
			// if (!event.target.className.includes("board")) return;
			console.log("handleMouseDown");

			const canvasPos = getMousePosCanvas(event.target, event);
			console.log(canvasPos);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
			console.log(x, y);

			setActiveMovingBlock(true);
			setDownX(x);
			setDownY(y);
			setTargetBlock(coordsToBlocks[strXY(x, y)]);
		},
		[
			coordsToBlocks,
			setActiveMovingBlock,
			setDownX,
			setDownY,
			setTargetBlock,
		]
	);

	const trackMouseOnBoard = (event) => {
		event.preventDefault();
		if (activeMovingBlock) {
      console.log("trackMouseOnBoard");
			const canvasPos = getMousePosCanvas(event.target, event);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
			console.log(x, y);

			const deltX = x - downX;
			const deltY = y - downY;

			if (
				(deltX === 0 && Math.abs(deltY) === 1) ||
				(Math.abs(deltX) === 1 && deltY === 0)
			) {
				if (
					targetBlock &&
					dispatch(isLegalMove(targetBlock, deltX, deltY))
				) {
					setDownX(x);
					setDownY(y);
					dispatch(isGameWon());
				}
			}
		}
	};

	const handleMouseUp = useCallback((event) => {
		event.preventDefault();

		setActiveMovingBlock(false);
		setTargetBlock(null);
		setDownX(null);
		setDownY(null);
		console.log("handleMouseUp");
		console.log("");
	}, []);

	const trackMouseOnBoardRef = useRef(trackMouseOnBoard);
	trackMouseOnBoardRef.current = trackMouseOnBoard;
	const handleMouseDownRef = useRef(handleMouseDown);
	handleMouseDownRef.current = handleMouseDown;
	const handleMouseUpRef = useRef(handleMouseUp);
	handleMouseUpRef.current = handleMouseUp;

	useEffect(() => {
		if (solved) {
			handleMouseDownRef.current = null;
			handleMouseUpRef.current = null;
			trackMouseOnBoardRef.current = null;
			setActiveMovingBlock(false);
		}
	}, [solved]);

	useEffect(() => {
		if (status === "game loaded") {
			canvas.current = document.getElementById("playBoard");
			canvas.current.addEventListener(
				"mousedown",
				handleMouseDownRef.current
			);
			canvas.current.addEventListener(
				"touchstart",
				handleMouseDownRef.current
			);
			canvas.current.addEventListener(
				"mousemove",
				trackMouseOnBoardRef.current
			);
			canvas.current.addEventListener(
				"touchmove",
				trackMouseOnBoardRef.current
			);
			canvas.current.addEventListener(
				"touchend",
				handleMouseUpRef.current
			);
			canvas.current.addEventListener(
				"mouseup",
				handleMouseUpRef.current
			);
			canvas.current.addEventListener(
				"mouseleave",
				handleMouseUpRef.current
			);
			return () => {
				canvas.current.removeEventListener(
					"mousedown",
					handleMouseDownRef.current
				);
				canvas.current.removeEventListener(
					"touchstart",
					handleMouseDownRef.current
				);
				canvas.current.removeEventListener(
					"mouseup",
					handleMouseUpRef.current
				);
				canvas.current.removeEventListener(
					"mousemove",
					trackMouseOnBoardRef.current
				);
				canvas.current.removeEventListener(
					"mouseleave",
					handleMouseUpRef.current
				);
				canvas.current.removeEventListener(
					"touchend",
					handleMouseUpRef.current
				);
				canvas.current.removeEventListener(
					"touchmove",
					trackMouseOnBoardRef.current
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
					onMouseMove={trackMouseOnBoardRef.current}
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
						Save Game
					</button>
				</div>
			</div>
		</>
	);
}

export default PlayGame;
