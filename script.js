class Books {
  constructor() {
    this.sortCheckFlag = 1;
    this.bookList = [];
  }

  async getBooks() {
    try {
      const res = await fetch("data/books.json");
      const fetchedBooks = await res.json();
      this.bookList = fetchedBooks;
      insertToTable(this.bookList, tableAllBooks);
    } catch (error) {
      console.log(error);
    }
  }

  searchById() {
    const id = Number(document.querySelector(".js-input-search-id").value);
    if (id) {
      const book = this.bookList.find((book) => book.bookId === id);
      if (book) {
        insertToTable([book], tableSimilarBooks);
      } else {
        alert(`Book of id ${id} not found.`);
      }
    } else {
      alert("Please Enter valid Book id!");
    }
  }

  searchByGenre() {
    const bookGenre = document.querySelector(".js-input-search-genre").value;
    if (bookGenre) {
      const similarBooksByGenre = this.bookList.filter((book) =>
        book.genre.toLowerCase().includes(bookGenre.toLowerCase())
      );
      insertToTable(similarBooksByGenre, tableSimilarBooks);
    } else {
      alert("Please Enter valid input!");
    }
  }

  searchByPrice() {
    const price = Number(
      document.querySelector(".js-input-search-price").value
    );
    if (price) {
      const similarBooksByPrice = this.bookList.filter(
        (book) => Math.abs(book.price - price) < 10
      );
      insertToTable(similarBooksByPrice, tableSimilarBooks);
    } else {
      alert("Please Enter valid input!");
    }
  }

  examineBook(bookId) {
    const book = this.bookList.find((book) => book.bookId === bookId);
    const list = document.querySelector(".js-list-examined-book");
    list.querySelector(".js-li-bookid").innerHTML = book.bookId;
    list.querySelector(".js-li-price").innerHTML = book.price;
    list.querySelector(".js-li-genre").innerHTML = book.genre;
  }

  sortByPrice() {
    // for ascending/descending
    this.sortCheckFlag = -this.sortCheckFlag;
    const booksCopy = [...this.bookList];
    booksCopy.sort((a, b) => this.sortCheckFlag * (a.price - b.price));
    insertToTable(booksCopy, tableAllBooks);
  }
}

const insertToTable = (booksArray, table) => {
  deleteAllRows(table);
  booksArray.forEach((book) => {
    const row = table.insertRow();
    row.insertCell(0).innerHTML = book.bookId;
    row.insertCell(1).innerHTML = book.genre;
    row.insertCell(2).innerHTML = book.price;
    row.insertCell(
      3
    ).innerHTML = `<button class='btn' onclick='books.examineBook(${book.bookId})'>Examine</button>`;
  });
};

const deleteAllRows = (table) => {
  const rows = table.rows.length;
  for (let i = rows - 1; i > 0; i--) {
    table.deleteRow(i);
  }
};

const books = new Books();
const tableSimilarBooks = document.querySelector(".js-table-similar-books");
const tableAllBooks = document.querySelector(".js-table-all-books");

books.getBooks();

document
  .querySelector(".js-btn-search-id")
  .addEventListener("click", books.searchById.bind(books));
document
  .querySelector(".js-btn-search-genre")
  .addEventListener("click", books.searchByGenre.bind(books));
document
  .querySelector(".js-btn-search-price")
  .addEventListener("click", books.searchByPrice.bind(books));
document
  .querySelector(".js-sort-table-price")
  .addEventListener("click", books.sortByPrice.bind(books));
