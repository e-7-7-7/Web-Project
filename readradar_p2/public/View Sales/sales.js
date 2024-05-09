let Books = []; // we store on sale books here for a specific seller
let pendingBooks = []; // all pending Books for all sellers
let transactions = []; // we store sold books here

// we will assume that seller id = 1
loadFiles();

//refrences
const bookAreaTitle = document.querySelector("#list_title");
const bookListArea = document.querySelector("#book_list_area");
const soldButton = document.querySelector("#soldButton");
const onsaleButton = document.querySelector("#onsaleButton");
const allButton = document.querySelector("#allButton");
const pendingButton = document.querySelector("#pendingButton");
const popupArea = document.querySelector("#popupArea");
const popupForm = document.querySelector("#updateBookForm");

// pop-up refrences for updating
const popupTitle = document.querySelector("#title");
const popupAuthor = document.querySelector("#author");
const popupGenre = document.querySelector("#genre");
const popupPrice = document.querySelector("#price");
const popupDescription = document.querySelector("#description");
const popupCover = document.querySelector("#coverImageUrl");
const popupUpdateButton = document.querySelector("#update");
const popupCancelButton = document.querySelector("#cancel");
const popupID = document.querySelector("#id");
const popupQuantity = document.querySelector("#bookQuantity");

// event listeners
soldButton.addEventListener("click", showSoldBooks);
onsaleButton.addEventListener("click", showaddedBooks);
allButton.addEventListener("click", showBooks);
pendingButton.addEventListener("click", showPendingBooks);
popupCancelButton.addEventListener("click", handleCancel);
popupForm.addEventListener("submit", handleSubmit);

// functions

async function loadFiles() {
  // loading the file using fetch
  //   if (!localStorage.addedBooks) {
  //     localStorage.addedBooks = JSON.stringify(Books);
  //   } else {
  //     Books = JSON.parse(localStorage.addedBooks);
  //   }
  //   console.log(Books);

  if (!localStorage.transactions) {
    localStorage.transactions = JSON.stringify(transactions);
  } else {
    transactions = JSON.parse(localStorage.transactions);
  }

  console.log(transactions);

  //   if (localStorage.userRole == "Seller") {
  //   console.log("We enter filter");
  //   const id = localStorage.currentUserID;
  filterBooks(); // filter the books if the role is seller
  //   }
}

