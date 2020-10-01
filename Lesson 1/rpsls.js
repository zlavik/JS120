const readline = require('readline-sync');
const MESSAGES = require('./rpsls_Messages.json');
const VALID_MOVES = ['rock', 'paper', 'scissors', 'spock', 'lizard'];
const VALID_CHOICES = {
  r: 'rock',
  p: 'paper',
  ss: 'scissors',
  sp: 'spock',
  l: 'lizard'
};

const displayMessage = (key) => {
  let message = MESSAGES[key];
  console.log(`${message}`);
};

const createPlayer = () => {
  return {
    handHistory: [],
    getLastMove() {
      return this.handHistory[this.handHistory.length - 1];
    }
  };
};


let strategy = {
  LOSING_MOVES: {
    rock: ['paper', 'spock'],
    paper: ['scissors', 'lizard'],
    scissors: ['rock', 'spock'],
    spock: ['paper', 'lizard'],
    lizard: ['scissors', 'rock']
  },

  getNextRandomMove() {
    let randomIndex = Math.floor(Math.random() * VALID_MOVES.length);
    let choice = VALID_MOVES[randomIndex];

    return choice;
  },

  getStartingStates() {
    let states = {};

    for (let move1 of VALID_MOVES) {
      for (let move2 of VALID_MOVES) {
        let lastTwoMoves = move1 + move2;
        states[lastTwoMoves] = {};
        states[lastTwoMoves]['totalCount'] = 0;

        for (let nextMove of VALID_MOVES) {
          states[lastTwoMoves][nextMove] = { count: 0, possibility: 0.2 };
        }
      }
    }

    return states;
  },

  updateStatesCount(statesObject, opponentMoves) {
    for (let index = 2; index < opponentMoves.length; index += 1) {
      let previousMoves = opponentMoves[index - 2]
        + opponentMoves[index - 1];
      let nextMove = opponentMoves[index];

      statesObject[previousMoves]['totalCount'] += 1;
      statesObject[previousMoves][nextMove]['count'] += 1;
    }
  },

  updateStatesPossibilities(statesObject) {
    for (let previousMoves in statesObject) {
      let totalCount = statesObject[previousMoves]['totalCount'];

      if (totalCount > 0) {
        for (let nextMove of VALID_MOVES) {
          statesObject[previousMoves][nextMove]['possibility'] =
            statesObject[previousMoves][nextMove]['count'] / totalCount;
        }
      }
    }
  },

  getOpponentNextMove(previousMovesObject) {
    let possibleNextMoves = VALID_MOVES.slice();

    possibleNextMoves.sort((a, b) => {
      return previousMovesObject[b]['possibility'] -
        previousMovesObject[a]['possibility'];
    });

    return possibleNextMoves[0];
  },

  getNexthardMove(opponenthandHistory) {
    if (opponenthandHistory.length < 3) return this.getNextRandomMove();

    let states = this.getStartingStates();

    let recentOpponentMoves = opponenthandHistory.slice(-50);

    this.updateStatesCount(states, recentOpponentMoves);
    this.updateStatesPossibilities(states);

    let previousMoves = recentOpponentMoves.slice(-2).join('');

    if (states[previousMoves]['totalCount']
     === 0) return this.getNextRandomMove();

    let opponentNextMove = this.getOpponentNextMove(states[previousMoves]);

    let randomIndex = Math.floor(Math.random() *
      this.LOSING_MOVES[opponentNextMove].length);

    return this.LOSING_MOVES[opponentNextMove][randomIndex];
  }
};
let validations = {
  fetchPlayerMove(input) {
    let choice;
    while (true) {
      displayMessage(input);
      choice = readline.question().toLowerCase();
      if (VALID_MOVES.includes(choice) ||
        Object.keys(VALID_CHOICES).includes(choice)) {
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }
    if (Object.keys(VALID_CHOICES).includes(choice)) {
      choice = VALID_CHOICES[choice];
    }
    return choice;
  },
};

const createHuman = () => {
  let playerObject = createPlayer();
  let humanObject = {
    choose() {
      let choice = validations.fetchPlayerMove('chooseHand');
      this.handHistory.push(choice);
    },
  };
  return Object.assign(playerObject, humanObject);
};

const createComputer = () => {
  let playerObject = createPlayer();
  let computerObject = {
    strategy: strategy,

    choose(strategyType, opponentMoves) {
      if (strategyType === 'easy') {
        this.handHistory.push(this.getNextRandomMove());
      } else if (strategyType === 'hard') {
        this.handHistory.push(this.getNexthardMove(opponentMoves));
      }
    },
  };

  return Object.assign(playerObject, strategy,
    computerObject);
};


const RPSSLGame = {
  WINNING_MOVES: {
    scissors: ['paper', 'lizard'],
    paper: ['rock', 'spock'],
    rock: ['lizard', 'scissors'],
    lizard: ['spock', 'paper'],
    spock: ['scissors', 'rock']
  },

  human: createHuman(),
  computer: createComputer(),

  humanScore: 0,
  computerScore: 0,
  maxScore: 5,


  displayWelcomeMessage() {
    let lineWidth = 80;
    let message = MESSAGES['welcomeMessage'];

    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - message.length) / 2) + message);
    console.log('='.repeat(lineWidth));
    console.log(`This game is best of ${this.maxScore}.`);
  },

  displayExitMessage() {
    console.clear();
    displayMessage('exitMessage');
  },

  displayGameScore() {
    displayMessage('score');
    console.log(`Player: ${this.humanScore} | Computer: ${this.computerScore}\n`);
  },

  displayRecentMoves() {
    let humanRecentMoves = this.human.handHistory.slice(-20);
    let computerRecentMoves = this.computer.handHistory.slice(-20);

    if (humanRecentMoves.length > 0) {
      console.log();
      console.log(`Player's move(s): ${humanRecentMoves.join(', ')}`);
      console.log(`Computer's move(s): ${computerRecentMoves.join(', ')}`);
    }
  },

  getRoundWinner() {
    let humanMove = this.human.getLastMove();
    let computerMove = this.computer.getLastMove();

    if (this.WINNING_MOVES[humanMove].includes(computerMove)) {
      return 'human';
    } else if (this.WINNING_MOVES[computerMove].includes(humanMove)) {
      return 'computer';
    } else {
      return 'tie';
    }
  },

  updateGameScore(roundWinner) {
    if (roundWinner === 'human') {
      this.humanScore += 1;
    } else if (roundWinner === 'computer') {
      this.computerScore += 1;
    }
  },

  displayRoundChoices() {
    console.clear();

    let humanMove = this.human.getLastMove();
    let computerMove = this.computer.getLastMove();

    console.log(`Player used: ${humanMove}`);
    console.log(`Computer used: ${computerMove}`);
  },

  displayRoundWinner(roundWinner) {
    console.log();

    if (roundWinner === 'human') {
      displayMessage('playerWinsRound');
    } else if (roundWinner === 'computer') {
      displayMessage('computerWinsRound');
    } else {
      displayMessage("tieRound");
    }
  },

  playAnotherGame() {
    let answer;
    console.log();

    while (true) {
      displayMessage('playAgain');
      answer = readline.question().toLowerCase();

      if (['y', 'n', 'yes', 'no'].includes(answer)) {
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }

    return answer.toLowerCase()[0] === 'y';
  },

  isGameOver() {
    return (this.humanScore === this.maxScore ||
      this.computerScore === this.maxScore);
  },

  getGameWinner() {
    return this.humanScore > this.computerScore ? 'human' : 'computer';
  },

  displayGameResults(winner) {
    console.log();

    if (winner === 'human') {
      displayMessage("playerWonGame");
    } else {
      displayMessage("computerWonGame");
    }
  },

  resetGameScores() {
    this.computerScore = 0;
    this.humanScore = 0;

    console.clear();
  },

  playRound(computerStrategy) {
    this.displayGameScore();

    this.displayRecentMoves();

    if (['h', 'hard'].includes(computerStrategy)) {
      this.computer.choose('hard', this.human.handHistory);
    } else if (['e', 'easy'].includes(computerStrategy)) {
      this.computer.choose('easy');
    }

    this.human.choose();

    this.displayRoundChoices();

    let roundWinner = this.getRoundWinner();
    this.updateGameScore(roundWinner);
    this.displayRoundWinner(roundWinner);
  },

  getDifficulty() {
    let choice;

    while (true) {
      displayMessage('chooseDifficulty');
      choice = readline.question().toLowerCase();

      if (['e', 'h', 'easy', 'hard'].includes(choice)) {
        console.clear();
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }
    return choice;
  },

  play() {
    console.clear();
    this.displayWelcomeMessage();
    let difficulty = this.getDifficulty();
    while (true) {
      this.playRound(difficulty);

      if (this.isGameOver()) {
        let gameWinner = this.getGameWinner();
        this.displayGameScore();
        this.displayGameResults(gameWinner);

        if (this.playAnotherGame()) {
          this.resetGameScores();
        } else {
          break;
        }
      }
    }
    this.displayExitMessage();
  }
};


RPSSLGame.play();