/*
input: player makes a choice(number)
output: string(winner)

RPS is a two-player game where each player chooses one of three possible moves:
rock, paper, or scissors. The winner is chosen by comparing their moves
with the following

rules:
  -Rock crushes scissors, i.e., rock wins against scissors.
  -Scissors cuts paper, i.e., scissors beats paper.
  -Paper wraps rock, i.e., paper beats rock.
  -If the players chose the same move, the game is a tie.

Nouns: player, move, rule
Verbs: choose, compare

*/
const readline = require('readline-sync');
const WINNING_MOVES = {
  rock     : ['scissors', 'lizard'],
  paper    : ['spock', 'rock'],
  scissors : ['paper', 'lizard'],
  lizard   : ['paper', 'spock'],
  spock    : ['rock', 'scissors']
};
const FULL_NAMES = {
  ss: 'scissors',
  r: 'rock',
  p: 'paper',
  l: 'lizard',
  sp: 'spock'
};
const VALID_CHOICES = Object.keys(FULL_NAMES);


function createComputer() {
  let playerObject = createPlayer();

  let computerObject = {
    choose() {
      const choices = VALID_CHOICES;
      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move = choices[randomIndex];
      this.history.push(FULL_NAMES[this.move]);
    },
  };
  return Object.assign(computerObject, playerObject);
}

function createPlayer() {
  return {
    move: null,
    score : 0,
    history : [],
  };
}

function createHuman() {
  let playerObject = createPlayer();

  let humanObject = {
    choose() {
      let choice;

      while (true) {
        console.log('Please choose rock, paper, scissors, lizard, or spock');
        console.log('Choose: (r, p, ss, l, sp)');
        choice = readline.question();
        if (VALID_CHOICES.includes(choice)) break;
        console.clear();
        console.log('Sorry, invalid choice.');
      }
      this.move = choice;
      this.history.push(FULL_NAMES[this.move]);
    },
  };
  return Object.assign(playerObject, humanObject);
}

function wait(ms) {
  let waitUntil = new Date().getTime() + ms;
  while (new Date().getTime() < waitUntil);
}

const RPSGame = {
  human: createHuman(),
  computer: createComputer(),

  displayWelcomeMessage() {
    console.clear();
    console.log('Welcome to Rock, Paper, Scissors, Lizard, Spock!');
    wait(1250);
    console.clear();
  },
  displayMoveHistory() {
    console.log(`Computer history: ${this.computer.history.join(', ')}\nPlayer history: ${this.human.history.join(', ')}`);
  },

  displayerGoodbyeMessage() {
    console.clear();
    console.log('Thank you for playing!');
  },

  displayScore() {
    console.log(`Computer: ${this.computer.score} | Player: ${this.human.score}`);
  },

  displayRoundWinner() {
    let humanMove = FULL_NAMES[this.human.move];
    let computerMove = FULL_NAMES[this.computer.move];

    if (WINNING_MOVES[humanMove].includes(computerMove)) {
      this.human.score++;
      this.displayScore();
      console.log(`Computer: ${computerMove} Vs Player: ${humanMove}\nPlayer wins the round!`);
    } else if (WINNING_MOVES[computerMove].includes(humanMove)) {
      this.computer.score++;
      this.displayScore();
      console.log(`Computer: ${computerMove} Vs Player: ${humanMove}\nComputer wins the round!`);
    } else {
      this.displayScore();
      console.log("It's a tie round");
    }
  },

  playAgain() {
    let answer;
    while (true) {
      console.log('Would you like to play again? (y/n)');
      answer = readline.question();
      if (['y', 'n'].includes(answer.toLowerCase())) break;
      console.log('Sorry, invalid choice.');
    }
    if (answer === 'y') {
      this.human.score = 0;
      this.computer.score = 0;
    } else if (answer === 'n') {
      return false;
    }
    return true;
  },

  play() {
    this.displayWelcomeMessage();
    while (true) {
      while (this.human.score < 3 && this.computer.score < 3) {
        this.human.choose();
        this.computer.choose();
        console.clear();
        this.displayRoundWinner();
        this.displayMoveHistory();
      }
      if (!this.playAgain()) break;
    }
    this.displayerGoodbyeMessage();
  },
};

RPSGame.play();