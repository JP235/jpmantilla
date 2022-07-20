import "./listGames.css";

import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectBoards } from "../../api/boards/boardsAPISlice";
import { getBoards } from "../../api/boards/boardsAPI";
import BoardsDisplay from "../../common/canvas/BoardsDisplay";
import { useNavigate } from "react-router-dom";

function ListGames(props) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const boards = useSelector(selectBoards);

	useEffect(() => {
		dispatch(getBoards(props.open));
	}, [dispatch,props.open]);

	return (
		<ul>
			{boards.map((board) => (
				<li
					key={board.game.code}
					style={{ listStyleType: "none" }}
					onClick={() => navigate(`/game/${board.game.code}`)}
          className="board-list-element"
				>
					<BoardsDisplay
						blocks={board.blocks}
						game={board.game}
						type="list"
					/>
					{"   "}
				</li>
			))}
			{boards.length === 0 && <div>"No boards found"</div>}
		</ul>
	);
}

export default ListGames;
