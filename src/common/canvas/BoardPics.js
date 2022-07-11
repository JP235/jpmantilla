import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { deleteBoard } from "../../api/boards/boardsAPI";
import { OPENCODES } from "../../api/game/openGamesData";

import {
	BORDERMARGIN,
	BLOCKMARGIN,
	BLOCKSIDE,
	BOARDLISTSCALE,
} from "./constants";

export const BoardPics = (props) => {
	const dispatch = useDispatch();

	const { board, ...rest } = props;
	const { rows, cols, img_curr, img_win } = board;
	const height =
		(rows * BLOCKSIDE + (rows - 1) * BLOCKMARGIN + 2 * BORDERMARGIN) *
		BOARDLISTSCALE;
	const width =
		(cols * BLOCKSIDE + (cols - 1) * BLOCKMARGIN + 2 * BORDERMARGIN) *
		BOARDLISTSCALE;

	const [clicked, setClicked] = useState(false);
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	if (clicked) {
		return <Navigate to={`/game/${board.code}`} />;
	}
	return (
		<div className="board-list-element" {...rest}>
			<img
				src={img_curr}
				height={height}
				width={width}
				alt="board"
				onClick={() => setClicked(true)}
			/>
			{"   "}
			<img
				src={img_win}
				height={height}
				width={width}
				alt="board"
				onClick={() => setClicked(true)}
			/>
			{!OPENCODES.includes(board.code) && <button className="button delete" onClick={() => setConfirmingDelete(true)}>
				{" "}
				Delete Game{" "}
			</button>}
			{confirmingDelete && (
				<div>
					Are you sure you want to delete this game?{" "}
					<button className="button delete" onClick={() => dispatch(deleteBoard(board.code))}>
						Yes
					</button>
					<button className="button delete" onClick={() => setConfirmingDelete(false)}>
						No
					</button>
				</div>
			)}
		</div>
	);
};
