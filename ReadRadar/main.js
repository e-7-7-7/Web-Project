delete localStorage.searchValue // empty the search value
let user;
const profileImage = document.querySelector("#profileImageInput");



document.addEventListener('DOMContentLoaded', function() {

    loadUser();
    // Display books from localStorage on page load
    displayBooksFromLocalStorage();
    showTabs();

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


    profileImage.addEventListener("click",profile)

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

function showTabs(){
     // Retrieve the user role from localStorage
     const userRole = localStorage.getItem('userRole');
     const addButton = document.querySelector('#addListItem');
     const viewSalesButton = document.querySelector("#viewSalesListItem");

     // Check if the user role is "Seller"
     if (userRole === 'Seller') {
        addButton.classList.remove("hidden")
     }
     if (userRole ==="Seller" || userRole ==="Admin") {
        viewSalesButton.classList.remove("hidden")
     }
}

function loadUser(){
    const usernameArea = document.querySelector("#headerUsername");
    if (localStorage.currentUser) {
        user = JSON.parse(localStorage.currentUser);
        usernameArea.innerHTML = user.username;
    }
    else{
        usernameArea.innerHTML = "Guest";
    }
}

function profile(){
    const popup = document.querySelector("#profilePopup")
    popup.classList.remove("hidden")

    if (user) { // if signed in
        popup.innerHTML= profileDetails();
    }
    else{ // if not signed in
        popup.innerHTML= `
        <div class="profileDetailsTitle">
            <h2>User Details</h2>
        </div>
        <div class="profileInfo">
            <p>you are currently not logged in to the website</p>
        </div>
        <div class="profileButtons">
            <button type="button" id="logoutButton" onclick="profileLogin()">Login</button>
            <button type="button" id="goBack" onclick="profileGoBack()">Go Back</button>
        </div>
        `
    }

}

function profileDetails() {
    return `
    <div class="profileInfo">
        <label for="">Username:</label>
        <p>${user.username}</p>
        <label for="">Name:</label>
        <p>${user.name}</p>
        <label for="">User ID:</label>
        <p>${user.id}</p>
        <label for="">Balance:</label>
        <p>${user.account_Balance} QR</p>
    </div>
    <div class="profileButtons">
        <button type="button" id="logoutButton" onclick="profileLogout()">Logout</button>
        <button type="button" id="goBack" onclick="profileGoBack()">Go Back</button>
    </div>
    `   
}

function profileGoBack(){
    const popup = document.querySelector("#profilePopup")
    popup.classList.add("hidden")
}

function profileLogout(){
    const response = confirm("Are you sure you want to logout?")
    if (response){
        delete localStorage.isAuthenticated;
        delete localStorage.currentUser;
        delete localStorage.userRole;
        window.location.href="./index.html";
    }
}

function profileLogin(){
    window.location.href="./login/login.html";
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
                displayOnCheckout(selectedBook.coverImageUrl, selectedBook.title, selectedBook.price)

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

    const checkoutButton = document.querySelector('#checkoutButton');
    checkoutButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        purchaseItem(price * quantity); 
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





// async function getUsers(){
//   const data = await fetch("data/users.json");
//   users = await data.json();
//   localStorage.setItem('users', JSON.stringify(users));
// }
function purchaseItem(subtotal) {
    try {
        const usersData = JSON.parse(localStorage.getItem('users')) || [];
        
        const currentUserID = localStorage.getItem('currentUserID');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        
        const currentUser = usersData.find(user => user.id === currentUserID);
        
        // Check if the user is authenticated
        if (isAuthenticated === 'true') {
            // Ensure the current user is a customer
            if (currentUser && currentUser.role === 'Customer') {
                let balance = parseFloat(currentUser.account_Balance);
                if (balance >= subtotal) {
                    balance -= subtotal;
                    alert("Checkout Successful !!");
                    // Update user's balance
                    currentUser.account_Balance = balance;
                    // Update localStorage
                    localStorage.setItem('users', JSON.stringify(usersData));
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








