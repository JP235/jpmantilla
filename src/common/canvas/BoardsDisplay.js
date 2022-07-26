import React from "react";
import BoardCanvas from "./BoardCanvas";

function BoardsDisplay(props) {
	const { game, blocks, winBlock, type, invert } = props;
	const { rows, cols } = game;

	return (
		<>
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={invert ? [winBlock] : blocks}
				id={type === "list" ? "" : "playBoard"}
				className={type === "list" ? "list-board" : "show-board"}
			/>
			&nbsp;
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={invert ? blocks : [winBlock]}
				id={type === "list" ? "" : "winBoard"}
				className={type === "list" ? "list-board" : "show-board"}
			/>
		</>
	);
}

export default BoardsDisplay;
