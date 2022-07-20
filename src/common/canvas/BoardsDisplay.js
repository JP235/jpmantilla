import React from "react";
import BoardCanvas from "./BoardCanvas";

function BoardsDisplay(props) {
	const { blocks, game, type } = props;
	const { rows, cols } = game;
	

	return (
		<>
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={blocks}
				id={type === "list" ? "": "playBoard"}
				className={(type === "list") && "list-board"}
			/>
    &nbsp;
			<BoardCanvas
				rows={rows}
				cols={cols}
				blocks={[
					{
						...blocks.find((bl) => bl.name === "GG"),
						x: game.win_block_x,
						y: game.win_block_y,
						color: "#c0ca33",
					},
				]}
        id={type === "list" ? "": "winBoard"}
				className={(type === "list") && "list-board"}
			/>
		</>
	);
}

export default BoardsDisplay;
