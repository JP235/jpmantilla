import React from "react";

import "./playGame.css";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { createGame, getGame, saveGame } from "../../api/game/gameAPI";
import { selectGameStatus } from "../../api/game/gameAPISlice";

import {
	undoMove,
	redoMove,
	selectGame,
	selectBlocks,
	selectPastMoves,
	selectFutureMoves,
	selectSolved,
	startMovingBlock,
	stopMovingBlock,
	trackMove,
} from "./playGameSlice";

import BoardsDisplay from "../../common/canvas/BoardsDisplay";
import { getMousePosCanvas } from "../../common/canvas/getMousePosCanvas";
import { posToCoord } from "../../common/canvas/posToCoord";
import { OPENCODES } from "../../api/game/openGamesData";

function PlayGame() {
	const dispatch = useDispatch();
	const params = useParams();

	const game = useSelector(selectGame);
	const solved = useSelector(selectSolved);
	const status = useSelector(selectGameStatus);

	const blocks = useSelector(selectBlocks);
	const pastMoves = useSelector(selectPastMoves);
	const futureMoves = useSelector(selectFutureMoves);

	const canvas = useRef(null);

	useEffect(() => {
		dispatch(getGame(params.gameCode));
	}, [dispatch, params.gameCode]);

	const handleDown = (event) => {
		// console.log("startMove");
		const canvasPos = getMousePosCanvas(event.target, event);
		const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
		dispatch(startMovingBlock({ x, y }));
	};

	const track = (event) => {
		// console.log("track");
		const canvasPos = getMousePosCanvas(event.target, event);
		const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
		dispatch(trackMove(x, y));
	};

	const handleUp = (event) => {
		event.preventDefault();
		// console.log("endMove");
		dispatch(stopMovingBlock());
	};

	const handleDownRef = useRef(handleDown);
	const trackRef = useRef(track);
	const handleUpRef = useRef(handleUp);

	useEffect(() => {
		if (solved) {
			handleDownRef.current = null;
			handleUpRef.current = null;
			trackRef.current = null;
			console.log("solved");
		}
	}, [solved]);

	useEffect(() => {
		if (status === "game loaded") {
			console.log("game loaded");
			canvas.current = document.getElementById("playBoard");

			canvas.current.addEventListener("mousedown", handleDownRef.current);
			canvas.current.addEventListener(
				"touchstart",
				handleDownRef.current,
				{ passive: true }
			);
			canvas.current.addEventListener("mousemove", trackRef.current);
			canvas.current.addEventListener("touchmove", trackRef.current, {
				passive: true,
			});
			canvas.current.addEventListener("touchend", handleUpRef.current);
			canvas.current.addEventListener("mouseup", handleUpRef.current);
			return () => {
				canvas.current.removeEventListener(
					"mousedown",
					handleDownRef.current
				);
				canvas.current.removeEventListener(
					"touchstart",
					handleDownRef.current
				);
				canvas.current.removeEventListener(
					"mouseup",
					handleUpRef.current
				);
				canvas.current.removeEventListener(
					"mousemove",
					trackRef.current
				);
				canvas.current.removeEventListener(
					"touchend",
					handleUpRef.current
				);
				canvas.current.removeEventListener(
					"touchmove",
					trackRef.current
				);
			};
		}
	}, [status, solved]);

	return (
		<>
			<div className="boards-container">
				<BoardsDisplay blocks={blocks} game={game} type="play" />

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
							OPENCODES.includes(params.gameCode)
								? dispatch(createGame(game, blocks))
								: dispatch(saveGame(game, blocks, pastMoves));
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
