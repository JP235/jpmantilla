function UpDownControl(props) {
	const name = props.name;
	const value = props.value;
	const onUp = props.onUp;
	const onDown = props.onDown;

	return (
		<div className="up-down-control">
			<span className="updown-name">{name}</span>
			<input
				type="image"
        className="uparrow arrow"
				src="up-arrow.png"
        alt="up"
				onClick={onUp}
        />
			<div className="updown-value">{value}</div>
			<input
				type="image"
        className="downarrow arrow"
				src="down-arrow.png"
        alt="down"
				onClick={onDown}
			/>
		</div>
	);
}

export default UpDownControl;
