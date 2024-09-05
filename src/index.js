import "./index.css";
import Player from "./player";
import { renderBoard } from "./domRenderer";

// initialize two players
let humanPlayer = new Player('real');
let computerPlayer = new Player('computer');

// generate two random boards for the players
generateRandomBoard(humanPlayer);
generateRandomBoard(computerPlayer);

// grab elements for rendering boards to
const humanBoard = document.querySelector('#playerBoard');
const computerBoard = document.querySelector('#computerBoard');

// render boards
humanBoard.appendChild(renderBoard(humanPlayer));
computerBoard.appendChild(renderBoard(computerPlayer));

// add event listeners to each td for doing a receive attack
document.querySelectorAll('#computerBoard table td').forEach(cell => {
    cell.addEventListener('click', (e) => {
        const clickedCell = e.target;
        let row = clickedCell.parentElement.rowIndex;
        let col = Array.from(clickedCell.parentElement.children).indexOf(clickedCell);

        let result = computerPlayer.board.receiveAttack(row, col);

        // if receiveAttack is true that means that square was a hit
        if (result === true) {
            clickedCell.classList.add('hit');
        } else {
            clickedCell.classList.add('miss');
        }

        // delay just to make it seem more natural
        setTimeout(() => {
            // have the computer make an attack on the player board
            [row, col] = generateRandomAttack(humanPlayer);

            // figure out which cell to apply the result to
            let humanCell = document.querySelector('#playerBoard table').rows[row].cells[col];
            
            result = humanPlayer.board.receiveAttack(row, col);

            // if receiveAttack is true that means that square was a hit
            if (result === true) {
                humanCell.classList.add('hit');
            } else {
                humanCell.classList.add('miss');
            }
        }, 1000);

    });
})


function generateRandomBoard(player) {
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

function generateRandomAttack(player) {
    // generate random row/col to attack
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);

    // if the spot has already been hit then regenerate new row/col
    while (player.board.checkForAttack(row, col)) {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
    }

    return [row, col];
}
