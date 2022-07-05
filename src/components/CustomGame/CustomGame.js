import React from "react";

import "./CustomGame.css";

import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { calcBlockCoords, strXY } from "../../common/utils/TupOpps";
import { posToCoord } from "../../common/canvas/posToCoord";
import { getMousePosCanvas as getMousePos } from "../../common/canvas/getMousePosCanvas";
import { getCanvasImageURI } from "../../common/canvas/getCanvasImage";
import BoardCanvas from "../../common/canvas/BoardCanvas";

import {
	prevStep,
	nextStep,
	addBlock,
	removeBlock,
	removeLast,
	placeWinBlock,
	changeCols,
	changeRows,
	selectStep,
	selectCols,
	selectRows,
	selectBlockName,
	selectTakenCoords,
	selectCoordsToBlocks,
	selectBlocks,
	selectWinBlock,
} from "./customGameSlice";
import { createGame } from "../../api/game/gameAPI";

function CustomGame() {
	const dispatch = useDispatch();

	const step = useSelector(selectStep);
	const cols = useSelector(selectCols);
	const rows = useSelector(selectRows);
	const blockName = useSelector(selectBlockName);
	const blocks = useSelector(selectBlocks);
	const [nameShift, setNameShift] = useState([]);
	const [noNameShift, setNoNameShift] = useState([]);

	const takenCoords = useSelector(selectTakenCoords);
	const winBlock = useSelector(selectWinBlock);

	const coordsToBlocks = useSelector(selectCoordsToBlocks);
	const [markedBlock, setMarkedBlock] = useState(null);

	const [newBlock, setNewBlock] = useState(null);
	const [showBlocks, setShowBlocks] = useState([]);

	const [blockH, setBlockH] = useState(0);
	const [blockW, setBlockW] = useState(0);
	const [blockX, setBlockX] = useState(0);
	const [blockY, setBlockY] = useState(0);
	const [blockX0, setBlockX0] = useState(0);
	const [blockY0, setBlockY0] = useState(0);

	const [drawingBlock, setDrawingBlock] = useState(false);
	const [movingWinBlock, setMovingWinBlock] = useState(false);

	const blockSample = {
		name: "XX",
		x: 0,
		y: 0,
		h: 1,
		l: 1,
	};

	const prevStepActions = () => {
		switch (step) {
			case 1:
				setNewBlock(null);
				setBlockH(0);
				break;
			case 2:
				setShowBlocks(blocks);
				break;
			case 3:
				setShowBlocks(noNameShift);
				break;
			default:
				break;
		}
		dispatch(prevStep());
	};
	const nextStepActions = () => {
		switch (step) {
			case 1:
				makeWinBoard("01");
				break;
			case 2:
				setShowBlocks(nameShift);
				break;
			default:
		}
		dispatch(nextStep());
	};

	const makeWinBoard = (winName) => {
		if (!winName) return;
		let shiftedNames = [];
		let notShiftedNames = [];
		let winBlock = {};

		for (let b of blocks) {
			if (b.name === winName) {
				winBlock = { ...b, name: "GG", color: "#c0ca33" };
				dispatch(placeWinBlock(winBlock));
				shiftedNames.push(winBlock);
				notShiftedNames.push(winBlock);
			} else if (Number(b.name) > Number(winName)) {
				shiftedNames.push({
					...b,
					name: (Number(b.name) - 1).toString().padStart(2, "0"),
				});
				notShiftedNames.push(b);
			} else {
				shiftedNames.push(b);
				notShiftedNames.push(b);
			}
		}
		setNameShift(shiftedNames);
		setNoNameShift(notShiftedNames);
		setShowBlocks(notShiftedNames);
	};

	useEffect(() => {
		setShowBlocks(blocks);
	}, [blocks]);

	// Set newBlock when x,y,h,l change
	useEffect(() => {
		if (blockH > 0 && blockW > 0) {
			const nb = {
				name: blockName.toString().padStart(2, "0"),
				x: blockX,
				y: blockY,
				h: blockH,
				l: blockW,
			};
			if (
				drawingBlock &&
				!takenCoords.some((v) => calcBlockCoords(nb).includes(v))
			) {
				setNewBlock(nb);
				setShowBlocks([...blocks, nb]);
			}
		}
	}, [
		drawingBlock,
		takenCoords,
		blocks,
		blockName,
		blockH,
		blockW,
		blockX,
		blockY,
	]);

	const startDrawingBlock = useCallback(
		(x, y) => {
			if (x < 0 || x >= rows || y < 0 || y >= cols) {
				return;
			}
			if (takenCoords.includes(strXY(x, y))) {
				setMarkedBlock(strXY(x, y));
				return;
			}
			setDrawingBlock(true);
			setBlockH(1);
			setBlockW(1);
			setBlockX(x);
			setBlockY(y);
			setBlockX0(x);
			setBlockY0(y);
		},
		[cols, rows, takenCoords]
	);

	const handleMouseDown = useCallback(
		(event) => {
			if (!event.target.className.includes("board")) {
				return;
			}
			const canvasPos = getMousePos(event.target, event);
			const [x, y] = posToCoord(canvasPos.x, canvasPos.y);

			if (event.target.className.includes("setup-board")) {
				step === 1 && startDrawingBlock(x, y);
				step === 2 && setMarkedBlock(strXY(x, y));
			} else if (
				event.target.className.includes("win-board") &&
				step === 2
			) {
				setMovingWinBlock(true);
				dispatch(placeWinBlock({ x, y }));
			}
		},
		[step, startDrawingBlock, dispatch]
	);

	const trackMouseOnBoard = (event) => {
		const canvasPos = getMousePos(event.target, event);
		const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
		if (drawingBlock) {
			if (x < 0 || x >= rows || y < 0 || y >= cols) {
				return;
			}
			if (x <= blockX0) {
				setBlockH(blockX0 - x + 1);
				setBlockX(x);
			} else {
				setBlockH(x - blockX0 + 1);
			}
			if (y <= blockY0) {
				setBlockW(blockY0 - y + 1);
				setBlockY(y);
			} else {
				setBlockW(y - blockY0 + 1);
			}
			setShowBlocks([...blocks, newBlock]);
		} else if (movingWinBlock) {
			if (winBlock.x !== x || winBlock.y !== y) {
				dispatch(placeWinBlock({ x, y }));
			}
		}
	};

	const handleMouseUp = useCallback(
		(event) => {
			setDrawingBlock(false);
			setMovingWinBlock(false);
			if (drawingBlock) {
				dispatch(addBlock(newBlock));
			}
			if (markedBlock) {
				const canvasPos = getMousePos(event.target, event);
				const [x, y] = posToCoord(canvasPos.x, canvasPos.y);
				if (markedBlock !== strXY(x, y)) {
					return;
				}
				step === 1 &&
					dispatch(removeBlock(coordsToBlocks[markedBlock]));
				step === 2 && makeWinBoard(coordsToBlocks[markedBlock]);
			}

			setMarkedBlock(null);
		},
		// eslint-disable-next-line
		[drawingBlock, dispatch, newBlock, markedBlock, coordsToBlocks, step]
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("touchstart", handleMouseDown, false);
    
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("touchend", handleMouseUp, false);

    document.addEventListener("touchmove", trackMouseOnBoard, false);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("touchstart", handleMouseDown, false);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("touchend", handleMouseUp, false);
      
			document.removeEventListener("touchmove", trackMouseOnBoard, false);
		};
	}, [handleMouseDown,trackMouseOnBoard, handleMouseUp]);

	const menuStepZero = (
		<div className="step zero">
			<label>Rows </label>
			<input
				value={rows}
				id="rows"
				type="number"
				min="2"
				max="10"
				onChange={(e) => dispatch(changeRows(e.target.value))}
			/>
			<label> Cols </label>
			<input
				value={cols}
				id="cols"
				type="number"
				min="2"
				max="10"
				onChange={(e) => dispatch(changeCols(e.target.value))}
			/>
		</div>
	);
	const menuStepOne = (
		<div className="step one">
			<input
				id="undo"
				type="button"
				onClick={() => dispatch(removeLast())}
				value="Delete Last Block"
				disabled={blockName === 1 ? true : false}
			/>
		</div>
	);
	const menuStepTwo = (
		<div className="step two">
			<label>Pick Win-Block: </label>
			<select
				id="Win-Block"
				onChange={(e) => makeWinBoard(e.target.value)}
			>
				{blocks.map((bl) => (
					<option key={bl.name}>{bl.name}</option>
				))}
			</select>
		</div>
	);
	const menuStepThree = (
		<div className="step three">
			<button
				key={"save button"}
				onClick={() => {
					const game = {
						cols: cols,
						rows: rows,
						img_curr: getCanvasImageURI("playBoard"),
						img_win: getCanvasImageURI("winBoard"),
						win_block_x: winBlock.x,
						win_block_y: winBlock.y,
					};
					dispatch(createGame(game, nameShift));
				}}
			>
				SAVE GAME
			</button>
		</div>
	);

	return (
		<div className="boards-container">
			<p> Custom Game Page </p>
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={step === 0 ? [blockSample] : showBlocks}
				onMouseMove={trackMouseOnBoard}
				className="setup-board"
				id="playBoard"
			/>

			{/* {(step === 2) | (step === 3) ? ( */}
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={[winBlock]}
				onMouseMove={trackMouseOnBoard}
				className="win-board"
				id="winBoard"
			/>
			{/* ) : null} */}
			<div className="menu step-actions">
				{step === 0 && menuStepZero}
				{step === 1 && menuStepOne}
				{step === 2 && menuStepTwo}
				{step === 3 && menuStepThree}
			</div>

			<div className="menu prev-next">
				<br />
				<br />
				<button
					type="button"
					onClick={() => prevStepActions()}
					disabled={step === 0 ? true : false}
				>
					{" "}
					Prev{" "}
				</button>
				<button
					type="button"
					onClick={() => nextStepActions()}
					disabled={
						(step === 3) | (step === 1 && blocks.length < 1)
							? true
							: false
					}
				>
					{" "}
					Next{" "}
				</button>
			</div>
		</div>
	);
}

export default CustomGame;
