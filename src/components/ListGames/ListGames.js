import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectBoards } from "../../api/boards/boardsAPISlice";
import { getBoards } from "../../api/boards/boardsAPI";
import { BoardPics } from "../../common/canvas/BoardPics";

function ListGames(props) {
	const dispatch = useDispatch();
	const boards = useSelector(selectBoards);

	useEffect(() => {
		dispatch(getBoards(props.open));
   		// eslint-disable-next-line
	}, []);

	return (
		<ul>
			{boards.map((board) => (
				<li key={board.code} style={{ listStyleType: "none" }}>
					<BoardPics board={board} />
					{"   "}
				</li>
			))}
			{boards.length === 0 && <div>"No boards found"</div>}
		</ul>
	);
}

export default ListGames;
