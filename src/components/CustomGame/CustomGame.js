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
	removeLast,
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
	const blockName = useSelector((state) => state.customGame.currentBlockName);

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
				// setNewBlock(null);
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
			<div className="cols-control">
				<UpDownControl
					name="cols"
					value={cols}
					onUp={() => dispatch(changeCols(cols + 1))}
					onDown={() => dispatch(changeCols(cols - 1))}
				/>
			</div>
			<div className="rows-control">
				<UpDownControl
					name="rows"
					value={rows}
					onUp={() => dispatch(changeRows(rows + 1))}
					onDown={() => dispatch(changeRows(rows - 1))}
				/>
			</div>
		</div>
	);
	const menuStepOne = (
		<input
			id="undo"
			type="button"
			className="btn-menu step-one"
			onClick={() => dispatch(removeLast())}
			value="Delete Last Block"
			disabled={blockName === 1 ? true : false}
		/>
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
			<div className="container-create">
				<BoardsDisplay
					blocks={step === 0 ? [blockSample] : shownBlocks}
					game={game}
					winBlock={winBlock}
					type="create"
				/>
			</div>
			<div className="step-menu">
				{step === 0 && menuStepZero}
				{step === 1 && menuStepOne}
				{step === 2 && menuStepTwo}
				{step === 3 && menuStepThree}
			</div>
		</>
	);
}

export default CustomGame;
