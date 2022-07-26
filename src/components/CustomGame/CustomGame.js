import React from "react";

import "./CustomGame.css";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { blockSample } from "../../common/canvas/constants";
import { getPointCoords } from "../../common/canvas/getFromCanvas";
import BoardsDisplay from "../../common/canvas/BoardsDisplay";
import UpDownControl from "../../common/up-down";

import {
	prevStep,
	nextStep,
	changeCols,
	changeRows,
	handleDownPlayBoard,
	trackMove,
	handleEnd,
	placeWinBlock,
	selectStep,
	selectCols,
	selectRows,
	selectBlocks,
	selectWinBlock,
} from "./customGameSlice";
import { createGame } from "../../api/game/gameAPI";

function CustomGame() {
	const dispatch = useDispatch();

	const game = useSelector((state) => state.customGame.game);
	const shownBlocks = useSelector((state) => state.customGame.shownBlocks);

	const step = useSelector(selectStep);
	const cols = useSelector(selectCols);
	const rows = useSelector(selectRows);
	const blocks = useSelector(selectBlocks);

	const winBlock = useSelector(selectWinBlock);

	const [nameShift, setNameShift] = useState([]);
	// const [noNameShift, setNoNameShift] = useState([]);

	const canvas = useRef(null);

	const prevStepActions = () => {
		switch (step) {
			case 1:
				// setNewBlock(null);
				// setBlockH(0);
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
				// makeWinBoard("01");
				break;
			case 2:
				// setshowBlocks(nameShift);
				break;
			default:
		}
		dispatch(nextStep());
	};

	const handleStart = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		dispatch(handleDownPlayBoard({ x, y }));
		// if (event.target.className.includes("setup-board")) {

		// } else if (event.target.className.includes("win-board")) {
		// 	// dispatch(startMovingWinBlock({ x, y }));
		// }
	};

	const track = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		dispatch(trackMove({ x, y }));
	};

	const handleUp = (event) => {
		event.preventDefault();
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
	const menuStepZero = (
		<div className="step-zero">
			<div className="rows-control">
				<UpDownControl
					name="Rows"
					value={rows}
					onUp={() => dispatch(changeRows(rows + 1))}
					onDown={() => dispatch(changeRows(rows - 1))}
				/>
			</div>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<div className="cols-control">
				<UpDownControl
					name="Columns"
					value={cols}
					onUp={() => dispatch(changeCols(cols + 1))}
					onDown={() => dispatch(changeCols(cols - 1))}
				/>
			</div>
		</div>
	);
	const menuStepOne = (
		<>
			<p className="step-one">
				{" "}
				Click anywhere to start drawing a block.{" "}
			</p>
			<p className="step-one"> Click a block to delete it. </p>
		</>
	);
	const menuStepTwo = (
		<div className="step-two">
			<label>Pick Win-Block: </label>
			<select
				id="Win-Block"
				// onChange={(e) => makeWinBoard(e.target.value)}
			>
				{blocks.map((bl) => (
					<option key={bl.name}>{bl.name}</option>
				))}
			</select>
		</div>
	);
	const menuStepThree = (
		<div className="step-three">
			<button
				key={"save button"}
				onClick={() => {
					const game = {
						cols: cols,
						rows: rows,
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
	const handleDownRef = useRef(handleStart);
	const trackRef = useRef(track);
	const handleUpRef = useRef(handleUp);

	useEffect(() => {
		const handleDownValue = handleDownRef.current;
		const trackValue = trackRef.current;
		const handleUpValue = handleUpRef.current;

		canvas.current = document.getElementById("playBoard");

		canvas.current.addEventListener("mousedown", handleDownValue);
		canvas.current.addEventListener("touchstart", handleDownValue, {
			passive: true,
		});
		canvas.current.addEventListener("mousemove", trackValue);
		canvas.current.addEventListener("touchmove", trackValue, {
			passive: true,
		});
		canvas.current.addEventListener("touchend", handleUpValue);
		canvas.current.addEventListener("mouseup", handleUpValue);
		document.addEventListener("mouseup", handleUpValue);

		return () => {
			canvas.current.removeEventListener("mousedown", handleDownValue);
			canvas.current.removeEventListener("mousemove", trackValue);
			canvas.current.removeEventListener("touchstart", handleDownValue);
			canvas.current.removeEventListener("touchend", handleUpValue);
			canvas.current.removeEventListener("touchmove", trackValue);
			canvas.current.removeEventListener("mouseup", handleUpValue);
			document.removeEventListener("mouseup", handleUpValue);
		};
	}, []);

	return (
		<>
			<div className="buttons-prev-next">
				<button
					className="btn-menu step-control"
					type="button"
					onClick={() => prevStepActions()}
					disabled={step === 0 ? true : false}
				>
					Prev
				</button>
				&nbsp;
				<button
					className="btn-menu step-control"
					type="button"
					onClick={() => nextStepActions()}
					disabled={
						(step === 3) | (step === 1 && blocks.length < 1)
							? true
							: false
					}
				>
					Next
				</button>
			</div>
			<div className="container-boards">
				<div className="boards-display">
					<BoardsDisplay
						blocks={step === 0 ? [blockSample] : shownBlocks}
						game={game}
						winBlock={winBlock}
						type="create"
					/>
				</div>
			</div>
			<div className="step-menus">
				{step === 0 && menuStepZero}
				{step === 1 && menuStepOne}
				{step === 2 && menuStepTwo}
				{step === 3 && menuStepThree}
			</div>
		</>
	);
}

export default CustomGame;
