import axios from "axios";

import { tokenConfig } from "../tokenConfig";
import { createMessage } from "../../common/utils/messagesSlice";
import { returnErrors } from "../../common/utils/errorsSlice";

import { BASE_REQ_URL } from "../urlconfig";
import { loadingGame, gameLoaded, savingGame, gameSaved } from "./gameAPISlice";
import { startPlaying } from "../../components/PlayGame/playGameSlice";
import { CLASSICDATA } from "./classicData";

export const getGame = (gameCode) => (dispatch, getState) => {
	dispatch(loadingGame());
	if (gameCode === "classic") {
		dispatch(gameLoaded());
		dispatch(startPlaying(CLASSICDATA));
		return;
	}
	axios
		.get(BASE_REQ_URL+"api/game/"+gameCode, tokenConfig(getState))
		.then((res) => {
			dispatch(gameLoaded());
			dispatch(startPlaying(res.data));
			dispatch(
				createMessage({
					type: "Loaded Game",
					game: gameCode,
					time: Date().toString(),
				})
			);
		})
		.catch((err) => {
			console.log("Can't get game", err);
			dispatch(
				returnErrors({
					msg: err,
					status: err.status,
				})
			);
		});
};

export const saveGame = (game, blocks, moves) => (dispatch, getState) => {
	if (!getState().auth.isAuthenticated) {
		console.log("Must be logged in to save game");
		return;
	}

	dispatch(savingGame());

	const body = JSON.stringify({ game: game, blocks: blocks, moves: moves });
	axios
		.put(BASE_REQ_URL+"api/game/"+game.code +"/", body, tokenConfig(getState))
		.then((res) => {
			res.status === 201 &&
				window.location.replace("/game/" + res.data.game.code);

			dispatch(gameSaved());
			console.log("Game saved");
			dispatch(
				createMessage({
					type: "Saved Game",
					game: game.code,
					time: Date().toString(),
				})
			);
		})
		.catch((err) => {
			console.log(err);
		});
};

export const createGame = (game, blocks) => (dispatch, getState) => {
	const body = JSON.stringify({ game: game, blocks: blocks });
	// console.log(game, blocks);
	axios
		.post(BASE_REQ_URL+"api/game/create/", body, tokenConfig(getState))
		.then((res) => {
			// console.log(res.data);
			dispatch(
				createMessage({
					type: "Added board",
					boardCode: res.data.game.code,
					time: Date().toString(),
				})
			);
			window.location.replace("/game/" + res.data.game.code);
		})
		.catch((err) => {
			console.log(err);

			dispatch(
				returnErrors({
					msg: err.response.data,
					status: err.response.status,
				})
			);
		});
};
