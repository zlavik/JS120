/*
    Tic Tac Toe is a 2-player board game.
    The board is a 3x3 grid.
    Players take turns marking a square with a
     marker that identifies the player.
    Traditionally, the player to go first uses the marker
     X to mark her squares, and the player to go second uses the marker O.
    The first player to mark 3 squares in a row with her marker wins the game.
    A row can be a horizontal row, a vertical column, or either of the
     two diagonals (top-left to bottom-right and top-right to bottom-left).
    There is one human player and one computer player.
    The human player always moves (places a marker) first in the
     initial version of our game; you can change that later.

Nouns: game, board, square, grid, marker, row, player, human, computer
Verbs: play, mark, move, place

    Game (noun)
    Board (noun)
    Row (noun)
    Square (noun)
    Marker (noun)
    Player (noun)
        Mark (verb)
        Play (verb)
        Human (noun)
        Computer (noun)

For every possible winning combination of squares (a row):
  If the human has marked all 3 squares or the player has marked all 3 squares:
    Someone won! Return true.

Nobody won. Return false.
*/
let readline = require("readline-sync");


class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = 'x';
  static COMPUTER_MARKER = 'o';

  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }
  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; counter++) {
      this.squares[String(counter)] = new Square();
    }
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });
    return markers.length;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  display() {
    console.clear();
    console.log('.-----+-----+-----.');
    console.log('|     |     |     |');
    console.log(`|  ${this.squares['7']}  |  ${this.squares['8']}  |  ${this.squares['9']}  |`);
    console.log('|     |     |     |');
    console.log('+-----+-----+-----+');
    console.log('|     |     |     |');
    console.log(`|  ${this.squares['4']}  |  ${this.squares['5']}  |  ${this.squares['6']}  |`);
    console.log('|     |     |     |');
    console.log('+-----+-----+-----+');
    console.log('|     |     |     |');
    console.log(`|  ${this.squares['1']}  |  ${this.squares['2']}  |  ${this.squares['3']}  |`);
    console.log('|     |     |     |');
    console.log('+-----+-----+-----+');
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }
  getMarker() {
    return this.marker;
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}


class TTTGame {
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],
    [ "4", "5", "6" ],
    [ "7", "8", "9" ],
    [ "1", "4", "7" ],
    [ "2", "5", "8" ],
    [ "3", "6", "9" ],
    [ "1", "5", "9" ],
    [ "3", "5", "7" ],
  ]
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.board.display();
      this.humanMoves();
      if (this.gameOver()) break;
      this.computerMoves();
      if (this.gameOver()) break;
    }
    this.board.display();
    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Tic Tac Toe!');
    readline.question('Press [enter] to play..\n=> ');
  }

  displayGoodbyeMessage() {
    console.log('Thanks for playing, Goodbye!');
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log('You won against an easy opponent! Congrats.');
    } else if (this.isWinner(this.computer)) {
      console.log('You lost against a computer that randomly smashes keys');
    } else {
      console.log('How did this happen? Tie game?');
    }
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }

  humanMoves() {
    let choice;

    while (true) {
      let validChoices = this.board.unusedSquares();
      const prompt = `Choose a square (${validChoices.join(", ")}): `;
      choice = readline.question(prompt);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice");
      console.log('');
    }
    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let validChoices = this.board.unusedSquares();
    let choice;
    do {
      choice = Math.floor((9 * Math.random()) + 1).toString();
    } while (!validChoices.includes(choice));

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }
}

let game = new TTTGame();
game.play();