let cat = {
  name: 'Tutu',

  makeNoise() {
    console.log('Meow!');
  },
};

let dog = {
  name : 'Bella', 

  makeNoise() {
    console.log('Woof!');
  },
};


let bob = {
  name : 'Bob',
  heros: ['Bob Ross', 'Mr Roger', 'Elmo'],
  cash: { ones: 12, fives: 2, tens: 1, twenties: 3, hundreds: 0},
  pets: [cat, dog],

  allHeros() {
    return this.heros.join(', ');
  },

  printName() {
    console.log(`My name is ${this.name}!`);
    console.log(`My pet's name is ${this.pet.name}`);
  }
};

bob.pets[1].makeNoise();