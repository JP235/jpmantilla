import React from "react";

import "./CustomGame.css";

import {  useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPointCoords } from "../../common/canvas/getFromCanvas";
import BoardsDisplay from "../../common/canvas/BoardsDisplay";
import IncreaseDecreaseArrows from "../../common/IncreaseDecreaseArrows";
import PrevNextButtons from "../../common/PrevNextButton";

import {
	prevStep,
	nextStep,
	changedCols,
	changedRows,
  changedWinBlock,
	handleDownPlayBoard,
	trackMove,
	handleEnd,
	selectStep,
	selectCols,
	selectRows,
	selectBlocks,
	selectWinBlock,
} from "./customGameSlice";
// import { createGame } from "../../api/game/gameAPI";
import BoardCanvas from "../../common/canvas/BoardCanvas";

function CustomGame() {
	const dispatch = useDispatch();

	const game = useSelector((state) => state.customGame.game);
	const shownBlocks = useSelector((state) => state.customGame.shownBlocks);

	const step = useSelector(selectStep);
	const cols = useSelector(selectCols);
	const rows = useSelector(selectRows);
	const blocks = useSelector(selectBlocks);

	const winBlock = useSelector(selectWinBlock);

	// const [nameShift, setNameShift] = useState([]);
	// const [noNameShift, setNoNameShift] = useState([]);

	const canvas = useRef(null);

	const handleStart = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		dispatch(handleDownPlayBoard({ x, y }));
	};
	const track = (event) => {
		const [x, y] = getPointCoords(event.target, event);
		dispatch(trackMove({ x, y }));
	};
	const handleUp = (event) => {
		event.preventDefault();
		dispatch(handleEnd());
	};

	const menuStepZero = (
		<div className="step-zero">
			<div className="rows-control">
				<IncreaseDecreaseArrows
					name="Rows"
					value={rows}
					onUp={() => dispatch(changedRows(rows + 1))}
					onDown={() => dispatch(changedRows(rows - 1))}
				/>
			</div>
			&nbsp;&nbsp;&nbsp;&nbsp;
			<div className="cols-control">
				<IncreaseDecreaseArrows
					name="Columns"
					direction="leftright"
					value={cols}
					onUp={() => dispatch(changedCols(cols + 1))}
					onDown={() => dispatch(changedCols(cols - 1))}
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
				onChange={(e) => dispatch(changedWinBlock(e.target.value))}
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
					// const game = {
					// 	cols: cols,
					// 	rows: rows,
					// 	win_block_x: winBlock.x,
					// 	win_block_y: winBlock.y,
					// };
					// dispatch(createGame(game, nameShift));
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
		if (step === 0) return;

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
		canvas.current.addEventListener("mauseleave", handleUpValue);

		return () => {
			canvas.current.removeEventListener("mousedown", handleDownValue);
			canvas.current.removeEventListener("mousemove", trackValue);
			canvas.current.removeEventListener("touchstart", handleDownValue);
			canvas.current.removeEventListener("touchend", handleUpValue);
			canvas.current.removeEventListener("touchmove", trackValue);
			canvas.current.removeEventListener("mouseup", handleUpValue);
			canvas.current.removeEventListener("mauseleave", handleUpValue);
		};
	}, [step]);

	return (
		<>
			<PrevNextButtons
				prevFunction={() => dispatch(prevStep())}
				nextFunction={() => dispatch(nextStep())}
				disablePrev={step === 0}
				disableNext={step === 3 || (step === 1 && blocks.length < 2)}
			/>
			<div className="container-boards-custom">
				<div className="boards-display">
					{(step === 0 || step === 1) && (
						<BoardCanvas
							blocks={shownBlocks}
							rows={rows}
							cols={cols}
							id="playBoard"
						/>
					)}
					{(step === 2 || step === 3) && (
						<BoardsDisplay
							blocks={step === 2 ? shownBlocks : blocks}
							game={game}
							winBlock={winBlock}
							type="create"
							invert={step === 2}
						/>
					)}
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
