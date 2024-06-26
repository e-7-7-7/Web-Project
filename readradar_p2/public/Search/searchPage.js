const searchForm = document.querySelector("#searchForm");
const searchBar = document.querySelector("#searchInput");
const searchTitle = document.querySelector("#searchTitle");
const searchResults = document.querySelector("#searchResults");
let books = []; // array of for sale books

if (localStorage.searchValue) {
  displayWantedBooks(localStorage.searchValue);
}

searchForm.addEventListener("submit", handleSearch);

function handleSearch(form) {
  form.preventDefault();
  searchTitle.innerHTML = ""; // reset the search title
  searchResults.innerHTML = ""; // reset the search area
  if (searchBar.value != "") {
    localStorage.searchValue = searchBar.value;
    displayWantedBooks(searchBar.value);
  }
}



async function displayWantedBooks(searchValue) {
  searchResults.innerHTML = "";
  searchTitle.innerHTML = "";
  let wantedBooks = [];
  try {
    const response = await fetch(
      `/api/books?searchWord=${searchValue}`
    );
    if (response.ok) {
      wantedBooks = (await response.json()).data;
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }
  if (wantedBooks.length == 0) {
    searchTitle.innerHTML = `<h2>There is no Books with the title / author  " ${searchValue} "</h2>`;
    return;
  } else {
    searchTitle.innerHTML = `<h2>Results for " ${searchValue} "</h2>`;
    wantedBooks.map((b) => searchResults.appendChild(createBookCard(b)));
  }
}




document.addEventListener("DOMContentLoaded", function () {
  if (userRole != "Admin") {
    addingToCart();
  }

  const cancelButton = document.querySelector("#cancel");

  const cartContent = document.querySelector("#book-picked");
  cancelButton.addEventListener("click", function (event) {
    cartContent.textContent = "";
    document.querySelector("#cartForm").style.display = "none";
    document.querySelector(".purchase-buttons").style.display = "none";
    document.querySelector("#checkoutForm").style.display = "none";
  });
  const proceedButton = document.querySelector("#proceed");
  proceedButton.addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("#checkoutForm").style.display = "block";

    const checkoutCancel = document.querySelector("#cancelCheckout");
    checkoutCancel.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("#checkoutForm").style.display = "none";

      // getUserAddress();
    });
  });

  const updateShipping = document.querySelector("#updateCheckout");
  updateShipping.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#checkoutForm").style.display = "none";
    profileAddressUpdate();
  });
});

function addingToCart() {
  const bookElements = document.querySelectorAll(".inner-card");
  bookElements.forEach((bookElement) => {
    bookElement.addEventListener("click", async function () {
      if (userRole === "Customer") {
        const bookId = this.dataset.bookId;
        let selectedBook = [];
        try {
          const response = await fetch(
            `/api/books?currentUserID=${localStorage.currentUserID}&bookId=${bookId}`
          );
          if (response.ok) {
            selectedBook = (await response.json()).data[0];
          } else {
            alert((await response.json()).error);
          }
        } catch (error) {
          alert(error.message);
        }

        if (selectedBook) {
          displaySelectedBook(
            selectedBook.coverImageUrl,
            selectedBook.title,
            selectedBook.price
          );
          displayOnCheckout(
            selectedBook.coverImageUrl,
            selectedBook.title,
            selectedBook.price,
            selectedBook.id,
            selectedBook.sellerId,
            selectedBook.quantity
          );

          document.querySelector("#cartForm").style.display = "block";
          document.querySelector(".purchase-buttons").style.display = "block";
        }
      } else {
        alert("Please Sign in as a Customer and Try again!");
      }
    });
  });
}

function displaySelectedBook(coverImage, title, price) {
  const cartSection = document.querySelector("#book-picked");
  cartSection.innerHTML = `<img src="${
    coverImage || "default-cover-image-path.jpg"
  }" alt="${title}">
    <p>${title}</p>
    <p>Price: $${price}</p>`;
  const quantityInput = document.querySelector("#quantity");
  quantityInput.addEventListener("input", function (event) {
    // Recalculate and update subtotal based on the new quantity
    updateSubtotal(price);
  });
}

// Function to calculate and update subtotal
function updateSubtotal(price) {
  const quantityInput = document.querySelector("#quantity");
  const subtotalDisplay = document.querySelector("#book-picked");
  const quantity = parseInt(quantityInput.value) || 0;
  const subtotal = price * quantity;

  let subtotalP = document.querySelector("#purchase");

  // If the subtotal paragraph doesn't exist, create a new one
  if (!subtotalP) {
    subtotalP = document.createElement("p");
    subtotalP.id = "purchase";
    subtotalDisplay.appendChild(subtotalP);
  }

  // Update the content of the subtotal paragraph
  subtotalP.textContent = `Subtotal: $${subtotal}`;
}

