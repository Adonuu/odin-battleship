import Ship from "./ship";

export function renderBoard(player) {
    let board = player.board.board;

    let tableDiv = document.createElement('table');
    board.forEach(row => {
        let rowDiv = document.createElement('tr');
        row.forEach(cell => {
            let cellDiv = document.createElement('td');
            // only display if board is for the human player
            if (player.type === 'real') {
                if (cell === 0) {
                    cellDiv.classList.add('empty');
                } else if ( cell.ship instanceof Ship) {
                    cellDiv.classList.add('_' + cell.ship.length);
                }
            }
            
            rowDiv.appendChild(cellDiv);
        });
        tableDiv.appendChild(rowDiv);
    });

    return tableDiv;
}