const Player = require('./player');
const Gameboard = require('./gameboard');

test('new Player("computer") should create a player with the type attribute set to computer', () => {
    const player = new Player('computer');
    expect(player.type).toBe('computer');

});

test('new Player("computer") should create a player with the type attribute set to computer', () => {
    const player = new Player('computer');
    expect(player.type).toBe('computer');

});

test('new Player(type) should create a player with a gameboard attribute', () => {
    const player = new Player('computer');
    expect(player.board).toBeInstanceOf(Gameboard);

});