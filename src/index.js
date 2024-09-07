import "./index.css";
import Player from "./player";
import { renderBoard, renderPieces } from "./domRenderer";

// initialize two players
let humanPlayer = new Player('real');
let computerPlayer = new Player('computer');

// generate random board for computer player
generateRandomBoard(computerPlayer);

// grab elements for rendering boards to
const humanBoard = document.querySelector('#playerBoard');
const computerBoard = document.querySelector('#computerBoard');
const newGameButton = document.querySelector('#newGame');
const piecesDiv = document.querySelector('#pieces');
const startGameButton = document.querySelector('#startGame');
const resetPiecesButton = document.querySelector('#resetPieces');

// render boards
humanBoard.appendChild(renderBoard(humanPlayer));
computerBoard.appendChild(renderBoard(computerPlayer));

// render pieces
piecesDiv.appendChild(renderPieces());

// prevent user from clicking on computer board until start game is pressed
computerBoard.lastChild.style.pointerEvents = 'none';

// prevent user from clicking start game until all pieces are on their board
startGameButton.disabled = true;

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

        if (computerPlayer.board.allShipsSunk()) {
            declareWinner(humanPlayer);
        }

        // remove ability to click on computer board until computer has done it's attack
        clickedCell.parentElement.style.pointerEvents = 'none';

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

            if (humanPlayer.board.allShipsSunk()) {
                declareWinner(computerPlayer);
            }

            // give player the ability to click since the computer has attacked
            clickedCell.parentElement.style.pointerEvents = 'auto';
        }, 1000);

    });
});

// when start game button is clicked allow user to click on computer board cells
startGameButton.addEventListener('click', () => {
    computerBoard.lastChild.style.pointerEvents = 'auto';
})

// add event listeners for dragging/dropping on human board
humanBoard.lastChild.addEventListener('dragover', (e) => {
    e.preventDefault();
});

// when reset pieces button is pressed only reset the users board and not the computers
resetPiecesButton.addEventListener('click', () => {
    // clear board
    clearBoard(humanPlayer);

    // re-render board
    const newBoard = renderBoard(humanPlayer);
    humanBoard.querySelector('table').innerHTML = newBoard.innerHTML;

    // re-render pieces
    piecesDiv.lastChild.remove();
    piecesDiv.appendChild(renderPieces());

    // prevent user from clicking on computer board until start game is pressed
    computerBoard.lastChild.style.pointerEvents = 'none';

    // prevent user from clicking start game until all pieces are on their board
    startGameButton.disabled = true;

})

humanBoard.lastChild.addEventListener('drop', (e) => {
    e.preventDefault();

    // Get the drop target cell
    const targetCell = e.target.closest('td');
    console.log(targetCell);
    // if targetCell is invalid then don't do anything
    if (!targetCell) return;

    const shipId = e.dataTransfer.getData("id");
    const offsetX = parseInt(e.dataTransfer.getData("offsetX"), 10);
    const offsetY = parseInt(e.dataTransfer.getData("offsetY"), 10);
    const shipWidth = parseInt(e.dataTransfer.getData('shipWidth'), 10);
    const shipLength = parseInt(e.dataTransfer.getData('shipLength'), 10);

    // figure out which cell on the ship the user clicked
    let widthRatio = offsetX / shipWidth;
    let clickedArea = Math.floor(widthRatio * shipLength);

    // figure out which row/col the event is targetting in the board
    const row = targetCell.parentElement.rowIndex;
    const col = Array.from(targetCell.parentElement.children).indexOf(targetCell);

    // if there is not already a ship at the location place the ship
    if (!humanPlayer.board.checkForShip(shipLength, row - clickedArea, col, 'right')) {

        // place ship
        humanPlayer.board.placeShip(shipLength, row - clickedArea, col, 'right');

        // Re-render board without removing the element
        const newBoard = renderBoard(humanPlayer);
        humanBoard.querySelector('table').innerHTML = newBoard.innerHTML;

        // remove ship from ship div
        document.querySelector('#Ships').removeChild(document.querySelector('#Ships').querySelector('#' + shipId));

        // if there are no more ships in the div that means the game is ready to start
        if (document.querySelector('#Ships').childNodes.length === 0) {
            startGameButton.disabled = false;
        }
    } else {
        alert('Ship Already There! Place Ship at new location');
    }   
});

newGameButton.addEventListener('click', () => resetGame());

function declareWinner(player) {

    const winnerDiv = document.querySelector('#header h2');

    // if no player is passed in change the text to blank
    if (player === null) {
        winnerDiv.innerHTML = '';
    } else {
        winnerDiv.innerHTML = 'The winner is ' + player.type + '!';
    }
}

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
        if (directionNum === 0) {
            direction = 'right';
        } else if (directionNum === 1) {
            direction = 'left';
        } else if (directionNum === 2) {
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

function resetGame() {

    // clear the boards
    clearBoard(humanPlayer);
    clearBoard(computerPlayer);

    // declare no more winner
    declareWinner(null);

    // generate new board
    generateRandomBoard(computerPlayer);

    //re-render boards
    const newBoard = renderBoard(humanPlayer);
    humanBoard.querySelector('table').innerHTML = newBoard.innerHTML;
    const newBoardComputer = renderBoard(computerPlayer);
    computerBoard.querySelector('table').innerHTML = newBoardComputer.innerHTML;

    // re-render pieces
    piecesDiv.lastChild.remove();
    piecesDiv.appendChild(renderPieces());

    // prevent user from clicking on computer board until start game is pressed
    computerBoard.lastChild.style.pointerEvents = 'none';

    // prevent user from clicking start game until all pieces are on their board
    startGameButton.disabled = true;
}

function clearBoard(player) {
    player.board.board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            player.board.board[rowIndex][colIndex] = 0;
        });
    });
}
