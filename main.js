"use strict";

let state = false;
/**@type {BoardManager}*/ let board;

document.querySelector('#generate').addEventListener('click', () => {
	board = BoardManager.generateBoard();
	board.draw();
});