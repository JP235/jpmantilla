import React, { useEffect } from "react";

import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading, selectBoards } from "../../api/boards/boardsAPISlice";
import { getBoards } from "../../api/boards/boardsAPI";

function RandomGame(props) {
	const dispatch = useDispatch();
	const loading = useSelector(selectIsLoading);
	const boards = useSelector(selectBoards);

	useEffect(() => {
		dispatch(getBoards(true));
	}, [dispatch]);

	if (!loading) {
		const board = boards[Math.floor(Math.random() * boards.length)];
    return <Navigate to={`/game/${board.code}`}/>
	}
  return <></>
}

export default RandomGame;
