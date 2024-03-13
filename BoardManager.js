"use strict";

class BoardManager {
	#board;
	#rows;
	#cols;
	/**@type {Readonly<Readonly<{x: number, y: number}>[]>}*/ static #neighbourPositions = Object.freeze([
		Object.freeze({x: -1, y: -1}),
		Object.freeze({x: 0, y: -1}),
		Object.freeze({x: 1, y: -1}),
		Object.freeze({x: -1, y: 0}),
		Object.freeze({x: 1, y: 0}),
		Object.freeze({x: -1, y: 1}),
		Object.freeze({x: 0, y: 1}),
		Object.freeze({x: 1, y: 1}),
	]);
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
		const [ rows, cols ] = Array.from(document.querySelectorAll('.generation-controls > input')).map(bin => this.#clamp(parseInt(bin.value) || 0, 64));
		const board = new BoardManager(new Array(rows).fill().map(_ => new Array(cols).fill(false)), rows, cols);
		board.#draw();
		return board;
	}
	/**@param {any[]} arr @returns {Generator<any>}*/
	static *#chunkArr(arr, chunkSize) {
		for (let i = 0; i < arr.length; i += chunkSize) {
			yield arr.slice(i, i + chunkSize);
		}
	}
	/**@param {string} code*/
	static generateBoardFromCode(code) {
		const [ rows, cols] = code.split(':')[0].split(',').map(bin => parseInt(bin));
		code = code.split(':')[1].padStart(rows * cols, '0');

		const arr = [];
		for (const bits of BoardManager.#chunkArr(code, cols)) {
			arr.push(bits.split('').map(bin => bin == 1));
		}

		const board = new BoardManager(arr, rows, cols);
		board.#draw();
		return board;
	}
	#connectUserControl() {
		document.querySelector('.game').addEventListener('click', (e) => {
			if (state) return;
			const element = document.querySelector(`#${e.target.id}`); //WTF!

			element.className = (element.className == 'dead') ? 'alive' : 'dead';
			this.#board[Number(element.dataset.y)][Number(element.dataset.x)] = !this.#board[Number(element.dataset.y)][Number(element.dataset.x)];
			document.querySelector('#code').value = this;
		});
	}
	/**@param {number} x @param {number} y @returns {bool[]}*/
	#getNeighbours(y, x) {
		const neighbours = [];
		for (const positionSet of BoardManager.#neighbourPositions) {
			try {
				neighbours.push(this.#board[positionSet.y + y][positionSet.x + x]);
			} catch {
				neighbours.push(false);
			}
		}
		return neighbours;
	}
	/**@returns {bool[][]}*/
	#getNextGeneration() {
		const newBoard = new Array(this.#rows).fill().map(_ => new Array(this.#cols).fill(false));
		for (let y = 0; y < this.#rows; y++) {
			for (let x = 0; x < this.#cols; x++) {
				const neighbourArr = this.#getNeighbours(y, x);
				const numberAlive = neighbourArr.filter(bin => bin).length;
				if (this.#board[y][x]) {//alive
					if (numberAlive < 2) newBoard[y][x] = false; //dies from underpopulation
					else if (numberAlive == 2 || numberAlive == 3) newBoard[y][x] = true; //survives
					else if (numberAlive > 4) newBoard[y][x] = false; //dies from overpopulation
				} else {//dead
					if (numberAlive == 3) newBoard[y][x] = true; //becomes alive from reproduction
				}
			}
		}
		return newBoard;
	}
	update() {
		this.#board = this.#getNextGeneration();
		for (let y = 0; y < this.#rows; y++) {
			for (let x = 0; x < this.#cols; x++) {
				const cell = document.querySelector(`td[data-y="${y}"][data-x="${x}"]`);
				cell.className = (this.#board[y][x]) ? 'alive' : 'dead';
			}
		}
		document.querySelector('#code').value = this;
	}
	#draw() {
		let table = '<table class="game"><tbody>'

		for (let y = 0; y < this.#rows; y++) {//loop through every row
			let buffer = '<tr>';
			for (let x = 0; x < this.#cols; x++) {//loop through every cell in that row
				buffer += `<td class="${(this.#board[y][x]) ? 'alive' : 'dead'}" id="_${Math.random().toString(16).slice(2)}" data-x="${x}" data-y="${y}"></td>`;
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
		str += bits;
		return str;
	}
}