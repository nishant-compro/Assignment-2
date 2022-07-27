class Books {
  constructor() {
    this.sortCheckFlag = 1;
    this.tableSimilarBooks = document.querySelector(".js-table-similar-books");
    this.tableAllBooks = document.querySelector(".js-table-all-books");
    this.bookList = [];
  }

  addBookList(books) {
    this.bookList = books;
  }
}

document.querySelector(".js-btn-search-id").addEventListener('click', searchById);
document.querySelector(".js-btn-search-genre").addEventListener('click', searchByGenre);
document.querySelector(".js-btn-search-price").addEventListener('click', searchByPrice);
document.querySelector(".js-sort-table-price").addEventListener('click', sortByPrice);

const books = new Books();

getBooks();

async function getBooks() {
  try {
    let fetchedBooks = await fetch("data/books.json").then((res) => res.json());
    books.addBookList(fetchedBooks);
    insertToTable(books.bookList, books.tableAllBooks);
  } catch (error) {
    console.log(error);
  }
}



function searchById() {
  let id = Number(document.querySelector(".js-input-search-id").value);
  if (id) {
    let book = books.bookList.find(book => book.bookId === id);
    if (book) {
      insertToTable([book], books.tableSimilarBooks);
    }
    else {
      alert(`Book of id ${id} not found.`);
    }
  }
  else {
    alert("Please Enter valid Book id!");
  }
}

function searchByGenre() {
  let bookGenre = document.querySelector(".js-input-search-genre").value;
  if (bookGenre) {
    let similarBooksByGenre = books.bookList.filter(book => book.genre.toLowerCase().includes(bookGenre.toLowerCase()));
    insertToTable(similarBooksByGenre, books.tableSimilarBooks);
  }
  else {
    alert("Please Enter valid input!");
  }
}

function searchByPrice() {
  let price = Number(document.querySelector(".js-input-search-price").value);
  if (price) {
    let similarBooksByPrice = books.bookList.filter(book => Math.abs(book.price - price) < 2);
    insertToTable(similarBooksByPrice, books.tableSimilarBooks);
  }
  else {
    alert("Please Enter valid input!");
  }
}

function examineBook(bookId) {
  let book = books.bookList.find(book => book.bookId === bookId);
  let list = document.querySelector(".js-list-examined-book");
  list.children[0].children[0].innerHTML = book.bookId;
  list.children[1].children[0].innerHTML = book.price;
  list.children[2].children[0].innerHTML = book.genre;
}

function sortByPrice() {
  // for ascending/descending
  books.sortCheckFlag = -books.sortCheckFlag;
  let booksCopy = [...books.bookList];
  booksCopy.sort((a, b) => books.sortCheckFlag * (a.price - b.price));
  insertToTable(booksCopy, books.tableAllBooks);
}

function insertToTable(booksArray, table) {
  deleteAllRows(table);
  booksArray.forEach(book => {
    let row = table.insertRow();
    row.insertCell(0).innerHTML = book.bookId;
    row.insertCell(1).innerHTML = book.genre;
    row.insertCell(2).innerHTML = book.price;
    row.insertCell(3).innerHTML = `<button class="btn" onclick="examineBook(${book.bookId})">Examine</button>`;
  });
}

function deleteAllRows(table) {
  let rows = table.rows.length;
  for (let i = rows - 1; i > 0; i--) {
    table.deleteRow(i);
  }
}
