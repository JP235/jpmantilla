export function tupSum(t1, t2) {
	return [t1[0] + t2[0], t1[1] + t2[1]];
}

const pm1 = [
	[1, 0],
	[0, 1],
	[-1, 0],
	[0, -1],
];
export function plusmin1(c, maxX, maxY) {
	let out = [];
	for (let o of pm1) {
		const v = tupSum(c, o);
		if (0 <= v[0] && v[0] < maxX && 0 <= v[1] && v[1] < maxY) {
			out.push(v);
		}
	}
	return out;
}

export function calcCoordsToBlocks(blocks) {
  let out = {};
  // console.log("blocks",blocks)
  for (let b of blocks) {
    for (let c of calcBlockCoords(b)) {
      out[c] = b.name;
    }
  }
  return out;
}

export function calcBoardCoords(bls, useStrings = true) {
	let coords = [];
	for (let bl of bls) {
		coords = [...coords, ...calcBlockCoords(bl, useStrings)];
	}
  return coords;
}

export function strXY(x,y){
  return [x, y].join(",")}

export function calcBlockCoords(b, useStrings = true) {
	let coords = [];
  let bl = Object.assign({}, b);
	try {
		for (let i = 0; i < bl.h * bl.l; i++) {
			if (useStrings) {
				const [x, y] = tupSum(
					[bl.x, bl.y],
					[Math.floor(i / bl.l), i % bl.l]
				);
				coords.push(strXY(x,y));
			} else {
				coords.push(
					tupSum([bl.x, bl.y], [Math.floor(i / bl.l), i % bl.l])
				);
			}
		}
		return coords;
	} catch (e) {
		//bl.l == 0
		return;
	}
}