async function displayOnCheckout(
  coverImage,
  title,
  price,
  bookId,
  sellerId,
  intialQuant
) {
  const cartSection = document.querySelector("#transaction");
  const checkoutAdd = document.querySelector("#address");
  cartSection.innerHTML = `<img src="${
    coverImage || "default-cover-image-path.jpg"
  }" alt="${title}">
                            <p>${title}</p>
                            <p>Price: $${price}</p>`;
  const custId = localStorage.getItem("currentUserID");
  let user = {};
  try {
    const response = await fetch(`/api/login?currentUserID=${custId}`);
    if (response.ok) {
      user = (await response.json()).data;
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }

  checkoutAdd.innerHTML = `
    <p>Country: ${user.shipping_address.country}</p>
    <p>City: ${user.shipping_address.city}</p>
    <p>Street: ${user.shipping_address.street}</p>
    <p>House No.: ${user.shipping_address.house_number}</p>
  `;

  let quantity = 0; // Set initial quantity to 1

  const quantityInput = document.querySelector("#quantity");
  quantityInput.addEventListener("input", function (event) {
    quantity = parseInt(quantityInput.value) || 0;
    updateCheckout(price, quantity);

    const checkoutButton = document.querySelector("#checkoutButton");

    if (!checkoutButton.hasEventListener) {
      checkoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (quantity <= intialQuant && quantity != 0) {
          purchaseItem(bookId, quantity,sellerId);
        } else if (intialQuant == 0) {
          alert("Item out of stock");
          window.location.reload();
        } else if (quantity == 0) {
          alert("Select a valid quantity");
          window.location.reload();
        } else {
          alert(`Stock available ${intialQuant}, Select a lower quantity`);
          window.location.reload();
        }
      });
      checkoutButton.hasEventListener = true;
    }
  });

  let totalP = document.querySelector("#trans");
  let totalP2 = document.querySelector("#quant");

  if (!totalP || !totalP2) {
    totalP = document.createElement("p");
    totalP2 = document.createElement("p");
    totalP.id = "trans";
    totalP2.id = "quant";
    cartSection.appendChild(totalP2);
    cartSection.appendChild(totalP);
  }

  // Initial update of total and quantity
  updateCheckout(price, quantity);
}

function updateCheckout(price, quantity) {
  const totalP = document.querySelector("#trans");
  const totalP2 = document.querySelector("#quant");

  // Update the content of the total and quantity paragraphs
  totalP2.textContent = `Quantity: x${quantity}`;
  totalP.textContent = `Total: $${price * quantity}`;
}



async function purchaseItem(bookId, selectedQuantity,sId) {
  // console.log(sId);
  const currentUserID = localStorage.getItem("currentUserID");
  if (!currentUserID) {
    alert("please login to purchase");
    return;
  }
  try {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUserID,
        bookId: +bookId,
        amount: +selectedQuantity,
        sellerId:sId
      }),
    });
    if (response.ok) {
      // (await response.json()).data;
      alert("Purchase Completed")

      window.location.reload();
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }

}



















function createBookCard(book) {
  const userRole = localStorage.getItem("userRole"); // Assuming you store the user role in localStorage
  //   const usersData = JSON.parse(localStorage.getItem("users")) || [];
  //   const seller = usersData.find((u) => u.id == sellerId);
  const card = document.createElement("div");
  card.className = "inner-card";
  card.setAttribute("data-book-id", book.id);

  // Define the basic card structure with flip effect
  let cardContent = `
            <div class="flip-inner-card">
                <div class="flip-front-card">
                    <img src="${
                      book.coverImageUrl || "default-cover-image-path.jpg"
                    }" alt="${book.title}">
                    <p>${book.title}</p>
                </div>
                <div class="flip-back-card">
                    <p>Author: ${book.author}</p>
                    <p>Price: ${book.price} QR</p>
                    <p>Description: ${book.description}</p>
                    <p>Genre: ${book.genre}</p>
                    <p>Available Quantity: ${book.quantity}</p>
                    <p>Seller: ${book.Seller.User.firstname} ${
    book.Seller.User.surname ?? ""
  }</p>
                    ${
                      book.isApproved
                        ? '<button id="add-${id}" class="icon-button">Add to cart</button>'
                        : ""
                    }
        `;

  // Add admin-specific buttons if the user is an admin and the book is not approved yet
  if (userRole == "Admin" && !book.isApproved) {
    cardContent += `
                <button onclick="approveBook('${id}')" class="icon-button"><i class="fa-solid fa-check"></i></button>
                <button onclick="deleteBook('${id}')" class="icon-button"><i class="fa-solid fa-trash"></i></button>
            `;
  }

  // Close the flip-back-card and flip-inner-card divs
  cardContent += `
                </div>
            </div>
        `;

  // Set the innerHTML of the card to the constructed content
  card.innerHTML = cardContent;

  return card; // Return the card element for appending in the display function
}

