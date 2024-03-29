delete localStorage.searchValue // empty the search value




document.addEventListener('DOMContentLoaded', function() {

    // Display books from localStorage on page load
    displayBooksFromLocalStorage();

    document.querySelector('#addItemLink').addEventListener('click', function(event) { // adding an item
        event.preventDefault();
        // Get the popup form element
        const popupForm = document.querySelector('#popupForm');

            if (popupForm.style.display === 'block') {
                popupForm.style.display = 'none';
            } else {
                popupForm.style.display = 'block';
            }
       
    });

    document.querySelector('#uploadItemForm').addEventListener('submit', function(event) { // submitting the add item form
        event.preventDefault();
  
        
        const currentUserID = localStorage.getItem('currentUserID');
        
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const genre = document.querySelector('#genre').value;
        const price = parseFloat(document.querySelector('#price').value);
        const quantity = parseInt(document.querySelector("#bookQuantity").value);
        const description = document.querySelector('#description').value;
        const cover = document.querySelector('#cover').files[0];
        const sellerId = parseInt(currentUserID);
        
        if (cover) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Process and save the new book after reading the cover image
                processAndSaveBook(e.target.result, title, author, price, description, genre,quantity,sellerId);
            };
            reader.readAsDataURL(cover); 
        } else {
            // Process and save the new book even if there's no cover image
            processAndSaveBook('', title, author, price, description, genre,quantity,sellerId);
        }

        document.querySelector('#popupForm').style.display = 'none';
    });

});

function processAndSaveBook(coverImageUrl, title, author, price, description, genre,quantity,sellerId) {
    const newBook = { coverImageUrl, title, author, price, description, genre,quantity,sellerId, isApproved: false };
    saveBookToLocalStorage(newBook);
   displayBooksFromLocalStorage();
}



function approveBook(id) {
    const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    const bookIndex = addedBooks.findIndex(book => book.id === id);
    if (bookIndex !== -1) {
        addedBooks[bookIndex].isApproved = true;
        localStorage.setItem('addedBooks', JSON.stringify(addedBooks));
        alert('Book added successfully');
        displayBooksForAdmin(); // Refresh admin view
        displayBooksFromLocalStorage(); // Optionally refresh customer view if admin is on the same page
    }
}

function deleteBook(id) {
    let addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    addedBooks = addedBooks.filter(book => book.id !== id);
    localStorage.setItem('addedBooks', JSON.stringify(addedBooks));
    alert('Book deleted successfully');
    displayBooksForAdmin(); // Refresh admin view
    displayBooksFromLocalStorage(); // Optionally refresh customer view if admin is on the same page
}



function saveBookToLocalStorage(book) {
    let addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    const uniqueId = Date.now() + "-" + Math.random().toString(36).substr(2, 9); // Generate a unique ID for the book
    const bookWithId = { ...book, id: uniqueId }; // Add the unique ID to the book object
    addedBooks.push(bookWithId); // Add the new book to the array
    localStorage.setItem('addedBooks', JSON.stringify(addedBooks)); // Save the updated array back to localStorage
}


