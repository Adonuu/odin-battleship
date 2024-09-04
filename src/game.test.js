const Game = require('./game');
const Ship = require('./ship');

test('generateRandomBoard() should generate a total ship length count of 17', () => {
    let game = new Game();

    let shipLengthCount = 0;

    // Iterate through the entire board and check for cells with a ship
    game.humanPlayer.board.board.forEach(row => {
        row.forEach(cell => {
            if (cell.ship instanceof Ship) shipLengthCount++;
        });
    });

    // Check that the total length of ships placed on the board is 17
    expect(shipLengthCount).toBe(17);
})

test('generateRandomAttack() should attack one spot on the board', () => {
    let game = new Game();

    let hitsOrMisses = 0;

    game.generateRandomAttack(game.humanPlayer);

    // Iterate through the entire board and check for cells with a ship
    game.humanPlayer.board.board.forEach(row => {
        row.forEach(cell => {
            if (cell === - 1 || cell.hit === true) hitsOrMisses++;
        });
    });

    // Check that the total length of ships placed on the board is 17
    expect(hitsOrMisses).toBe(1);
})