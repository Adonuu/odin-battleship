const Player = require("./player");

class Game {
    constructor() {
        this.humanPlayer = new Player('real');
        this.computerPlayer = new Player('computer');
        this.generateRandomBoard(this.humanPlayer);
        this.generateRandomBoard(this.computerPlayer);
    }

    generateRandomBoard(player) {
        // generate and place 5 ships randomly on the board
        // the 5 ships consist of one 5 length, one 4 length, two 3 lengths, and one 2 length
        // generate random starting location for each ship
        const shipLengths = [5, 4, 3, 3, 2];
        shipLengths.forEach(length => {
            // generate a random starting location for the ship and direction
            // ensure with the length and direction it fits within the board, if not shift it up
            // also check to ensure a ship isn't already there if it is select a new random location
            
            // generate random direction
            let directionNum = Math.floor(Math.random() * 4);
            let direction = '';
            if (direction === 0) {
                direction = 'right';
            } else if (direction === 1) {
                direction = 'left';
            } else if (direction === 2) {
                direction = 'up';
            } else {
                direction = 'down';
            }

            // generate random row/col
            let row = Math.floor(Math.random() * 10);
            let col = Math.floor(Math.random() * 10);

            // if direction is left/right ensure the column isn't too big/small
            // if the direction is up/down ensure the row isn't too big/small
            if (direction === 'right' && ((col + length) > 10)) {
                col = 10 - length;
            } else if (direction === 'left' && ((col - length) < 0)) {
                col = length;
            } else if (direction === 'up' && ((row - length) < 0)) {
                row = length;
            } else if (direction === 'down' && ((row + length) > 10)) {
                row = length - 10;
            }

            // if there is already a ship there keep on making random guesses until you get there
            while(player.board.checkForShip(length, row, col, direction)) {
                // generate random direction
                directionNum = Math.floor(Math.random() * 4);
                direction = '';
                if (direction === 0) {
                    direction = 'right';
                } else if (direction === 1) {
                    direction = 'left';
                } else if (direction === 2) {
                    direction = 'up';
                } else {
                    direction = 'down';
                }

                // generate random row/col
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);

                // if direction is left/right ensure the column isn't too big/small
                // if the direction is up/down ensure the row isn't too big/small
                if (direction === 'right' && ((col + length) > 10)) {
                    col = 10 - length;
                } else if (direction === 'left' && ((col - length) < 0)) {
                    col = length;
                } else if (direction === 'up' && ((row - length) < 0)) {
                    row = length;
                } else if (direction === 'down' && ((row + length) > 10)) {
                    row = length - 10;
                }
            }

            player.board.placeShip(length, row, col, direction);
        });
    }

    generateRandomAttack(player) {
        // generate random row/col to attack
        let row = Math.floor(Math.random() * 10);
        let col = Math.floor(Math.random() * 10);

        // if the spot has already been hit then regenerate new row/col
        while (player.board.checkForAttack(row, col)) {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        }

        player.board.receiveAttack(row, col);
    }
}

module.exports = Game;