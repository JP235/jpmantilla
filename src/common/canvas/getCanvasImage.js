export function getCanvasImageURI(source) {
	const canvas = document.getElementById(source);
	const imageURI = canvas.toDataURL("image/jpg", 0.1);
  // const h = canvas.height;
  // const w = canvas.width;
	return imageURI
	// return {imageURI, h, w};
}

//https://stackoverflow.com/a/62432112/15088227
export async function dataUrlToFile(dataUrl, fileName) {
	const res = await fetch(dataUrl);
	const blob = await res.blob();
  const f = new File([blob], fileName, { type: "image/png" });
	console.log("f", f);
  return f
}