async function filterBooks(id) {
  // filters the books after the fetch of the files
  try {
    const response = await fetch(
      `/api/books?currentUserID=${localStorage.currentUserID}&userId=${localStorage.currentUserID}`
    );
    if (response.ok) {
      Books = (await response.json()).data;
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }
  //   Books = Books.filter((b) => b.sellerId == id);
  transactions = [];
  for (book of Books) {
    transactions = [...book.transactions];
  }
  console.log(
    "transactions length for id " + id + " is : " + transactions.length,transactions
  );
}

function showSoldBooks() {
  localStorage.selectedTab = "sold";

  soldButton.classList = "selected"; // setting the background color only to the selected tab
  allButton.classList = "";
  onsaleButton.classList = "";
  pendingButton.classList = "";

  bookListArea.innerHTML = ""; // reset the page
  bookAreaTitle.innerHTML = "<h1>Sold Books</h1>";
  if (transactions.length == 0) {
    bookAreaTitle.innerHTML =
      bookAreaTitle.innerHTML +
      `<h2 style="text-align: center;">There is no sold books related for this account</h2>`;
  } else {
    console.log(transactions);
    bookListArea.innerHTML = transactions
      .map((transaction) => transactionToHTML(transaction))
      .join(" ");
  }
}
Books;
function showBooks() {
  localStorage.selectedTab = "all";

  soldButton.classList = ""; // setting the background color only to the selected tab
  allButton.classList = "selected";
  onsaleButton.classList = "";
  pendingButton.classList = "";

  bookListArea.innerHTML = ""; // reset the page
  console.log("All Books button is clicked");
  bookAreaTitle.innerHTML = "<h1>All Books</h1>";
  const pendingBooks = Books.filter((b) => b.isApproved == false);
  const onSaleBooks = Books.filter((b2) => b2.isApproved);
  if (
    transactions.length == 0 &&
    pendingBooks.length == 0 &&
    onSaleBooks.length == 0
  ) {
    bookAreaTitle.innerHTML =
      bookAreaTitle.innerHTML + "<h2>There is no Books to be displayed</h2>";
  } else {
    bookListArea.innerHTML =
      onSaleBooks.map((b) => onsaleBookToHTML(b)).join(" ") +
      pendingBooks.map((book) => pendingBookToHTML(book)).join(" ") +
      transactions
        .map((transaction) => transactionToHTML(transaction))
        .join(" ");
  }
}

function showaddedBooks() {
  localStorage.selectedTab = "sale";

  soldButton.classList = ""; // setting the background color only to the selected tab
  allButton.classList = "";
  onsaleButton.classList = "selected";
  pendingButton.classList = "";

  bookListArea.innerHTML = ""; // reset the page
  bookAreaTitle.innerHTML = "<h1>On Sale Books</h1>";
  const availableBooks = Books.filter((b) => b.isApproved);
  if (availableBooks.length == 0) {
    bookAreaTitle.innerHTML =
      bookAreaTitle.innerHTML + `<h2>There is no books currently on sale</h2>`;
  } else {
    bookListArea.innerHTML = availableBooks
      .map((b) => onsaleBookToHTML(b))
      .join(" ");
  }
}

function showPendingBooks() {
  localStorage.selectedTab = "pending";

  soldButton.classList = ""; // setting the background color only to the selected tab
  allButton.classList = "";
  onsaleButton.classList = "";
  pendingButton.classList = "selected";
  bookListArea.innerHTML = ""; // reset the page
  bookAreaTitle.innerHTML = "<h1>Pending Approval Books</h1>";
  const pendingBooks = Books.filter((b) => b.isApproved == false);
  if (pendingBooks.length == 0) {
    bookAreaTitle.innerHTML =
      bookAreaTitle.innerHTML + "<h2>No pending books currently</h2>";
  } else {
    bookListArea.innerHTML = pendingBooks
      .map((book) => pendingBookToHTML(book))
      .join(" ");
  }
}

function pendingBookToHTML(book) {
  return `<div class="card">
                    <img src="${book.coverImageUrl}" alt="${book.title}">
    
                    <label for="">Title:</label>
                    <p name="bookTitle" id = "pendingTitle">${book.title}</p>
    
                    
                    <label for="">Author(s):</label>
                    <p>${book.author}</p>
    
                    <label for="">Genre:</label>
                    <p>${book.genre}</p>

                    <label for="">Description:</label>
                    <p>${book.description}</p>
                    
                    <label for="">Price: </label>
                    <p>${book.price} Qr</p>

                    ${
                      localStorage.userRole == "Admin"
                        ? `
                    <label for="">Seller ID: </label>
                    <p>${book.sellerId}</p>`
                        : ``
                    }
    
                    <label for="">Book ID: </label>
                    <p>${book.id}</p>

                    <label for="">Book Quantity: </label>
                    <p>${book.quantity}</p>

                    ${
                      localStorage.userRole == "Admin"
                        ? `
                        <div class="bookButtons">
                        <button class ="bookButton" type="button" id="accept" onclick="acceptBook(${book.id})">Accept</button>
                        <button class ="bookButton" type="button" id="reject" onclick="rejectBook(${book.id})">Reject</button>
                        </div>`
                        : ``
                    }
                </div>`;
}

async function acceptBook(id) {
  try {
    const response = await fetch("/api/books", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isApproved: true,
        id,
      }),
    });
    if (!response.ok) {
      alert((await response.json()).error);
      return;
    }
  } catch (error) {
    alert(error.message);
    return;
  }
  await filterBooks();
  alert("Book has been Accepted and added to the books catalog");
  showSelectedTab();
}

