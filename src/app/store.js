import { configureStore } from "@reduxjs/toolkit";

import errorsReducer from "../common/utils/errorsSlice";
import messagesReducer from "../common/utils/messagesSlice";
import authReducer from "../api/auth/authAPISlice";
import playGameReducer from "../components/PlayGame/playGameSlice";
import boardsReducer from "../api/boards/boardsAPISlice";
import gameReducer from "../api/game/gameAPISlice";
import customGameReducer from "../components/CustomGame/customGameSlice";

export default configureStore({
	reducer: {
		auth: authReducer,
		messages: messagesReducer,
		error: errorsReducer,
    boardsAPI: boardsReducer,
    gameAPI: gameReducer,
    playGame: playGameReducer,
		customGame: customGameReducer,
	},
});
