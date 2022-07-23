	// const menuStepZero = (
	// 	<div className="step zero">
	// 		<label>Rows </label>
	// 		<input
	// 			value={rows}
	// 			id="rows"
	// 			type="number"
	// 			min="2"
	// 			max="10"
	// 			onChange={(e) => dispatch(changeRows(e.target.value))}
	// 		/>
	// 		<label> Cols </label>
	// 		<input
	// 			value={cols}
	// 			id="cols"
	// 			type="number"
	// 			min="2"
	// 			max="10"
	// 			onChange={(e) => dispatch(changeCols(e.target.value))}
	// 		/>
	// 	</div>
	// );
	// const menuStepOne = (
	// 	<div className="step one">
	// 		<input
	// 			id="undo"
	// 			type="button"
	// 			onClick={() => dispatch(removeLast())}
	// 			value="Delete Last Block"
	// 			disabled={blockName === 1 ? true : false}
	// 		/>
	// 	</div>
	// );
	// const menuStepTwo = (
	// 	<div className="step two">
	// 		<label>Pick Win-Block: </label>
	// 		<select
	// 			id="Win-Block"
	// 			onChange={(e) => makeWinBoard(e.target.value)}
	// 		>
	// 			{blocks.map((bl) => (
	// 				<option key={bl.name}>{bl.name}</option>
	// 			))}
	// 		</select>
	// 	</div>
	// );
	// const menuStepThree = (
	// 	<div className="step three">
	// 		<button
	// 			key={"save button"}
	// 			onClick={() => {
	// 				const game = {
	// 					cols: cols,
	// 					rows: rows,
	// 					img_curr: getCanvasImageURI("playBoard"),
	// 					img_win: getCanvasImageURI("winBoard"),
	// 					win_block_x: winBlock.x,
	// 					win_block_y: winBlock.y,
	// 				};
	// 				dispatch(createGame(game, nameShift));
	// 			}}
	// 		>
	// 			SAVE GAME
	// 		</button>
	// 	</div>
	// );