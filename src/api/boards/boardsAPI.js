import axios from "axios";

import { tokenConfig } from "../tokenConfig";
import { BASE_REQ_URL } from "../urlconfig";
import { createMessage } from "../../common/utils/messagesSlice";
import { returnErrors } from "../../common/utils/errorsSlice";
import { OPENBOARDSLIST } from "../game/openGamesData";
import { loadingBoards, boardsLoaded, deletedGame } from "./boardsAPISlice";

export const getBoards = (openboards=false) => (dispatch, getState) => {
	dispatch(loadingBoards());
  if (openboards){
    dispatch(boardsLoaded(OPENBOARDSLIST.map(e => e.game)))
    dispatch(
      createMessage({
        type: "Loaded Open Boards",
        time: Date().toString(),
      })
    );
    return
  }
  let boardsURL = BASE_REQ_URL+"api/boards/"
	axios
		.get(boardsURL, tokenConfig(getState))
		.then((res) => {
			dispatch(boardsLoaded(res.data));
			dispatch(
				createMessage({
					type: "Loaded boards",
					n_boards: getState().boardsAPI.boards.length,
					time: Date().toString(),
				})
			);
		})
		.catch((err) => {
			console.log("Can't load boards", err);
			dispatch(
				returnErrors({
					msg: err.response.data,
					status: err.response.status,
				})
			);
		});
};


export const deleteBoard = (gameCode) => (dispatch, getState) => {
	axios
		.delete(
			BASE_REQ_URL+`api/game/${gameCode}/`,
			tokenConfig(getState)
		)
		.then((res) => {
			dispatch(deletedGame(gameCode));
			dispatch(
				createMessage({
					type: "Deleted board",
					boardCode: gameCode,
					time: Date().toString(),
				})
			);
		})
		.catch((err) => {
			console.log(err);
			dispatch(returnErrors(err));
		});
};
