import React from "react";

function PrevNextButtons(props) {
	return (
		<div className="buttons-prev-next">
			<button
				className="btn-menu prev-next-buttons"
				type="button"
				onClick={() => props.prevFunction()}
				disabled={props.disablePrev}
			>
				Prev
			</button>
			&nbsp;
			<button
				className="btn-menu prev-next-buttons"
				type="button"
				onClick={() => props.nextFunction()}
				disabled={props.disableNext}
			>
				Next
			</button>
		</div>
	);
}

export default PrevNextButtons;
