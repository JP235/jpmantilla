import { BORDERMARGIN, BLOCKSIDE } from "./constants";

export function posToCoord(posX, posY) {
	//coords system
	let y = Math.floor((posX - BORDERMARGIN) / BLOCKSIDE);
	let x = Math.floor((posY - BORDERMARGIN) / BLOCKSIDE);
	return [x, y];
}
