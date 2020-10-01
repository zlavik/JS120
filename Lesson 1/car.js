
function createCar(make, fuelLevel, engineOn) {
  return {
    Make : make,
    fuelLvl: fuelLevel,
    engineStatus: engineOn,

    startEngine() {
      this.engineStatus = true;
    },

    drive() {
      this.fuelLvl -= 0.1;
    },

    stopEngine() {
      this.engineStatus = false;
    },

    refuel(percent) {
      if ((this.fuelLvl + (percent / 100)) <= 1) {
        this.fuelLvl += (percent / 100);
      } else {
        this.fuelLvl = 1;
      }
    },
  }
}

let bmw = createCar('BMW', 0.5, false);

let ferrari = createCar('Ferrari', 0.7, true);

let lada = createCar('Lada', 1, false);