import React from "react";
import BoardCanvas from "./BoardCanvas";

function BoardsDisplay(props) {
	const { game, blocks, winBlock, type } = props;
	const { rows, cols } = game;

	return (
		<>
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={blocks}
				id={type === "list" ? "" : "playBoard"}
				className={type === "list" ? "list-board" : "show-board"}
			/>
			&nbsp;
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={[winBlock]}
				id={type === "list" ? "" : "winBoard"}
				className={type === "list" ? "list-board" : "show-board"}
			/>
		</>
	);
}

export default BoardsDisplay;
