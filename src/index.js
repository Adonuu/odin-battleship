import "./index.css";
import Player from "./player";
import { renderBoard, renderPieces, rotateShips } from "./domRenderer";

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

// global variable to keep track of orientation
let shipOrientation = 'right';

// Helper function to handle computer attack with delay
function performComputerAttack() {
    return new Promise((resolve) => {
        setTimeout(() => {
            let [row, col] = generateRandomAttack(humanPlayer);

            // figure out which cell to apply the result to
            let humanCell = document.querySelector('#playerBoard table').rows[row].cells[col];
            let result = humanPlayer.board.receiveAttack(row, col);

            // Update the cell based on the result
            if (result === true) {
                humanCell.classList.add('hit');
            } else {
                humanCell.classList.add('miss');
            }

            if (humanPlayer.board.allShipsSunk()) {
                declareWinner(computerPlayer);
            }

            // Resolve the promise to indicate the attack is complete
            resolve(result);
        }, 1000);
    });
}

// add event listeners to each td for doing a receive attack
document.querySelectorAll('#computerBoard table td').forEach(cell => {
    cell.addEventListener('click', async (e) => {
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


        if (result !== true) {
            // remove ability to click on computer board until computer has done its attack
            clickedCell.parentElement.style.pointerEvents = 'none';

            document.querySelector('#computerBoard table').classList.toggle('flashing-border');

            // Perform computer attacks until it gets a miss
            let playerHit = false;
            while (!playerHit) {
                let attackResult = await performComputerAttack();
                if (attackResult === false) {
                    playerHit = true;
                }
            }

            document.querySelector('#computerBoard table').classList.toggle('flashing-border');

            // Give player the ability to click again
            clickedCell.parentElement.style.pointerEvents = 'auto';
        }
    });
});

// when start game button is clicked allow user to click on computer board cells
startGameButton.addEventListener('click', () => {
    computerBoard.lastChild.style.pointerEvents = 'auto';
    startGameButton.classList.toggle('flashing-border');
    document.querySelector('#computerBoard table').classList.toggle('flashing-border');
    resetPiecesButton.disabled = true;
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
    piecesDiv.style.display = 'block';

    document.querySelector('#playerBoard table').style.height = '50%';

    // prevent user from clicking on computer board until start game is pressed
    computerBoard.lastChild.style.pointerEvents = 'none';

    // prevent user from clicking start game until all pieces are on their board
    startGameButton.disabled = true;

})

humanBoard.lastChild.addEventListener('drop', (e) => {
    e.preventDefault();

    // Get the drop target cell
    const targetCell = e.target.closest('td');
    // if targetCell is invalid then don't do anything
    if (!targetCell) return;

    const shipId = e.dataTransfer.getData('id');
    const offsetX = parseInt(e.dataTransfer.getData('offsetX'), 10);
    const offsetY = parseInt(e.dataTransfer.getData('offsetY'), 10);
    const shipWidth = parseInt(e.dataTransfer.getData('shipWidth'), 10);
    const shipHeight = parseInt(e.dataTransfer.getData('shipHeight'), 10);
    const shipLength = parseInt(e.dataTransfer.getData('shipLength'), 10);

    // figure out which cell on the ship the user clicked
    let widthRatio = 0;
    let clickedArea = 0;
    let heightRatio = 0;
    if (shipOrientation === 'right') {
        widthRatio = offsetX / shipWidth;
        clickedArea = Math.floor(widthRatio * shipLength);
    } else {
        heightRatio = offsetY / shipHeight;
        clickedArea = Math.floor(heightRatio * shipLength);
    }

    // figure out which row/col the event is targetting in the board
    const row = targetCell.parentElement.rowIndex;
    const col = Array.from(targetCell.parentElement.children).indexOf(targetCell);

    // if user clicks in the middle of a ship we need to figure out how many cells to go up or left so it places like it looks on the screen
    let startRow = 0;
    let startCol = 0;
    if (shipOrientation === 'right') {
        startRow = row - clickedArea;
        startCol = col;
    } else {
        startRow = row;
        startCol = col - clickedArea;
    }

    // if there is not already a ship at the location place the ship
    if (!humanPlayer.board.checkForShip(shipLength, startRow, startCol, shipOrientation)) {

        // place ship
        humanPlayer.board.placeShip(shipLength, startRow, startCol, shipOrientation);

        // Re-render board without removing the element
        const newBoard = renderBoard(humanPlayer);
        humanBoard.querySelector('table').innerHTML = newBoard.innerHTML;

        // remove ship from ship div
        document.querySelector('#Ships').removeChild(document.querySelector('#Ships').querySelector('#' + shipId));

        // if there are no more ships in the div that means the game is ready to start
        if (document.querySelector('#Ships').childNodes.length === 0) {
            startGameButton.disabled = false;
            piecesDiv.style.display = 'none';
            document.querySelector('#playerBoard table').style.height = '82%';
            startGameButton.classList.toggle('flashing-border');
        }
    } else {
        alert('Ship Already There! Place Ship at new location');
    }   
});

newGameButton.addEventListener('click', () => resetGame());

// rotate ships when "r" key is pressed
document.addEventListener('keydown', function(event) {
    // Check if the pressed key is the "R" key
    if (event.key === 'R' || event.key === 'r') {
        shipOrientation = rotateShips();
    }
});

function declareWinner(player) {
    if (player.type === 'real') {
        alert('🎉 The winner is you! 😄');
    } else {
        alert('🤖 The winner is the computer 😢');
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

    // generate new board
    generateRandomBoard(computerPlayer);

    //re-render boards
    const newBoard = renderBoard(humanPlayer);
    humanBoard.querySelector('table').innerHTML = newBoard.innerHTML;
    const newBoardComputer = renderBoard(computerPlayer);
    computerBoard.querySelector('table').innerHTML = newBoardComputer.innerHTML;

    piecesDiv.style.display = 'block';

    document.querySelector('#playerBoard table').style.height = '50%';

    if (startGameButton.classList.contains('flashing-border')) {
        startGameButton.classList.toggle('flashing-border');
    }

    // re-render pieces
    piecesDiv.lastChild.remove();
    piecesDiv.appendChild(renderPieces());

    // prevent user from clicking on computer board until start game is pressed
    computerBoard.lastChild.style.pointerEvents = 'none';

    // prevent user from clicking start game until all pieces are on their board
    startGameButton.disabled = true;

    resetPiecesButton.disabled = false;
}

function clearBoard(player) {
    player.board.board.forEach((row, rowIndex) => {
        row.forEach((_, colIndex) => {
            player.board.board[rowIndex][colIndex] = 0;
        });
    });
}