async function rejectBook(id) {
  try {
    const response = await fetch("/api/books", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      alert((await response.json()).error);
      return;
    }
  } catch (error) {
    alert(error.message);
    return;
  }
  await filterBooks();
  alert("Book has been Rejected and Deleted");
  showSelectedTab();
}

function onsaleBookToHTML(book) {
  if (localStorage.userRole) {
    if (book.isApproved) {
      if (localStorage.userRole == "Seller") {
        return `<div class="card">
                    <img src="${book.coverImageUrl}" alt="${book.title}">
    
                    <label for="">Title:</label>
                    <p name="bookTitle" id = "onSaleTitle">${book.title}</p>
    
                    
                    <label for="">Author(s):</label>
                    <p>${book.author}</p>
    
                    <label for="">Genre:</label>
                    <p>${book.genre}</p>
                    
    
                    <label for="">Price: </label>
                    <p>${book.price} Qr</p>

                    <label for="">Quantity: </label>
                    <p>${book.quantity} </p>
    
                    <label for="">Book ID: </label>
                    <p>${book.id}</p>
                    <div class="bookButtons">
                        <button class ="bookButton" type="button" id="updateButton" onclick="mapBook(${book.id})">Update</button>
                        <button class ="bookButton" type="button" id="deleteButton" onclick="deleteBook(${book.id})">Delete</button>
                    </div>
                </div>`;
      } else {
        return `<div class="card">
                    <img src="${book.coverImageUrl}" alt="${book.title}">
    
                    <label for="">Title:</label>
                    <p name="bookTitle" id = "onSaleTitle">${book.title}</p>
    
                    
                    <label for="">Author(s):</label>
                    <p>${book.author}</p>
    
                    <label for="">Genre:</label>
                    <p>${book.genre}</p>
                    
    
                    <label for="">Price: </label>
                    <p>${book.price} Qr</p>

                    <label for="">Quantity: </label>
                    <p>${book.quantity} </p>

                    <label for="">Seller ID: </label>
                    <p>${book.sellerId}</p>
    
                    <label for="">Book ID: </label>
                    <p>${book.id}</p>
                    <div class="bookButtons">
                        <button class ="bookButton" type="button" id="deleteButton" onclick="deleteBook(${book.id})">Delete</button>
                    </div>
                </div>`;
      }
    }
  }
}
function transactionToHTML(transaction) {
  // converts a transcation to html
  const date = new Date(transaction.date);
  let hours = date.getHours();

  let time = "";
  if (hours > 12) {
    hours = hours % 12;
    time = "PM";
  } else if (date.getMinutes() > 0 && date.getHours() == 12) {
    time = "PM";
  } else {
    time = "AM";
  }

  return `
    <div class="card">
        <img src="${transaction.Book.coverImageUrl}" alt="${
    transaction.Book.title
  }">

        <label for="">Title:</label>
        <p name="bookTitle" id = "">${transaction.Book.title}</p>

            <label for="">Author(s):</label>
            <p>${transaction.Book.author}</p>

            <label for="">Genre:</label>
            <p>${transaction.Book.genre}</p>
            
            <label for="">Price: </label>
            <p>${transaction.Book.price} Qr</p>

            <label for="">Transaction Quantity: </label>
            <p>${transaction.amount} </p>

            <label for="">Transaction Subtotal: </label>
            <p>${transaction.Book.price * transaction.amount} Qr</p>

            <label for="">Customer ID:</label>
            <p>${transaction.customerId}</p>

            <label for="">Transaction ID:</label>
            <p>${transaction.id}</p>
            ${
              localStorage.userRole == "Admin"
                ? `
            <label for="">Seller ID:</label>
            <p>${transaction.Book.Seller.id}</p>`
                : ``
            }

            <label for="">Date:</label>
            <p>${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} (${hours}:${date.getMinutes()} ${time})</p>
        
            </div>`;
}

