//https://stackoverflow.com/a/17130415/15088227

export function getMousePosCanvas(canvas, evt) {
  console.log(evt)
	var rect = canvas.getBoundingClientRect(),
		scaleX = canvas.width / rect.width,
		scaleY = canvas.height / rect.height;

	return {
		x: (evt.clientX - rect.left) * scaleX,
		y: (evt.clientY - rect.top) * scaleY,
	};
}
