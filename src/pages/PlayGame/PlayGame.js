import React from "react";

import "./playGame.css";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { createGame, getGame, saveGame } from "../../api/game/gameAPI";
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

function PlayGame(props) {
	const dispatch = useDispatch();
	const gameCode = useParams();

	const game = useSelector(selectGame);
	const moves = useSelector(selectNumberOfMoves);
	const solved = useSelector(selectSolved);

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

	useEffect(() => {
		if (props.gameCode) {
			dispatch(getGame(props.gameCode));
		} else {
			dispatch(getGame(gameCode.gameCode));
		}
	}, [dispatch, props, gameCode.gameCode]);

	const handleMouseDown = useCallback(
		(event) => {
			if (!event.target.className.includes("board")) return;

			const canvasPos = getMousePosCanvas(event.target, event);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
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
		if (activeMovingBlock) {
			const canvasPos = getMousePosCanvas(event.target, event);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);

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
          dispatch(isGameWon())
				}
			}
		}
	};

	const handleMouseUp = useCallback((event) => {
		setActiveMovingBlock(false);
		setTargetBlock(null);
		setDownX(null);
		setDownY(null);
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
		document.onmousedown = handleMouseDownRef.current;
		document.onmouseup = handleMouseUpRef.current;
		return () => {
			document.onmousedown = null;
			document.onmouseup = null;
		};
	}, [handleMouseDown, handleMouseUp]);

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
      </div>
			<button
				className="btn btn-primary"
				onClick={() => {
					const gameToSave = {
						...game,
						number_of_moves: moves,
						img_curr: getCanvasImageURI("playBoard"),
						img_win: getCanvasImageURI("winBoard"),
					};
					gameCode.gameCode !== "classic"
						? dispatch(saveGame(gameToSave, blocks, pastMoves))
						: dispatch(createGame(gameToSave, blocks));
				}}
			>
				Save Game
			</button>
			<button
				className="btn btn-primary"
				disabled={!pastMoves || pastMoves.length === 0 ? true : false}
				onClick={() => dispatch(undoMove())}
			>
				Undo
			</button>
			<button
				className="btn btn-primary"
				disabled={futureMoves.length > 0 ? false : true}
				onClick={() => dispatch(redoMove())}
			>
				Redo
			</button>
		</>
	);
}

export default PlayGame;
