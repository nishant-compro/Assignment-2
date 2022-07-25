let books = [];
let sortCheckFlag = 1;
let tableSimilarBooks = document.getElementById("table-similar-books");
let tableAllBooks = document.getElementById("table-all-books");

document.getElementById("btn-search-id").addEventListener('click', searchById);
document.getElementById("btn-search-genre").addEventListener('click', searchByGenre);
document.getElementById("btn-search-price").addEventListener('click', searchByPrice);
document.getElementById("sort-table-price").addEventListener('click', sortByPrice);


getBooks();

async function getBooks() {
    try {
        books = await fetch("data/books.json").then((res) => res.json());
        insertToTable(books, tableAllBooks);
    } catch (error) {
        console.log(error)
    }
}

function searchById() {
    let id = Number(document.getElementById("input-search-id").value);
    if (id) {
        let book = books.find(book => book.bookId === id);
        if (book) {
            insertToTable([book], tableSimilarBooks)
        }
        else{
            alert(`Book of id ${id} not found.`)
        }
    }
    else{
        alert("Please Enter valid Book id!")
    }
}

function searchByGenre() {
    let bookGenre = document.getElementById("input-search-genre").value;
    if (bookGenre) {
        let similarBooksByGenre = books.filter(book => book.genre.toLowerCase().includes(bookGenre.toLowerCase()));
        insertToTable(similarBooksByGenre, tableSimilarBooks);
    }
    else{
        alert("Please Enter valid input!")
    }
}

function searchByPrice() {
    let price = Number(document.getElementById("input-search-price").value);
    if (price) {
        let similarBooksByPrice = books.filter(book => Math.abs(book.price - price) < 2);
        insertToTable(similarBooksByPrice, tableSimilarBooks);
    }
    else{
        alert("Please Enter valid input!")
    }
}

function examineBook(bookId) {
    let book = books.find(book => book.bookId === bookId);
    let list = document.getElementById("list-examined-book");
    list.children[0].children[0].innerHTML = book.bookId;
    list.children[1].children[0].innerHTML = book.price;
    list.children[2].children[0].innerHTML = book.genre;
}

function sortByPrice() {
    // for ascending/descending
    sortCheckFlag = -sortCheckFlag;
    books.sort((a, b) => sortCheckFlag * (a.price - b.price));
    insertToTable(books, tableAllBooks);
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
        table.deleteRow(i)
    }
}
