let greetings = {
  morning: 'Good morning, ',
  afternoon: 'Good afternoon, ',
  evening: 'Good evening, ',

  greeting: function(name) {
    let currentHour = (new Date()).getHours();

    if (currentHour < 12) {
      console.log(this.morning + name);
    } else if (currentHour < 18) {
      console.log(this.afternoon + name);
    } else {
      console.log(this.evening + name);
    }
  }
};

let spanishWords = {
  morning: 'Buenos dias, ',
  afternoon: 'Buenas tardes, ',
  evening: 'Buena noches, '
};

let russianWords = {
  morning: 'Доброе утро, ',
  afternoon: 'Добрый день, ',
  evening: 'Добрый вечер, '
};

let spanishGreeter = greetings.greeting.bind(spanishWords);
let russinGreeter = greetings.greeting.bind(russianWords);

spanishGreeter('Jose');
spanishGreeter('Juan');

russinGreeter('Alex');

greetings.greeting('Todd');