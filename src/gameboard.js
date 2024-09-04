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
            if (currentRow >= 10 || currentRow < 0 || currentCol >= 10 || currentCol < 0) {
                throw new Error("Ship placement is out of bounds.");
            }

            // Place the ship at the calculated position in the 2D array
            this.board[currentRow][currentCol] = {ship, hit: false};
        }
    }

    receiveAttack(row, col) {

        // if the current value is a ship hit the ship and return true, which means the ship was hit
        if (this.board[row][col].ship instanceof Ship) {
            this.board[row][col].ship.hit();
            this.board[row][col].hit = true;
            return true;
        }
        else {
            // mark space with -1 if there was a miss
            this.board[row][col] = -1;
            return false;
        }
    }

    allShipsSunk() {
        return this.board.flat().every(cell => !(cell.ship instanceof Ship) || cell.ship.isSunk());
    }

    checkForShip(length, row, col, direction) {
        for (let i = 0; i < length; i ++) {
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

            if (currentRow < 0 || currentRow > 10) return true;
            
            if (currentCol < 0|| currentCol > 10) return true;

            if (this.board[currentRow][currentCol] != 0) return true;
        }
        return false;
    }

    checkForAttack(row, col) {
        // if the row or column are out of bounds return true
        if (row < 0 || row > 10) return true;
        if (col < 0|| col > 10) return true;

        // if the board is already a miss return true since we have already tried to hit there
        if (this.board[row][col] === -1) return true;

        // if the board is a hit then return true
        if (this.board[row][col].hit === true) return true;
        
        return false;
    }
}



module.exports = Gameboard;