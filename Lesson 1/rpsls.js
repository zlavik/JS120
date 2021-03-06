const readline = require('readline-sync');
const MESSAGES = require('./rpsls_Messages.json');
const VALID_MOVES = ['rock', 'paper', 'scissors', 'spock', 'lizard'];

function displayMessage(key) {
  let message = MESSAGES[key];
  console.log(`${message}`);
}

const validUserInput = {
  VALID_CHOICES : {
    r: 'rock',
    p: 'paper',
    ss: 'scissors',
    sp: 'spock',
    l: 'lizard'
  },

  fetchPlayerMove() {
    let choice;
    while (true) {
      displayMessage('chooseHand');
      choice = readline.question('=> ').toLowerCase();
      if (VALID_MOVES.includes(choice) ||
        Object.keys(this.VALID_CHOICES).includes(choice)) {
        break;
      } else {
        displayMessage('invalidChoice');
      }
    }
    if (Object.keys(this.VALID_CHOICES).includes(choice)) {
      choice = this.VALID_CHOICES[choice];
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

  fetchSelectMenu() {
    let answer;
    while (true) {
      displayMessage('selectMenu');
      answer = readline.question('=> ').toLowerCase();

      if (['1', '2', '3', '4'].includes(answer)) {
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
    score: 0,
    getLastMove() {
      return this.handHistory[this.handHistory.length - 1];
    }
  };
}

function createHuman() {
  let playerObject = createPlayer();
  let humanObject = {
    chooseMove() {
      let choice = validUserInput.fetchPlayerMove();
      this.handHistory.push(choice);
    },
  };
  return Object.assign(playerObject, humanObject);
}

const difficulty = {
  LOSING_COMBOS: {
    rock: ['paper', 'spock'],
    paper: ['scissors', 'lizard'],
    scissors: ['rock', 'spock'],
    spock: ['paper', 'lizard'],
    lizard: ['scissors', 'rock']
  },

  getInitialState() {
    let states = {};

    for (let firstMove of VALID_MOVES) {
      for (let secondMove of VALID_MOVES) {
        let lastTwoMoves = firstMove + secondMove;
        states[lastTwoMoves] = {};
        states[lastTwoMoves]['total'] = 0;
        for (let nextMove of VALID_MOVES) {
          states[lastTwoMoves][nextMove] = { count: 0, probability: 0.2 };
        }
      }
    }
    return states;
  },

  updateStateCount(state, playerMoves) {
    for (let index = 2; index < playerMoves.length; index += 1) {
      let previousMoves = playerMoves[index - 2] + playerMoves[index - 1];
      let nextMove = playerMoves[index];
      state[previousMoves]['total'] += 1;
      state[previousMoves][nextMove]['count'] += 1;
    }
  },

  updateStateProbability(state) {
    for (let previousMoves in state) {
      let total = state[previousMoves]['total'];
      if (total > 0) {
        for (let nextMove of VALID_MOVES) {
          state[previousMoves][nextMove]['probability'] =
            state[previousMoves][nextMove]['count'] / total;
        }
      }
    }
  },

  getNextPossibleMove(previousMovesObject) {
    let possibleNextMoves = VALID_MOVES.slice().sort((a, b) => {
      return previousMovesObject[b]['probability'] -
        previousMovesObject[a]['probability'];
    });
    return possibleNextMoves[0];
  },

  getEasyMove() {
    return VALID_MOVES[Math.floor(Math.random() * VALID_MOVES.length)];
  },

  getHardMove(opponenthandHistory) {
    if (opponenthandHistory.length < 3) return this.getEasyMove();

    let states = this.getInitialState();
    let recentOpponentMoves = opponenthandHistory.slice(-50);
    this.updateStateCount(states, recentOpponentMoves);
    this.updateStateProbability(states);
    let previousMoves = recentOpponentMoves.slice(-2).join('');

    if (states[previousMoves]['total'] === 0) return this.getEasyMove();

    let opponentNextMove = this.getNextPossibleMove(states[previousMoves]);
    let randomIndex = Math.floor(Math.random() *
      this.LOSING_COMBOS[opponentNextMove].length);

    return this.LOSING_COMBOS[opponentNextMove][randomIndex];
  }
};

function createComputer() {
  let playerObject = createPlayer();
  let computerObject = {
    difficulty,

    chooseMove(difficultyType, playerMoves) {
      if (['easy', 'e'].includes(difficultyType)) {
        this.handHistory.push(this.getEasyMove());
      } else {
        this.handHistory.push(this.getHardMove(playerMoves));
      }
    },
  };

  return Object.assign(playerObject, difficulty, computerObject);
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
  maxScore: 5,


  displayWelcomeMessage() {
    console.clear();
    let lineWidth = 55;
    let message = MESSAGES['welcomeMessage'];
    let message2 = `This game is best out of ${this.maxScore}.`;

    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - message.length) / 2) + message);
    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - message2.length) / 2) + message2);
    this.wait(2000);
    console.clear();
  },

  displayExitMessage() {
    displayMessage('exitMessage');
  },

  displayGameScore() {
    displayMessage('score');
    console.log(`Player: ${this.human.score} | Computer: ${this.computer.score}\n`);
  },

  displayRecentMoves() {
    let humanRecentMoves = this.human.handHistory.slice(-20);
    let computerRecentMoves = this.computer.handHistory.slice(-20);

    if (humanRecentMoves.length > 0) {
      console.clear();
      console.log(`Player's move(s): ${humanRecentMoves.join(', ')}`);
      console.log(`Computer's move(s): ${computerRecentMoves.join(', ')}\n`);
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
      this.human.score += 1;
    } else if (roundWinner === 'computer') {
      this.computer.score += 1;
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
    return validUserInput.fetchPlayAgain()[0] === 'y';
  },

  isGameOver() {
    return (this.human.score === this.maxScore ||
      this.computer.score === this.maxScore);
  },

  getGameWinner() {
    return this.human.score > this.computer.score ? 'human' : 'computer';
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
    this.computer.score = 0;
    this.human.score = 0;

    console.clear();
  },

  playRound(computerdifficulty) {
    let humanHistory = this.human.handHistory;
    this.displayGameScore();

    this.computer.chooseMove(computerdifficulty, humanHistory);

    this.human.chooseMove();

    this.displayRoundChoices();

    let roundWinner = this.getRoundWinner();
    this.updateGameScore(roundWinner);
    this.displayRoundWinner(roundWinner);
  },

  getDifficulty() {
    return validUserInput.fetchDifficulty();
  },

  wait(ms) {
    let waitUntil = new Date().getTime() + ms;
    while (new Date().getTime() < waitUntil);
  },

  play() {
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
    this.displayRecentMoves();
    this.exitGame();
  },
  displayMenu() {
    let lineWidth = 55;
    let menuMsg = MESSAGES['mainMenu'];
    let playMsg = '1> Play';
    let rulesMsg = '2> Rules';
    let exitMsg = '3> Exit';

    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - menuMsg.length) / 2) + menuMsg);
    console.log('='.repeat(lineWidth));
    console.log(' '.padStart((lineWidth - 2 - playMsg.length) / 2) + playMsg);
    console.log(' '.padStart((lineWidth - rulesMsg.length) / 2) + rulesMsg);
    console.log(' '.padStart((lineWidth - 2 - exitMsg.length) / 2) + exitMsg);
    console.log('='.repeat(lineWidth));
  },

  displayRules() {
    displayMessage('rules');
    displayMessage('continue');
    readline.question('=>');
    console.clear();
    this.mainMenu();
  },

  selectMenu(answer) {
    switch (answer) {
      case '1':
        this.play();
        break;
      case '2':
        this.displayRules();
        break;
      case '3':
        this.exitGame();
        break;
    }
  },

  exitGame() {
    this.displayExitMessage();
  },

  mainMenu() {
    this.displayMenu();
    this.selectMenu(validUserInput.fetchSelectMenu());
  },

  start() {
    this.displayWelcomeMessage();
    this.mainMenu();
  }

};

RPSSLGame.start();
