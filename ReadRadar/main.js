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






// search Related variables and functions

const searchBar = document.querySelector("#searchInput");
const bookArea = document.querySelector("#bookListingArea");

searchBar.addEventListener("keyup",handleSearch);



function handleSearch(){
    if(searchBar.value ==""){
        displayBooksFromLocalStorage();// show books normally
        return;
    }
    const searchWord =  new RegExp (searchBar.value,"i"); // creates a value to work with the search function
    const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    const wantedBooks = addedBooks.filter(book => book.title.toLowerCase().search(searchWord) >=0 || book.author.toLowerCase().search(searchWord) >=0);
    displaySearchResults(wantedBooks);
}

function displaySearchResults(booksArray){
    if(booksArray.length == 0){
        bookArea.innerHTML=`<h2 style="text-align:center;">There is no Books with this title / author</h2>`
        return;
    }

    bookArea.innerHTML = booksArray.map(book => createSearchBookCard(book)).join(" ")
    
}

function createSearchBookCard(book){
    const coverImageUrl = book.coverImageUrl;
    const title = book.title;
    const author = book.author;
    const price = book.price;
    const description = book.description;
    const genre= book.genre ;

   return `
    <div class="inner-card" id="${book.id}">
        <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
        <p>Title: ${title}</p>
        <p>Author: ${author}</p>
        <p>Price: $${price}</p>
        <p>Description: ${description}</p>
        <p>Genre: ${genre}</p>
    </div>
    `;
    
}

function setBookArea(){ //resets the books listing area
    bookArea.innerHTML=
    ` <h4>2024 Books</h4>
    <section id="Books-2024">

        
    </section>
    <h4>2023 Best Books</h4>
    <section id="bestBooks">
        
         <!-- Books be added here -->
    </section>
    <h4>Action</h4>
    <section id="Action">
       
         <!-- Books be added here -->
    </section>
    <h4>Mystery</h4>
    <section id="Mystery">
        
         <!-- Books be added here -->
    </section>
    <h4>Fiction</h4>
    <section id="Fiction">
       
         <!-- Books be added here -->
    </section>
    <h4>Self Devlopment</h4>
    <section id="Self-Devlopment">
        
         <!-- Books be added here -->
    </section>
    <h4>Arabic</h4>
    <section id="Arabic">
        
         <!-- Books be added here -->
    </section>
    `
}


    
document.addEventListener('DOMContentLoaded', function() {
    addingToCart(); 
        const cancelButton = document.querySelector('#cancel');
        const cartContent = document.querySelector('#book-picked');
        cancelButton.addEventListener('click', function(event) {
            cartContent.textContent="";
        });
        const proceedButton = document.querySelector('#proceed');
        proceedButton.addEventListener('click', function(event) {
          event.preventDefault();
          document.querySelector('#checkoutForm').style.display = 'block';
        
});
});

function addingToCart() {
    const bookElements = document.querySelectorAll('.inner-card');
    bookElements.forEach(bookElement => {
        bookElement.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
            const selectedBook = addedBooks.find(book => book.id === bookId);
            if (selectedBook) {
                
                displaySelectedBook(selectedBook.coverImageUrl, selectedBook.title, selectedBook.price);
                displayOnCheckout(selectedBook.coverImageUrl, selectedBook.title, selectedBook.price)
            }
        });
    });
};

function displaySelectedBook(coverImage, title, price) {
    const cartSection = document.querySelector('#book-picked');
    cartSection.innerHTML = `<img src="${coverImage || 'default-cover-image-path.jpg'}" alt="${title}">
                            <p>${title}</p>
                            <p>Price: $${price}</p>`;

  const quantityInput = document.querySelector('#quantity');
quantityInput.addEventListener('input', function(event) {
 // Recalculate and update subtotal based on the new quantity
    updateSubtotal(price);
  });
                            
updateSubtotal(price);
  
}

// Function to calculate and update subtotal
function updateSubtotal(price) {
    const quantityInput = document.querySelector('#quantity');
    const subtotalDisplay = document.querySelector('#book-picked');
    const quantity = parseInt(quantityInput.value) || 0;
    const subtotal = price * quantity;
    
    let subtotalP = document.querySelector('#purchase');

    // If the subtotal paragraph doesn't exist, create a new one
    if (!subtotalP) {
        subtotalP = document.createElement('p');
        subtotalP.id = 'purchase';
        subtotalDisplay.appendChild(subtotalP);
    }

    // Update the content of the subtotal paragraph
    subtotalP.textContent = `Subtotal: $${subtotal}`;
    
}

function displayOnCheckout(coverImage, title, price) {
    const cartSection = document.querySelector('#transaction');
    cartSection.innerHTML = `<img src="${coverImage || 'default-cover-image-path.jpg'}" alt="${title}">
                            <p>${title}</p>
                            <p>Price: $${price}</p>`;

    let quantity = 1; // Set initial quantity to 1

    const quantityInput = document.querySelector('#quantity');
    quantityInput.addEventListener('input', function(event) {
        quantity = parseInt(quantityInput.value) || 0;
        updateCheckout(price, quantity); 
    });

    let totalP = document.querySelector('#trans');
    let totalP2 = document.querySelector('#quant');
    if (!totalP || !totalP2) {
        totalP = document.createElement('p');
        totalP2 = document.createElement('p');
        totalP.id = 'trans';
        totalP2.id = 'quant';
        cartSection.appendChild(totalP2);
        cartSection.appendChild(totalP); 
    
    }

    // Initial update of total and quantity
    updateCheckout(price, quantity);
}

function updateCheckout(price, quantity) {
    const totalP = document.querySelector('#trans');
    const totalP2 = document.querySelector('#quant');

    // Update the content of the total and quantity paragraphs
    totalP2.textContent = `Quantity: x${quantity}`;
    totalP.textContent = `Total: $${price * quantity}`;
   
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