// // cart stuff

// // cart stuff

// document.addEventListener("DOMContentLoaded", function () {
//   if (userRole === "Customer") {
//     addingToCart();
//   }
//   const cancelButton = document.querySelector("#cancel");

//   const cartContent = document.querySelector("#book-picked");
//   cancelButton.addEventListener("click", function (event) {
//     cartContent.textContent = "";
//     document.querySelector("#cartForm").style.display = "none";
//     document.querySelector(".purchase-buttons").style.display = "none";
//     document.querySelector("#checkoutForm").style.display = "none";
//   });
//   const proceedButton = document.querySelector("#proceed");
//   proceedButton.addEventListener("click", function (event) {
//     event.preventDefault();
//     document.querySelector("#checkoutForm").style.display = "block";

//     const checkoutCancel = document.querySelector("#cancelCheckout");
//     checkoutCancel.addEventListener("click", function (event) {
//       event.preventDefault();
//       document.querySelector("#checkoutForm").style.display = "none";
//     });
//   });

//   const updateShipping = document.querySelector("#updateCheckout");
//   updateShipping.addEventListener("click", function (e) {
//     e.preventDefault();
//     document.querySelector("#checkoutForm").style.display = "none";
//     profileAddressUpdate();
//   });
// });

// function addingToCart() {
//   const bookElements = document.querySelectorAll(".inner-card");
//   bookElements.forEach((bookElement) => {
//     bookElement.addEventListener("click", function () {
//       const bookId = this.dataset.bookId;
//       const addedBooks = JSON.parse(localStorage.getItem("addedBooks")) || [];
//       const selectedBook = addedBooks.find((book) => book.id == bookId);

//       if (selectedBook) {
//         displaySelectedBook(
//           selectedBook.coverImageUrl,
//           selectedBook.title,
//           selectedBook.price
//         );
//         displayOnCheckout(
//           selectedBook.coverImageUrl,
//           selectedBook.title,
//           selectedBook.price,
//           selectedBook.id,
//           selectedBook.sellerId,
//           selectedBook.quantity
//         );

//         document.querySelector("#cartForm").style.display = "block";
//         document.querySelector(".purchase-buttons").style.display = "block";
//       }
//     });
//   });
// }

// function displaySelectedBook(coverImage, title, price) {
//   const cartSection = document.querySelector("#book-picked");
//   cartSection.innerHTML = `<img src="${
//     coverImage || "default-cover-image-path.jpg"
//   }" alt="${title}">
//                             <p>${title}</p>
//                             <p>Price: $${price}</p>`;

//   const quantityInput = document.querySelector("#quantity");
//   quantityInput.addEventListener("input", function (event) {
//     // Recalculate and update subtotal based on the new quantity
//     updateSubtotal(price);
//   });

//   // updateSubtotal(price);
// }

// // Function to calculate and update subtotal
// function updateSubtotal(price) {
//   const quantityInput = document.querySelector("#quantity");
//   const subtotalDisplay = document.querySelector("#book-picked");
//   const quantity = parseInt(quantityInput.value) || 0;
//   const subtotal = price * quantity;

//   let subtotalP = document.querySelector("#purchase");

//   // If the subtotal paragraph doesn't exist, create a new one
//   if (!subtotalP) {
//     subtotalP = document.createElement("p");
//     subtotalP.id = "purchase";
//     subtotalDisplay.appendChild(subtotalP);
//   }

//   // Update the content of the subtotal paragraph
//   subtotalP.textContent = `Subtotal: $${subtotal}`;
// }

// function displayOnCheckout(
//   coverImage,
//   title,
//   price,
//   bookId,
//   sellerId,
//   intialQuant
// ) {
//   const cartSection = document.querySelector("#transaction");
//   cartSection.innerHTML = `<img src="${
//     coverImage || "default-cover-image-path.jpg"
//   }" alt="${title}">
//                             <p>${title}</p>
//                             <p>Price: $${price}</p>`;

//   let quantity = 0; // Set initial quantity to 1

//   const quantityInput = document.querySelector("#quantity");
//   quantityInput.addEventListener("input", function (event) {
//     quantity = parseInt(quantityInput.value) || 0;
//     updateCheckout(price, quantity);

//     const checkoutButton = document.querySelector("#checkoutButton");

