document.addEventListener('DOMContentLoaded', function() {
    // Display books from localStorage on page load
    displayBooksFromLocalStorage();

    document.querySelector('#addItemLink').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#popupForm').style.display = 'block';
    });

    document.querySelector('#uploadItemForm').addEventListener('submit', function(event) {
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
        createBookCard(book.coverImageUrl, book.title, book.author, book.price, book.description, book.genre);
    });
}

function createBookCard(coverImageUrl, title, author, price, description, genre) {
    const card = document.createElement('div');
    card.className = 'inner-card';
    card.innerHTML = `
        <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
        <p>Title: ${title}</p>
        <p>Author: ${author}</p>
        <p>Price: $${price}</p>
        <p>Description: ${description}</p>
    `; // Note: Removed the Add button for simplicity
    const section = document.querySelector(`#${genre.replace(/\s+/g, '-')}`) || document.querySelector('#2024-Books');
    section.appendChild(card);
}







//=========================
let price;
let balance;
let title;
let subtotal;

// Fetch book data from JSON file
//Needs Modification when Adding books is finished 
function processBookData() {
    fetch('items.json') 
        .then(res => res.json())
        .then(data => {
            const book = data[0]; // Assuming the first book in the array
            title = book.title;
            price = book.price;
            displaySelectedBook();
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });
}

function displaySelectedBook() {
    const cartSection = document.querySelector('#book-picked');
    cartSection.innerHTML = `<p>${title}</p><p>Price: $${price}</p>`;

    const quantityInput = document.getquerySelector('#quantity');

    quantityInput.addEventListener('input', calculateSubtotal);
}

function calculateSubtotal(event) {
    const quantity = parseInt(event.target.value) || 0;
    subtotal = price * quantity;

    // Display subtotal
    const subtotalDisplay = document.querySelector('#subtotal');
    subtotalDisplay.textContent = `Subtotal: $${subtotal}`;
}

// Call function to fetch book data when the page loads
document.addEventListener('DOMContentLoaded', processBookData);



// //Purchase Item process 
// //UNDER MODIFICATION//



// let price; 
// let balance;
// let title;
// let subtotal; 



// // The Following 4 function will be called when the user Select a book to be purchased using the buy button on each book 

// //Here will be the function of showing the selected book in the Cart Aside
// function displaySelected(){

// }

// function proccessBookData() {
//     fetch('items.json') 
//       .then(res => res.json())
//       .then(data => {
//         data.forEach(book => {
//           title=book.title;
//           price=book.price
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching book data:', error);
//       });
//   }

//   function proccessSubtotal(){
//     const quantityInput = document.querySelector('#quantity');
//     quantityInput.addEventListener('input', function(event) {
//         const quantity = event.target.value;
//     });

//     subtotal = price * quantity;
// }

//   function displaySubtotal(){
//     const p1 = document.createElement('p');
//     p1.textContent = 'Subtotal:'
//     const p2 = document.createElement('p');
//     p2.textContent = 'One Lost Soul'
//     const p3 = document.createElement('p');
//     p3.textContent = '30 QAR'

//     const addElement = document.getElementById('#purchase')
//     addElement.appendChild(p1)
//     addElement.appendChild(p2)
//     addElement.appendChild(p3)

// };



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

function purchaseItem(title, subtotal) {
    if (balance >= subtotal) {
        balance -= subtotal;
        console.log(`Successfully purchased ${title}. Remaining balance: ${balance}`);
    } else {
        console.log("Insufficient balance to purchase", title);
    }
}

