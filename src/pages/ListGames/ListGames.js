import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectBoards, selectIsLoading } from "../../api/boards/boardsAPISlice";
import { getBoards } from "../../api/boards/boardsAPI";
import { BoardPics } from "../../common/canvas/BoardPics";

function ListGames() {
	const boards = useSelector(selectBoards);
	const isLoading = useSelector(selectIsLoading);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getBoards());
	}, [dispatch]);

	return (
		<ul>
			{isLoading === true ? (
				<div> "Loading..."</div>
			) : (
				boards.map((board) => (

						<li key={board.code}  style={{ listStyleType: "none" }}>
							<BoardPics board={board} />
							{"   "}
						</li>
						
				))
			)}
			{boards.length === 0 && <div>"No boards found"</div>}
		</ul>
	);
}

export default ListGames;