function displayBooksFromLocalStorage() {
    const userRole = localStorage.getItem('userRole');
    
    // First, clear all sections to avoid duplication when re-displaying books
    document.querySelectorAll('.books section').forEach(section => {
        section.innerHTML = '';
    });

    const addedBooks = JSON.parse(localStorage.getItem('addedBooks')) || [];
    let booksToDisplay = [];

    // Filter books based on the user role
    if (userRole === 'Admin') {
        booksToDisplay = addedBooks;
    } else {
        booksToDisplay = addedBooks.filter(book => book.isApproved);
    }

    // Loop through each book and append it to the correct section based on its genre
    booksToDisplay.forEach(book => {
        // Convert the genre to a format matching the section ID (e.g., "Self Development" to "Self-Development")
        const genreSectionId = `#${book.genre.replace(/\s+/g, '-')}`;
        const genreSection = document.querySelector(genreSectionId);

        if (genreSection) {
            const card = createBookCard(book.coverImageUrl, book.title, book.author, book.price, book.description, book.genre,book.quantity,book.sellerId, book.id, book.isApproved);
            genreSection.appendChild(card);
        } else {
            console.error(`No section found for genre: ${book.genre}. Ensure your HTML has a matching section.`);
        }
    });
}




    
document.addEventListener('DOMContentLoaded', function() {
    addingToCart(); 
        const cancelButton = document.querySelector('#cancel');
        
        const cartContent = document.querySelector('#book-picked');
        cancelButton.addEventListener('click', function(event) {
            cartContent.textContent="";
            document.querySelector('#cartForm').style.display = 'none';
            document.querySelector('.purchase-buttons').style.display='none';
            document.querySelector('#checkoutForm').style.display = 'none';
        });
        const proceedButton = document.querySelector('#proceed');
        proceedButton.addEventListener('click', function(event) {
          event.preventDefault();
          document.querySelector('#checkoutForm').style.display = 'block';

        const checkoutCancel = document.querySelector('#cancelCheckout');
        checkoutCancel.addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#checkoutForm').style.display = 'none';
        

});
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
                displayOnCheckout(selectedBook.coverImageUrl, selectedBook.title, selectedBook.price,selectedBook.id,selectedBook.sellerId,selectedBook.quantity)
                
                document.querySelector('#cartForm').style.display = 'block';
                document.querySelector('.purchase-buttons').style.display = 'block';
                
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
                            
// updateSubtotal(price);
  
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

function displayOnCheckout(coverImage, title, price,bookId,sellerId,intialQuant) {
    const cartSection = document.querySelector('#transaction');
    cartSection.innerHTML = `<img src="${coverImage || 'default-cover-image-path.jpg'}" alt="${title}">
                            <p>${title}</p>
                            <p>Price: $${price}</p>`;

    let quantity = 1; // Set initial quantity to 1

    const quantityInput = document.querySelector('#quantity');
    quantityInput.addEventListener('input', function(event) {
        quantity = parseInt(quantityInput.value) || 0;
        updateCheckout(price, quantity); 

            
    const checkoutButton = document.querySelector('#checkoutButton');

    if (!checkoutButton.hasEventListener) {
        checkoutButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            if(quantity<=intialQuant){
                purchaseItem(price,title,bookId,sellerId,quantity); 
                
            }
            else if (intialQuant==0){
                alert('item out of stock')
            }
            else{
                alert(`Stock available ${intialQuant}, Select a lower quantity`)
            }
        });
        checkoutButton.hasEventListener = true;
    }
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




    function createBookCard(coverImageUrl, title, author, price, description, genre,quantity,sellerId, id, isApproved) {
        const userRole = localStorage.getItem('userRole'); // Assuming you store the user role in localStorage
        const usersData =  JSON.parse(localStorage.getItem('users'))|| [];
        const seller = usersData.find(u => u.id ===sellerId);
        const card = document.createElement('div');
        card.className = 'inner-card';
        card.setAttribute('data-book-id', id);
    
        // Define the basic card structure with flip effect
        let cardContent = `
            <div class="flip-inner-card">
                <div class="flip-front-card">
                    <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
                    <p>${title}</p>
                </div>
                <div class="flip-back-card">
                    <p>Author: ${author}</p>
                    <p>Price: ${price} QR</p>
                    <p>Description: ${description}</p>
                    <p>Available Quantity: ${quantity}</p>
                    <p>Seller: ${seller.name}</p>
                    ${isApproved ? '<button id="add-${id}" class="icon-button">Add to cart</button>' : ''}
        `;
    
        // Add admin-specific buttons if the user is an admin and the book is not approved yet
        if (userRole === 'Admin' && !isApproved) {
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
    

function purchaseItem(price,title,bookId,sellerId,selectedQuantity) {
    try {
        const usersData = JSON.parse(localStorage.getItem('users')) || [];
        
        const currentUserID = JSON.parse(localStorage.getItem('currentUserID'));
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        const booksData = JSON.parse(localStorage.getItem('addedBooks')) || [];    
        const bookQuantity = booksData.find(book=> book.id === bookId );  
        const currentUser = usersData.find(user => user.id === currentUserID);
        const seller = usersData.find(user=> user.id === sellerId)
        // Check if the user is authenticated
        if (isAuthenticated === 'true') {
            // Ensure the current user is a customer
            if (currentUser && currentUser.role === 'Customer') {
                let quant = parseInt(bookQuantity.quantity);
                let balance = parseFloat(currentUser.account_Balance);
                let sellerBalance = parseFloat(seller.account_Balance);
                    const subtotal = price * selectedQuantity;
                    if (balance >= subtotal) {
                        balance -= subtotal;
                        sellerBalance += subtotal;
                        quant -= selectedQuantity;
                        alert("Checkout Successful !!");
                        // Update user's balance
                        seller.account_Balance = sellerBalance;
                        currentUser.account_Balance = balance;
                        bookQuantity.quantity=quant



                        localStorage.setItem('addedBooks', JSON.stringify(booksData));//ss
                        localStorage.setItem('users', JSON.stringify(usersData));
    
                        purchaseHistory(bookId, subtotal, quantity, sellerId, title);
                        document.querySelector('#checkoutForm').style.display = 'none';
                    } else {
                        alert("Insufficient Balance...CheckOut failed");
                        document.querySelector('#checkoutForm').style.display = 'none';
                    }
                } else {
                    alert('You are not a customer. Please sign in as a customer and try again.');
                    document.querySelector('#checkoutForm').style.display = 'none';
                }
            } else {
                alert('You are not authenticated. Please sign in and try again.');
                document.querySelector('#checkoutForm').style.display = 'none';
            }
        } catch (error) {
            console.error('Error during purchase:', error);
            alert('An error occurred during the purchase process. Please try again later.');
            document.querySelector('#checkoutForm').style.display = 'none';
    
        }
    }
    

function purchaseHistory(bookId, total, quantity,sellerId,title) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    const custId = localStorage.getItem('currentUserID');
    const newTransaction = {
        custId: custId,
        sellerId: sellerId,
        bookId: bookId,
        bookTitle:title,
        total: total,
        quantity: quantity,
        date: new Date().toISOString() ,
        transactionId: Date.now()+ Math.random().toString(36).substr(2, 9)
    };

    transactions.push(newTransaction);

    localStorage.setItem('transactions', JSON.stringify(transactions));


    //Displaying in purchaseHistory page:


}

async function getTransaction(){
    const data = await fetch("../data/transactions.json");
    transactions = await data.json();
    console.log(transactions);
    localStorage.setItem('users', JSON.stringify(transactions));
  }

  


