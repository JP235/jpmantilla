function IncreaseDecreaseArrows(props) {
	const name = props.name;
	const value = props.value;
	const onUp = props.onUp;
	const onDown = props.onDown;
	const direction = props.direction;
	const className = `increase-decrease ${name}`;
	

	return (
		<div className={className}>
			<span className="increase-decrease-name">{name}</span>
			<input
				type="image"
				className={`arrow increase-${direction === "leftright"? "leftright": "updown"}`}
				src="up-arrow.png"
				alt="increase"
				onClick={onUp}
			/>
			<div className="increase-decrease-value">{value}</div>
			<input
				type="image"
				className={`arrow decrease-${direction === "leftright"? "leftright": "updown"}`}
				src="up-arrow.png"
				alt="decrease"
				onClick={onDown}
			/>
		</div>
	);
}

export default IncreaseDecreaseArrows;