//     if (!checkoutButton.hasEventListener) {
//       checkoutButton.addEventListener("click", function (event) {
//         event.preventDefault();
//         if (quantity <= intialQuant && quantity != 0) {
//           purchaseItem(price, title, bookId, sellerId, quantity);
//         } else if (intialQuant == 0) {
//           alert("Item out of stock");
//           window.location.reload();
//         } else if (quantity == 0) {
//           alert("Select a valid quantity");
//           window.location.reload();
//         } else {
//           alert(`Stock available ${intialQuant}, Select a lower quantity`);
//           window.location.reload();
//         }
//       });
//       checkoutButton.hasEventListener = true;
//     }
//   });

//   let totalP = document.querySelector("#trans");
//   let totalP2 = document.querySelector("#quant");
//   if (!totalP || !totalP2) {
//     totalP = document.createElement("p");
//     totalP2 = document.createElement("p");
//     totalP.id = "trans";
//     totalP2.id = "quant";
//     cartSection.appendChild(totalP2);
//     cartSection.appendChild(totalP);
//   }

//   // Initial update of total and quantity
//   updateCheckout(price, quantity);
// }

// function updateCheckout(price, quantity) {
//   const totalP = document.querySelector("#trans");
//   const totalP2 = document.querySelector("#quant");

//   // Update the content of the total and quantity paragraphs
//   totalP2.textContent = `Quantity: x${quantity}`;
//   totalP.textContent = `Total: $${price * quantity}`;
// }

// function purchaseItem(price, title, bookId, sellerId, selectedQuantity) {
//   try {
//     const usersData = JSON.parse(localStorage.getItem("users")) || [];

//     const currentUserID = JSON.parse(localStorage.getItem("currentUserID"));
//     const isAuthenticated = localStorage.getItem("isAuthenticated");

//     const booksData = JSON.parse(localStorage.getItem("addedBooks")) || [];
//     const bookQuantity = booksData.find((book) => book.id == bookId);
//     const currentUser = usersData.find((user) => user.id == currentUserID);
//     const seller = usersData.find((user) => user.id == sellerId);
//     // Check if the user is authenticated
//     if (isAuthenticated == "true") {
//       // Ensure the current user is a customer
//       if (currentUser && currentUser.role == "Customer") {
//         let quant = parseInt(bookQuantity.quantity);
//         let balance = parseFloat(currentUser.account_Balance);
//         let sellerBalance = parseFloat(seller.account_Balance);
//         const subtotal = price * selectedQuantity;
//         const response = confirm("Are you sure you want to Checkout");
//         if (response && balance >= subtotal) {
//           balance -= subtotal;
//           sellerBalance += subtotal;
//           quant -= selectedQuantity;
//           alert("Checkout Successful !!");
//           // Update user's balance
//           seller.account_Balance = sellerBalance;
//           currentUser.account_Balance = balance;
//           bookQuantity.quantity = quant;

//           localStorage.setItem("addedBooks", JSON.stringify(booksData)); //ss
//           localStorage.setItem("users", JSON.stringify(usersData));

//           purchaseHistory(
//             bookQuantity,
//             subtotal,
//             selectedQuantity,
//             sellerId,
//             title
//           );
//           document.querySelector("#checkoutForm").style.display = "none";
//           window.location.reload();
//         } else {
//           alert("Insufficient Balance...CheckOut failed");
//           document.querySelector("#checkoutForm").style.display = "none";
//           window.location.reload();
//         }
//       } else {
//         alert(
//           "You are not a customer. Please sign in as a customer and try again."
//         );
//         document.querySelector("#checkoutForm").style.display = "none";
//         window.location.reload();
//       }
//     } else {
//       alert("You are not authenticated. Please sign in and try again.");
//       document.querySelector("#checkoutForm").style.display = "none";
//       window.location.reload();
//     }
//   } catch (error) {
//     console.error("Error during purchase:", error);
//     alert(
//       "An error occurred during the purchase process. Please try again later."
//     );
//     document.querySelector("#checkoutForm").style.display = "none";
//     window.location.reload();
//   }
//   displayBooksFromLocalStorage();
// }

// function purchaseHistory(book, total, quantity, sellerId, title) {
//   let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
//   const custId = localStorage.getItem("currentUserID");
//   const newTransaction = {
//     custId: custId,
//     sellerId: sellerId,
//     book: book,
//     bookTitle: title,
//     total: total,
//     quantity: quantity,
//     date: new Date().toISOString(),
//     transactionId: Date.now() + Math.random().toString(36).substr(2, 9),
//     shipCity: city,
//   };

//   transactions.unshift(newTransaction);

//   localStorage.setItem("transactions", JSON.stringify(transactions));
// }
