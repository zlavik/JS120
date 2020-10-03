let book = {
  title: "Snow Crash",
  author: "Neal Stephenson",
  getDescription() {
    return `${this.title} by ${this.author}`;
  },
};

// desired return value: 'Snow Crash by Neal Stephenson'
book.getDescription(); // => ReferenceError: title is not defined