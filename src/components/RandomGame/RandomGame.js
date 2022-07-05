import React, { useEffect  } from "react";

import {  useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoading, selectBoards } from "../../api/boards/boardsAPISlice";
import { getBoards } from "../../api/boards/boardsAPI";

function RandomGame(props) {
	const dispatch = useDispatch();
	const loading = useSelector(selectIsLoading);
  const boards = useSelector(selectBoards);
  const navigate = useNavigate();

	useEffect(() => {
		dispatch(getBoards(true));
    	// eslint-disable-next-line
	}, []);

  if (!loading) {
    const board = boards[Math.floor(Math.random() * boards.length)];
    navigate(`/game/${board.code}`);
  }

	return <> </>;
}

export default RandomGame;
