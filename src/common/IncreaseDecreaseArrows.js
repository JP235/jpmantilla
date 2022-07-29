function IncreaseDecreaseArrows(props) {
  const {name, value, onUp, onDown, direction, ...rest} = props;
	const className = `increase-decrease ${name}`;
	

	return (
		<div className={className} {...rest}>
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
