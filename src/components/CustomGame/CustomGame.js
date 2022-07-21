import React from "react";

import "./CustomGame.css";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { blockSample } from "../../common/canvas/constants";
import { calcBlockCoords, strXY } from "../../common/utils/TupOpps";
import { getPointCoords } from "../../common/canvas/getFromCanvas";
import BoardCanvas from "../../common/canvas/BoardCanvas";
// import BoardsDisplay from "../../common/canvas/BoardsDisplay";

import {
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
	markBlock,
	addBlock,
	removeBlock,
	placeWinBlock,
	selectStep,
	selectCols,
	selectRows,
	selectBlockName,
	selectTakenCoords,
	selectCoordsToBlocks,
	selectDrawingBlock,
	selectMovingWinBlock,
	selectMarkedBlock,
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
	const coordsToBlocks = useSelector(selectCoordsToBlocks);

	const takenCoords = useSelector(selectTakenCoords);
	const winBlock = useSelector(selectWinBlock);

	const drawingBlock = useSelector(selectDrawingBlock);
	const movingWinBlock = useSelector(selectMovingWinBlock);
	const markedBlock = useSelector(selectMarkedBlock);

	const shownBlocks = useSelector((state) => state.customGame.shownBlocks);
	
  const [blockX0, setBlockX0] = useState();
  const [blockY0, setBlockY0] = useState();
  
	const [newBlock, setNewBlock] = useState(null);
	const [nameShift, setNameShift] = useState([]);
	const [noNameShift, setNoNameShift] = useState([]);
	const [blockH, setBlockH] = useState();
	const [blockW, setBlockW] = useState();
	const [blockX, setBlockX] = useState();
	const [blockY, setBlockY] = useState();

	const canvas = useRef(null);

	const prevStepActions = () => {
		switch (step) {
			case 1:
				setNewBlock(null);
				setBlockH(0);
				break;
			case 2:
				// // setshowBlocks(blocks);
				break;
			case 3:
				// // setshowBlocks(noNameShift);
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
				// setshowBlocks(nameShift);
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
		// setshowBlocks(notShiftedNames);
	};

	// useEffect(() => {
	// 	setshowBlocks(blocks);
	// }, [blocks]);

	// Set newBlock when x,y,h,l change
	useEffect(() => {
    console.log("x,y,h,l change");
    if (blockH > 0 && blockW > 0) {
      console.log("blockH > 0 && blockW > 0");
			const nb = {
				name: blockName.toString().padStart(2, "0"),
				x: blockX,
				y: blockY,
				h: blockH,
				l: blockW,
			};
			// check if block is in free spaces
			if (
				!takenCoords.some((coord) =>
					calcBlockCoords(nb).includes(coord)
				)
			) {
        console.log(blockX, blockY, blockH, blockW)
				dispatch(changeNewBlock({blockX, blockY, blockH, blockW}));
			} else{
        console.log("block is taken");
      }
		}
	}, [takenCoords, blocks, blockName, blockH, blockW, blockX, blockY]);

	const handleStart = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		if (event.target.className.includes("setup-board")) {
			dispatch(handleDownPlayBoard({ x, y }));	
      console.log(step)
      setBlockH(1);
      setBlockW(1);
      setBlockX(x);
      setBlockY(y);
      setBlockX0(x);
      setBlockY0(y);
      
		} else if (event.target.className.includes("win-board")) {
			dispatch(startMovingWinBlock({ x, y }));
		}
	};

	const track = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		if (event.type === "mousemove" && !drawingBlock) return;

		if (x < 0 || x >= rows || y < 0 || y >= cols) {
			return;
		}
		if (x <= blockX0) {
      setBlockX(x);
			setBlockH(blockX0 - x + 1);
		} else {
      setBlockX(blockX0);
			setBlockH(x - blockX0 + 1);
		}
		if (y <= blockY0) {
      setBlockY(y);
			setBlockW(blockY0 - y + 1);
		} else {
      setBlockY(blockY0);
			setBlockW(y - blockY0 + 1);
		}
    console.log(x, y);
		// // setshowBlocks([...blocks, newBlock]);
		// }
		// else if (movingWinBlock) {
		// 	if (winBlock.x !== x || winBlock.y !== y) {
		// 		dispatch(placeWinBlock({ x, y }));
		// 	}
		// }
	};

	const handleUp = (event) => {
		dispatch(handleEnd());
		// dispatch(stopDrawing())
		// dispatch(stopMovingWinBlock());
		// console.log("markedBlock",markedBlock);
		// if (drawingBlock) {

		// }
		// if (markedBlock) {
		//   const [x, y] = getPointCoords(event.target, event);

		// 	if (markedBlock !== strXY(x, y)) {
		//     console.log(newBlock)
		//     dispatch(addBlock(newBlock));
		// 		return;
		// 	}
		// 	step === 1 && dispatch(removeBlock(coordsToBlocks[markedBlock]));
		// 	step === 2 && makeWinBoard(coordsToBlocks[markedBlock]);
		// // }

		// dispatch(markBlock(null));
	};

	const handleDownRef = useRef(handleStart);
	const trackRef = useRef(track);
	const handleUpRef = useRef(handleUp);

	useEffect(() => {
		canvas.current = document.getElementById("playBoard");

		canvas.current.addEventListener("mousedown", handleDownRef.current);
		canvas.current.addEventListener("touchstart", handleDownRef.current, {
			passive: true,
		});
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
			canvas.current.removeEventListener("mouseup", handleUpRef.current);
			canvas.current.removeEventListener("mousemove", trackRef.current);
			canvas.current.removeEventListener(
				"touchstart",
				handleDownRef.current
			);
			canvas.current.removeEventListener("touchend", handleUpRef.current);
			canvas.current.removeEventListener("touchmove", trackRef.current);
		};
	}, []);

	// const menuStepZero = (
	// 	<div className="step zero">
	// 		<label>Rows </label>
	// 		<input
	// 			value={rows}
	// 			id="rows"
	// 			type="number"
	// 			min="2"
	// 			max="10"
	// 			onChange={(e) => dispatch(changeRows(e.target.value))}
	// 		/>
	// 		<label> Cols </label>
	// 		<input
	// 			value={cols}
	// 			id="cols"
	// 			type="number"
	// 			min="2"
	// 			max="10"
	// 			onChange={(e) => dispatch(changeCols(e.target.value))}
	// 		/>
	// 	</div>
	// );
	// const menuStepOne = (
	// 	<div className="step one">
	// 		<input
	// 			id="undo"
	// 			type="button"
	// 			onClick={() => dispatch(removeLast())}
	// 			value="Delete Last Block"
	// 			disabled={blockName === 1 ? true : false}
	// 		/>
	// 	</div>
	// );
	// const menuStepTwo = (
	// 	<div className="step two">
	// 		<label>Pick Win-Block: </label>
	// 		<select
	// 			id="Win-Block"
	// 			onChange={(e) => makeWinBoard(e.target.value)}
	// 		>
	// 			{blocks.map((bl) => (
	// 				<option key={bl.name}>{bl.name}</option>
	// 			))}
	// 		</select>
	// 	</div>
	// );
	// const menuStepThree = (
	// 	<div className="step three">
	// 		<button
	// 			key={"save button"}
	// 			onClick={() => {
	// 				const game = {
	// 					cols: cols,
	// 					rows: rows,
	// 					img_curr: getCanvasImageURI("playBoard"),
	// 					img_win: getCanvasImageURI("winBoard"),
	// 					win_block_x: winBlock.x,
	// 					win_block_y: winBlock.y,
	// 				};
	// 				dispatch(createGame(game, nameShift));
	// 			}}
	// 		>
	// 			SAVE GAME
	// 		</button>
	// 	</div>
	// );

	return (
		<div className="boards-container">
			{/* <BoardsDisplay
				blocks={step === 0 ? [blockSample] : showBlocks}
				game={game}
				type="create"
			/> */}
			<div>
				{blockX0} - {blockY0}
			</div>
			<br />
			{/* {drawingBlock && "drawing-block"} */}
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={step === 0 ? [blockSample] : shownBlocks}
				onMouseMove={track}
				className="setup-board"
				id="playBoard"
			/>
			&nbsp;
			{/* {(step === 2) | (step === 3) ? ( */}
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={[winBlock]}
				onMouseMove={track}
				className="win-board"
				id="winBoard"
			/>
			{/* ) : null} */}
			<div className="menu step-actions">
				{/* {step === 0 && menuStepZero}
				{step === 1 && menuStepOne}
				{step === 2 && menuStepTwo}
				{step === 3 && menuStepThree} */}
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
