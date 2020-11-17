let carArgs = {
  make: 'make',
  model: 'model',
  year: 'year',
  color: 'color',
  passengers: 'passengers',
  convertible: 'convertible',
  mileage: 'mileage'
};

let carFunctions = {
  start() {
    this.isOn = true;
  },
  stop() {
    this.isOn = false;
  },
};

function Car(args) {
  Object.assign(this, args);
  Object.setPrototypeOf(this, carFunctions);
}

let civic = new Car(carArgs);

let bmw = new Car(carArgs);

console.log(civic.hasOwnProperty('start'));