async function deleteBook(id) {
  const index = Books.findIndex((b) => b.id == id);
  const book = Books[index];
  let result = confirm(
    `Are you sure about deleting\nBook: ${book.title}\nPrice: ${book.price}  \nBook ID: ${book.id}`
  );
  if (result) {
    try {
      const response = await fetch("/api/books", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        alert((await response.json()).error);
        return;
      }
    } catch (error) {
      alert(error.message);
      return;
    }
    await filterBooks();
    // localStorage.addedBooks = JSON.stringify(Books);
    alert(`The book with the id ${book.id} has been deleted successfully`);
    showSelectedTab();
  }
}

function mapBook(id) {
  // maps the book data to the update form
  console.log(id);
  popupArea.classList.remove("hidden");
  const index = Books.findIndex((b) => b.id == id);
  const book = Books[index];
  popupTitle.value = book.title;
  popupAuthor.value = book.author;
  popupDescription.value = book.description;
  popupGenre.value = book.genre;
  popupPrice.value = book.price;
  popupID.value = book.id;
  popupQuantity.value = book.quantity;
  popupCover.value = book.coverImageUrl;
}

async function handleSubmit(event) {
  // the event here is submitting the updated book
  event.preventDefault();
  const title = popupTitle.value;
  const author = popupAuthor.value;
  const genre = popupGenre.value;
  const price = +popupPrice.value;
  const description = popupDescription.value;
  const id = +popupID.value;
  const coverImageUrl = popupCover.value;
  const quantity = +popupQuantity.value;

  // Use FileReader to read the selected file (coverImageUrl image)
  //   if (coverImageUrl) {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       // Process and save the new book after reading the cover image
  //       updateBook(
  //         e.target.result,
  //         title,
  //         author,
  //         price,
  //         description,
  //         genre,
  //         quantity,
  //         id
  //       );
  //     };
  //     reader.readAsDataURL(coverImageUrl);
  //   } else {
  //     // Process and save the new book even if there's no cover image
  //     updateBook("", title, author, price, description, genre, quantity, id);
  //   }
  //   localStorage.addedBooks = JSON.stringify(Books);
  try {
    const response = await fetch("/api/books", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        author,
        genre,
        price,
        description,
        id,
        coverImageUrl,
        quantity,
      }),
    });
    if (!response.ok) {
      alert((await response.json()).error);
      return;
    }
  } catch (error) {
    alert(error.message);
    return;
  }
  popupForm.reset();
  popupArea.classList.add("hidden");
  alert(`The book with the id ${id} has been updated successfully`);
  await filterBooks();
  showSelectedTab();
}

// function updateBook(
//   imageURL,
//   title,
//   author,
//   price,
//   description,
//   genre,
//   quantity,
//   id
// ) {
//   //update the book by replacing old values with new values
//   const index = Books.findIndex((b) => b.id == id);
//   Books[index].title = title;
//   Books[index].author = author;
//   Books[index].price = price;
//   Books[index].description = description;
//   Books[index].genre = genre;
//   Books[index].quantity = quantity;
//   if (imageURL != "") {
//     Books[index].coverImageUrl = imageURL;
//   }
// }

function handleCancel() {
  console.log("Cancel reached");
  popupForm.reset();
  popupArea.classList.add("hidden");
}

function showSelectedTab() {
  console.log("Enterd selected tab");
  if (localStorage.selectedTab) {
    if (localStorage.selectedTab == "all") {
      showBooks();
    } else if (localStorage.selectedTab == "sold") {
      showSoldBooks();
    } else if (localStorage.selectedTab == "pending") {
      showPendingBooks();
    } else {
      showaddedBooks();
    }
  } else {
    bookListArea.innerHTML = "";
  }
}
