delete localStorage.searchValue; // empty the search value

document.addEventListener("DOMContentLoaded", function () {
  // Display books from localStorage on page load
  displayBooksFromLocalStorage();

  document
    .querySelector("#addItemLink")
    .addEventListener("click", function (event) {
      // adding an item
      event.preventDefault();
      // Get the popup form element
      const popupForm = document.querySelector("#popupForm");

      if (popupForm.style.display == "block") {
        popupForm.style.display = "none";
      } else {
        popupForm.style.display = "block";
      }
    });

  document
    .querySelector("#uploadItemForm")
    .addEventListener("submit", async function (event) {
      // submitting the add item form
      event.preventDefault();

      const currentUserID = localStorage.getItem("currentUserID");

      const title = document.querySelector("#title").value;
      const author = document.querySelector("#author").value;
      const genre = document.querySelector("#genre").value;
      const price = parseFloat(document.querySelector("#price").value);
      const quantity = parseInt(document.querySelector("#bookQuantity").value);
      const description = document.querySelector("#description").value;
      const coverImageUrl = document.querySelector("#coverImageUrl").value;
      const userId = currentUserID;

      let user = {};
      try {
        const response = await fetch(`/api/login?currentUserID=${userId}`);
        if (response.ok) {
          user = (await response.json()).data;
        } else {
          alert((await response.json()).error);
        }
      } catch (error) {
        alert(error.message);
      }

      try {
        const response = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coverImageUrl,
            title,
            author,
            price,
            description,
            genre,
            quantity,
            sellerId:user.sellers[0].id,
            isApproved: false,
          }),
        });
        if (response.ok) {
          alert(
            "the Book is submitted and pending approval from the website's adminstrators"
          );
          displayBooksFromLocalStorage();
        } else {
          alert((await response.json()).error);
        }
      } catch (error) {
        alert(error.message);
      }

      document.querySelector("#popupForm").style.display = "none";
    });
});


async function displayBooksFromLocalStorage() {
  const currentUserID = localStorage.getItem("currentUserID");

  // First, clear all sections to avoid duplication when re-displaying books
  document.querySelectorAll(".books section").forEach((section) => {
    section.innerHTML = "";
  });
  let booksToDisplay = [];
  try {
    const response = await fetch(`/api/books`);
    if (response.ok) {
      booksToDisplay = (await response.json()).data;
    } else {
      alert((await response.json()).error);
    }
  } catch (error) {
    alert(error.message);
  }


  // Loop through each book and append it to the correct section based on its genre
  booksToDisplay.forEach(async (book) => {
    // Convert the genre to a format matching the section ID (e.g., "Self Development" to "Self-Development")
    const genreSectionId = `#${book.genre.replace(/\s+/g, "-")}`;
    const genreSection = document.querySelector(genreSectionId);
    if (genreSection) {
      const cardContent = createBookCard(book);
      genreSection.innerHTML += cardContent;
    } else {
      console.error(
        `No section found for genre: ${book.genre}. Ensure your HTML has a matching section.`
      );
    }
  });
  if (userRole !== "Admin") {
    addingToCart();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (userRole !== "Admin") {
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

      getUserAddress();
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

  // updateSubtotal(price);
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
          purchaseItem(bookId, quantity);
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

function createBookCard(book) {
  const userRole = localStorage.getItem("userRole"); // Assuming you store the user role in localStorage
  // const card = await document.createElement("div");
  // card.className = "inner-card";
  // card.setAttribute("data-book-id", book.id);

  // Define the basic card structure with flip effect
  let cardContent = `
  <div class="inner-card" data-book-id="${book.id}">
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
                <button onclick="approveBook('${book.id}')" class="icon-button"><i class="fa-solid fa-check"></i></button>
                <button onclick="deleteBook('${book.id}')" class="icon-button"><i class="fa-solid fa-trash"></i></button>
            `;
  }

  // Close the flip-back-card and flip-inner-card divs
  cardContent += `
          </div>
      </div>
    </div>
  `;

  // Set the innerHTML of the card to the constructed content
  // card.innerHTML = cardContent;

  return cardContent; // Return the card element for appending in the display function
}

async function purchaseItem(bookId, selectedQuantity) {
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


