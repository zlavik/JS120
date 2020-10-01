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

function displayMessage(key) {
  let message = MESSAGES[key];
  console.log(`${message}`);
}

const difficulty = {
  LOSING_MOVES: {
    rock: ['paper', 'spock'],
    paper: ['scissors', 'lizard'],
    scissors: ['rock', 'spock'],
    spock: ['paper', 'lizard'],
    lizard: ['scissors', 'rock']
  },

  getInitialState() {
    let states = {};

    for (let move1 of VALID_MOVES) {
      for (let move2 of VALID_MOVES) {
        let lastTwoMoves = move1 + move2;
        states[lastTwoMoves] = {};
        states[lastTwoMoves]['total'] = 0;

        for (let nextMove of VALID_MOVES) {
          states[lastTwoMoves][nextMove] = { count: 0, probability: 0.2 };
        }
      }
    }

    return states;
  },

  updateStateCount(statesObject, opponentMoves) {
    for (let index = 2; index < opponentMoves.length; index += 1) {
      let previousMoves = opponentMoves[index - 2]
        + opponentMoves[index - 1];
      let nextMove = opponentMoves[index];

      statesObject[previousMoves]['total'] += 1;
      statesObject[previousMoves][nextMove]['count'] += 1;
    }
  },

  updateStateProbability(statesObject) {
    for (let previousMoves in statesObject) {
      let total = statesObject[previousMoves]['total'];

      if (total > 0) {
        for (let nextMove of VALID_MOVES) {
          statesObject[previousMoves][nextMove]['probability'] =
            statesObject[previousMoves][nextMove]['count'] / total;
        }
      }
    }
  },

  getNextPossibleMove(previousMovesObject) {
    let possibleNextMoves = VALID_MOVES.slice();

    possibleNextMoves.sort((a, b) => {
      return previousMovesObject[b]['probability'] -
        previousMovesObject[a]['probability'];
    });

    return possibleNextMoves[0];
  },

  getEasyMove() {
    let randomIndex = Math.floor(Math.random() * VALID_MOVES.length);
    let choice = VALID_MOVES[randomIndex];

    return choice;
  },

  getHardMove(opponenthandHistory) {
    if (opponenthandHistory.length < 3) return this.getEasyMove();

    let states = this.getInitialState();

    let recentOpponentMoves = opponenthandHistory.slice(-50);

    this.updateStateCount(states, recentOpponentMoves);
    this.updateStateProbability(states);

    let previousMoves = recentOpponentMoves.slice(-2).join('');

    if (states[previousMoves]['total']
     === 0) return this.getEasyMove();

    let opponentNextMove = this.getNextPossibleMove(states[previousMoves]);

    let randomIndex = Math.floor(Math.random() *
      this.LOSING_MOVES[opponentNextMove].length);

    return this.LOSING_MOVES[opponentNextMove][randomIndex];
  }
};

const validUserInput = {
  fetchPlayerMove() {
    let choice;
    while (true) {
      displayMessage('chooseHand');
      choice = readline.question('=> ').toLowerCase();
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

  fetchDifficulty() {
    let answer;
    while (true) {
      displayMessage('chooseDifficulty');
      answer = readline.question('=> ').toLowerCase();

      if (['e', 'h', 'easy', 'hard'].includes(answer)) {
        console.clear();
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }
    return answer;
  },

  fetchPlayAgain() {
    let answer;
    while (true) {
      displayMessage('playAgain');
      answer = readline.question('=> ').toLowerCase();

      if (['y', 'n', 'yes', 'no'].includes(answer)) {
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }
    return answer;
  },

};

function createPlayer() {
  return {
    handHistory: [],
    getLastMove() {
      return this.handHistory[this.handHistory.length - 1];
    }
  };
}

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    difficulty: difficulty,

    choose(difficultyType, opponentMoves) {
      if (difficultyType === 'easy') {
        this.handHistory.push(this.getEasyMove());
      } else if (difficultyType === 'hard') {
        this.handHistory.push(this.getHardMove(opponentMoves));
      }
    },
  };

  return Object.assign(playerObject, difficulty,
    computerObject);
}

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    choose() {
      let choice = validUserInput.fetchPlayerMove();
      this.handHistory.push(choice);
    },
  };
  return Object.assign(playerObject, humanObject);
}

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
    let lineWidth = 55;
    let message = MESSAGES['welcomeMessage'];
    let message2 = `This game is best out of ${this.maxScore}.`;

    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - message.length) / 2) + message);
    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - message2.length) / 2) + message2);
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
    let humanRecentMoves = this.human.handHistory.slice(-7);
    let computerRecentMoves = this.computer.handHistory.slice(-7);

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
    console.log();
    return validUserInput.fetchPlayAgain()[0] === 'y';
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

  playRound(computerdifficulty) {
    this.displayGameScore();

    this.displayRecentMoves();

    if (['h', 'hard'].includes(computerdifficulty)) {
      this.computer.choose('hard', this.human.handHistory);
    } else if (['e', 'easy'].includes(computerdifficulty)) {
      this.computer.choose('easy');
    }

    this.human.choose();

    this.displayRoundChoices();

    let roundWinner = this.getRoundWinner();
    this.updateGameScore(roundWinner);
    this.displayRoundWinner(roundWinner);
  },

  getDifficulty() {
    return validUserInput.fetchDifficulty();
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