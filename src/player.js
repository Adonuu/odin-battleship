const Gameboard = require('./gameboard');

class Player {
    constructor(type) {
        this.type = type;
        this.board = new Gameboard();
    }
}

module.exports = Player;