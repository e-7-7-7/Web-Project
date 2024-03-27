delete localStorage.searchValue // empty the search value
document.addEventListener('DOMContentLoaded', function() {
    // Display books from localStorage on page load
    displayBooksFromLocalStorage();

    document.querySelector('#addItemLink').addEventListener('click', function(event) { // adding an item
        event.preventDefault();
        
        // Retrieve the user role from localStorage
        const userRole = localStorage.getItem('userRole');
        
        // Get the popup form element
        const popupForm = document.querySelector('#popupForm');

        // Check if the user role is "Seller"
        if (userRole === 'Seller') {
            // Toggle the display based on current visibility
            if (popupForm.style.display === 'block') {
                popupForm.style.display = 'none';
            } else {
                popupForm.style.display = 'block';
            }
        } else {
            alert('You are not authorized to add items. Only sellers can add items.');
        }
    });

    document.querySelector('#uploadItemForm').addEventListener('submit', function(event) { // submitting the add item form
        event.preventDefault();
        
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const genre = document.querySelector('#genre').value;
        const price = document.querySelector('#price').value;
        const description = document.querySelector('#description').value;
        const cover = document.querySelector('#cover').files[0];
        
        if (cover) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Process and save the new book after reading the cover image
                processAndSaveBook(e.target.result, title, author, price, description, genre);
            };
            reader.readAsDataURL(cover); 
        } else {
            // Process and save the new book even if there's no cover image
            processAndSaveBook('', title, author, price, description, genre);
        }

        document.querySelector('#popupForm').style.display = 'none';
    });
});

function processAndSaveBook(coverImageUrl, title, author, price, description, genre) {
    const newBook = { coverImageUrl, title, author, price, description, genre };
    saveBookToLocalStorage(newBook);
    displayBooksFromLocalStorage(); // Refresh the book display
}

function saveBookToLocalStorage(book) {
    let addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    const uniqueId = Date.now() + "-" + Math.random().toString(36).substr(2, 9); // Generate a unique ID for the book
    const bookWithId = { ...book, id: uniqueId }; // Add the unique ID to the book object
    addedBooks.push(bookWithId); // Add the new book to the array
    localStorage.setItem('addedBooks', JSON.stringify(addedBooks)); // Save the updated array back to localStorage
}

function displayBooksFromLocalStorage() {
    const section = document.querySelector('#Books-2024'); // Ensure this targets your book display area correctly
    section.innerHTML = ''; // Clear existing content before displaying the updated book list
    const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    addedBooks.forEach(book => {
        createBookCard(book.coverImageUrl, book.title, book.author, book.price, book.description, book.genre,book.id);
    });
}


// function addingToCart() {
//     const section = document.querySelector('#book-picked'); // Ensure this targets your book display area correctly
//     section.innerHTML = ''; // Clear existing content before displaying the updated book list
//     const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
//     addedBooks.forEach(book => {
//         if (addedBooks.some(selectedID => book.uniqueId === selectedID)) {
//             displaySelectedBook(book.coverImageUrl, book.title, book.price)
//         }
//     });
    
document.addEventListener('DOMContentLoaded', function() {
    addingToCart(); 
});



function addingToCart() {
    const bookElements = document.querySelectorAll('.inner-card');
    bookElements.forEach(bookElement => {
        bookElement.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
            const selectedBook = addedBooks.find(book => book.id === bookId); // Use 'id' property here
            if (selectedBook) {
                displaySelectedBook(selectedBook.coverImageUrl, selectedBook.title, selectedBook.price);
            }
        });
    });
}




function createBookCard(coverImageUrl, title, author, price, description, genre, id) {
    const card = document.createElement('div');
    card.className = 'inner-card'; // Added 'book' class
    card.setAttribute('data-book-id', id); // Set data-book-id attribute

    card.innerHTML = `
    <div class="flip-inner-card">
    <div class="flip-front-card">
        <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
        <p> ${title}</p>
    </div>
    <div class="flip-back-card">
        <p>Author: ${author}</p>
        <p>Price: ${price} QR</p>
        <p>Description: ${description}</p>
        <button id="add">Add to cart</button>
    </div>
    </div>
    
    `;

    const section = document.querySelector(`#${genre.replace(/\s+/g, '-')}`) || document.querySelector('#2024-Books');
    section.appendChild(card);
}







function displaySelectedBook(coverImage, title, price) {
    const cartSection = document.querySelector('#book-picked');
    cartSection.innerHTML = `<img src="${coverImage || 'default-cover-image-path.jpg'}" alt="${title}">
                            <p>${title}</p>
                            <p>Price: $${price}</p>`;

    const quantityInput = document.getquerySelector('#quantity');

    quantityInput.addEventListener('input', calculateSubtotal);
}

function calculateSubtotal(event,price) {
    const quantity = parseInt(event.target.value) || 0;
    subtotal = price * quantity;

    // Display subtotal
    const subtotalDisplay = document.querySelector('#subtotal');
    subtotalDisplay.textContent = `Subtotal: $${subtotal}`;
}

// Call function to fetch book data when the page loads




//function to proccess customer balance

//These Function will be called after the customer proceeds into Checkout 

function proccessCustBalance() {
    fetch('data/customer.json') 
      .then(res => res.json())
      .then(data => {
        data.forEach(acc => {
          balance = acc.balance;
        });
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  }

function purchaseItem(subtotal) {
    if (balance >= subtotal) {
        balance -= subtotal;
    } else {
        alert("Insuffiecient Balance...CheckOut failed")
    }   
}






