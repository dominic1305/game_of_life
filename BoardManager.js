"use strict";

class BoardManager {
	#board;
	#rows;
	#cols;
	/**@private @param {bool[][]} board @param {number} rows @param {number} cols*/
	constructor(board, rows, cols) {
		this.#board = board;
		this.#rows = rows;
		this.#cols = cols;
	}
	/**@param {number} int @param {number} max*/
	static #clamp(int, max) {
		return (int > max) ? max : int;
	}
	static generateBoard() {
		const [ rows, cols ] = Array.from(document.querySelectorAll('.controls > input')).map(bin => this.#clamp(parseInt(bin.value) || 0, 128));

		const arrBuffer = [];
		for (let y = 0; y < rows; y++) {
			arrBuffer.push(new Array(cols).fill(false));
		}

		return new BoardManager(arrBuffer, rows, cols);
	}
	#connectUserControl() {
		document.querySelector('.game').addEventListener('click', (e) => {
			if (state) return;
			const element = document.querySelector(`#${e.target.id}`); //WTF!

			element.className = (element.className == 'dead') ? 'alive' : 'dead';
			this.#board[Number(element.dataset.y)][Number(element.dataset.x)] = !this.#board[Number(element.dataset.y)][Number(element.dataset.x)];
			console.log(this.#board);
		});
	}
	draw() {
		let table = '<table class="game"><tbody>'

		for (let y = 0; y < this.#board.length; y++) {//loop through every row
			let buffer = '<tr>';
			for (let x = 0; x < this.#board[y].length; x++) {//loop through every cell in that row
				buffer += `<td class="dead" id="_${Math.random().toString(16).slice(2)}" data-x="${x}" data-y="${y}"></td>`;
			}
			table += buffer + '</tr>';
		}

		table += '</tbody></table>';
		document.querySelector('.game-container').innerHTML = table;
		this.#connectUserControl();
	}
	/**@override*/
	toString() {
		let str = `${this.#rows},${this.#cols}:`;
		let bits = '';
		for (const row of this.#board) {
			for (const cell of row) {
				bits += Number(cell);
			}
		}
		str += parseInt(bits, 2).toString(36);
		return str;
	}
}