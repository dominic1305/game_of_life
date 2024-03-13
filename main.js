"use strict";

let state = false;
/**@type {BoardManager}*/ let board;

document.querySelector('#generate').addEventListener('click', () => {
	if (document.querySelector('#start-simulation').innerHTML == 'stop') document.querySelector('#start-simulation').click();
	try {
		if (document.querySelector('#rows').value != '' && document.querySelector('#cols').value != '') board = BoardManager.generateBoard();
		else if (document.querySelector('#code').value != '') board = BoardManager.generateBoardFromCode(document.querySelector('#code').value);
	} catch { return; }
});

document.querySelector('#start-simulation').addEventListener('click', () => {
	if (board == null) return;
	state = !state;
	document.querySelector('#start-simulation').innerHTML = (state) ? 'stop' : 'start';
})

let TIME;
requestAnimationFrame(function loop(time) {
	const delta = time - TIME;
	document.querySelector('.fps-counter').innerHTML = `${Math.round(1000 / delta)}fps`;
	TIME = time;
	if (state) {
		board.update();
	}
	requestAnimationFrame(loop);
});