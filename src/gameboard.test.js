const Gameboard = require('./gameboard');
const Ship = require('./ship');

test('placeShip(length, row, col, direction) should place a ship at the following location', () => {
    const gameboard = new Gameboard();
    

    gameboard.placeShip(3, 0, 0, 'right');

    const expectedBoard = Array.from({ length: 10 }, () => new Array(10).fill(0));
    const ship = new Ship(3);

    expectedBoard[0][0] = ship;
    expectedBoard[0][1] = ship;
    expectedBoard[0][2] = ship;

    expect(gameboard.board).toEqual(expectedBoard);
    
});

test('placeShip(length, row, col, direction) should place a ship at the following location', () => {
    const gameboard = new Gameboard();
    

    gameboard.placeShip(5, 5, 5, 'down');

    const expectedBoard = Array.from({ length: 10 }, () => new Array(10).fill(0));
    const ship = new Ship(5);

    expectedBoard[5][5] = ship;
    expectedBoard[6][5] = ship;
    expectedBoard[7][5] = ship;
    expectedBoard[8][5] = ship;
    expectedBoard[9][5] = ship;

    expect(gameboard.board).toEqual(expectedBoard);
    
});

test('placeShip(length, row, col, direction) should throw error if we pass an invalid direction', () => {
    const gameboard = new Gameboard();
    
    expect(() => gameboard.placeShip(5, 5, 5, 'test')).toThrow('Invalid direction');
    
});

test('placeShip(length, row, col, direction) should throw error if try to place ship out of bounds', () => {
    const gameboard = new Gameboard();
    
    expect(() => gameboard.placeShip(5, -1, -1, 'left')).toThrow('out of bounds');
    
});

test('receiveAttack(row, col) should increment the hits on the ship when it is hit', () => {
    const gameboard = new Gameboard();
    
    gameboard.placeShip(3, 0, 0, 'right');

    gameboard.receiveAttack(0, 0);

    expect(gameboard.board[0][0].hits).toBe(1);
    
});

test('receiveAttack(row, col) should note a miss when ship is not there', () => {
    const gameboard = new Gameboard();
    
    gameboard.placeShip(3, 0, 0, 'right');

    gameboard.receiveAttack(1, 0);

    expect(gameboard.board[1][0]).toBe(-1);
    
});

test('allShipsSunk() should note when all ships are sunk on the gameboard', () => {
    const gameboard = new Gameboard();
    
    gameboard.placeShip(3, 0, 0, 'right');

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(0, 2);

    expect(gameboard.allShipsSunk()).toBe(true);
    
});

test('allShipsSunk() should note when not all ships are sunk on the gameboard', () => {
    const gameboard = new Gameboard();
    
    gameboard.placeShip(3, 0, 0, 'right');

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(0, 2);

    gameboard.placeShip(3, 3, 3, 'right');

    expect(gameboard.allShipsSunk()).toBe(false);
    
});