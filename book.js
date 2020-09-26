function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,
    getDescription() {
      console.log(`${this.title} was written by ${this.author}. I ${this.read ? 'have' : "haven't"} read it.`);
    },
    readBook() {
      this.read = true;
    }
  }
};

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris');
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse');

book2.getDescription(); // Mythos was written by David Fry. I haven't read it.
book2.readBook();
book2.getDescription(); // Mythos was written by David Fry. I have read it.