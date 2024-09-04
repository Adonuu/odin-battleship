const Ship = require('./ship');

class Gameboard {
    constructor() {
        this.board = Array.from({ length: 10 }, () => new Array(10).fill(0));
    }

    placeShip(length, row, col, direction) {
        const ship = new Ship(length);

        for (let i = 0; i < length; i++) {
            let currentRow = row;
            let currentCol = col;

            if (direction === 'right') {
                currentCol += i;
            } else if (direction === 'left') {
                currentCol -= i;
            } else if (direction === 'down') {
                currentRow += i;
            } else if (direction === 'up') {
                currentRow -= i;
            } else {
                throw new Error("Invalid direction. Use 'up', 'down', 'left', or 'right'.");
            }

            // Ensure the position is within bounds
            if (currentRow >= this.size || currentRow < 0 || currentCol >= this.size || currentCol < 0) {
                throw new Error("Ship placement is out of bounds.");
            }

            // Place the ship at the calculated position in the 2D array
            this.board[currentRow][currentCol] = ship;
        }
    }

    receiveAttack(row, col) {

        // if the current value is a ship hit the ship and return true, which means the ship was hit
        if (this.board[row][col] instanceof Ship) {
            this.board[row][col].hit();
            return true;
        }
        else {
            // mark space with -1 if there was a miss
            this.board[row][col] = -1;
        }
    }

    allShipsSunk() {
        return this.board.flat().every(cell => !(cell instanceof Ship) || cell.isSunk());
    }
}



module.exports = Gameboard;