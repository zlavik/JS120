let cup = {
  type : 'glass cup',
  liquidLevel : 0.9,
  held: false,

  grab() {
    this.held = true;
  },

  drink() {
    this.liquidLevel =- 0.1;
  },

  putDownthis() {
    this.held = false;
  },

  pourWater(percent) {
    if ((this.liquidLevel + (percent / 100)) <= 1) {
      this.liquidLevel += (percent / 100);
    } else {
      this.liquidLevel = 1;
    }
  },
};
