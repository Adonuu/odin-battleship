const Ship = require('./ship');

test('hit() should increase hits by 1', () => {
    const ship = new Ship(3);
    expect(ship.hits).toBe(0);

    ship.hit();
    expect(ship.hits).toBe(1);

    ship.hit();
    expect(ship.hits).toBe(2);
});

test('isSunk() should return false if ship.hits < ship.length', () => {
    const ship = new Ship(3);
    expect(ship.isSunk()).toBe(false);
});

test('isSunk() should return true if ship.hits = ship.length', () => {
    const ship = new Ship(1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

test('isSunk() should return true if ship.hits > ship.length', () => {
    const ship = new Ship(1);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});