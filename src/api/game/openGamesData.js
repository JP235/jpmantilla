const classic = {
	game: {
		code: "classic",
		cols: 4,
		rows: 5,
		win_block_x: 3,
		win_block_y: 1,
		number_of_moves: 0,
		solved: null,
	},
	moves: [],
	blocks: [
		{ name: "GG", h: 2, l: 2, x: 0, y: 1 },
		{ name: "01", h: 2, l: 1, x: 0, y: 0 },
		{ name: "02", h: 2, l: 1, x: 0, y: 3 },
		{ name: "03", h: 2, l: 1, x: 2, y: 0 },
		{ name: "04", h: 1, l: 2, x: 2, y: 1 },
		{ name: "05", h: 2, l: 1, x: 2, y: 3 },
		{ name: "06", h: 1, l: 1, x: 4, y: 0 },
		{ name: "07", h: 1, l: 1, x: 3, y: 1 },
		{ name: "08", h: 1, l: 1, x: 3, y: 2 },
		{ name: "09", h: 1, l: 1, x: 4, y: 3 },
	],
};
const open1 = {
	game: {
		code: "open1",
		cols: 4,
		rows: 5,
		win_block_x: 3,
		win_block_y: 1,
		number_of_moves: 0,
		solved: null,
	},
	moves: [],
	blocks: [
		{ name: "GG", h: 2, l: 2, x: 0, y: 1 },
		{ name: "01", h: 2, l: 1, x: 0, y: 0 },
		{ name: "02", h: 2, l: 1, x: 0, y: 3 },
		{ name: "03", h: 2, l: 1, x: 2, y: 0 },
		{ name: "04", h: 2, l: 1, x: 2, y: 3 },
		{ name: "05", h: 1, l: 1, x: 4, y: 0 },
		{ name: "06", h: 1, l: 1, x: 3, y: 1 },
		{ name: "07", h: 1, l: 1, x: 3, y: 2 },
		{ name: "08", h: 1, l: 1, x: 4, y: 3 },
	],
};
const open2 = {
	game: {
		code: "open2",
		cols: 4,
		rows: 5,
		win_block_x: 3,
		win_block_y: 1,
		number_of_moves: 0,
		solved: null,
	},
	moves: [],
	blocks: [
		{ name: "GG", h: 2, l: 2, x: 0, y: 1 },
		{ name: "01", h: 2, l: 1, x: 0, y: 3 },
		{ name: "02", h: 2, l: 1, x: 2, y: 0 },
		{ name: "03", h: 1, l: 2, x: 2, y: 1 },
		{ name: "04", h: 2, l: 1, x: 2, y: 3 },
		{ name: "05", h: 1, l: 1, x: 4, y: 0 },
		{ name: "06", h: 1, l: 1, x: 3, y: 1 },
		{ name: "07", h: 1, l: 1, x: 3, y: 2 },
		{ name: "08", h: 1, l: 1, x: 4, y: 3 },
	],
};
const open3 = {
	game: {
		code: "open3",
		cols: 5,
		rows: 5,
		win_block_x: 3,
		win_block_y: 1,
		number_of_moves: 0,
		solved: null,
	},
	moves: [],
	blocks: [
		{ name: "GG", h: 2, l: 2, x: 0, y: 1 },
		{ name: "01", h: 2, l: 1, x: 0, y: 0 },
		{ name: "02", h: 2, l: 1, x: 0, y: 3 },
		{ name: "03", h: 3, l: 1, x: 0, y: 4 },
		{ name: "04", h: 2, l: 1, x: 2, y: 0 },
		{ name: "05", h: 1, l: 2, x: 2, y: 1 },
		{ name: "06", h: 2, l: 1, x: 2, y: 3 },
		{ name: "07", h: 1, l: 1, x: 4, y: 0 },
		{ name: "08", h: 1, l: 1, x: 3, y: 1 },
		{ name: "09", h: 1, l: 1, x: 3, y: 2 },
		{ name: "10", h: 1, l: 1, x: 4, y: 3 },
	],
};

export const OPENBOARDSLIST = [classic, open1, open2, open3];
export const OPENBOARDS = {classic, open1, open2, open3};
export const OPENCODES = OPENBOARDSLIST.map(e => e.game.code);
