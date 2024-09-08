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

export function renderPieces() {
    const shipLengths = [5, 4, 3, 3, 2];

    let baseDiv = document.createElement('div');
    baseDiv.id = 'Ships';

    // get width of td cell
    const tdWidth = document.querySelector('td').clientWidth;
    const tdHeight = document.querySelector('td').clientHeight;

    shipLengths.forEach((length, index) => {
        let shipDiv = document.createElement('div');
        shipDiv.style.width = `${length * tdWidth}px`;
        shipDiv.style.height = `${tdHeight}px`;
        shipDiv.id = 'Ship' + index;
        shipDiv.draggable = true;
        shipDiv.classList.add('_' + length);
        shipDiv.addEventListener('dragstart',(e) => {
            const rect = e.target.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            const shipWidth = e.target.style.width;
            const shipHeight = e.target.style.height;
            const shipLength = length;

            // Add the offset data to the drag event
            e.dataTransfer.setData('id', e.target.id);
            e.dataTransfer.setData('offsetX', offsetX);
            e.dataTransfer.setData('offsetY', offsetY);
            e.dataTransfer.setData('shipWidth', shipWidth);
            e.dataTransfer.setData('shipHeight', shipHeight);
            e.dataTransfer.setData('shipLength', shipLength);
        });
        baseDiv.appendChild(shipDiv);
    });

    return baseDiv;
}

export function rotateShips() {
    const shipDiv = document.querySelector('#Ships');


    // get width of td cell
    const tdWidth = document.querySelector('td').clientWidth;
    const tdHeight = document.querySelector('td').clientHeight;

    let orientation = '';

    Array.from(shipDiv.children).forEach(ship => {
        // get length from classlist
        let className = ship.classList.item(0);
        let length = parseInt(className.slice(1), 10);
        // if ship width doesn't equal one cell's width that means we are currently in horizontal display
        if (ship.clientWidth != tdWidth) {
            ship.style.width = `${tdWidth}px`;
            ship.style.height = `${length * tdHeight}px`;
            shipDiv.style.flexFlow = 'row wrap';
            orientation = 'down';
        } else {
            ship.style.width = `${length * tdWidth}px`;
            ship.style.height = `${tdHeight}px`;
            shipDiv.style.flexFlow = 'column wrap';
            orientation = 'right';
        }
    });

    return orientation;
}