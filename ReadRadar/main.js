
let price;
let balance;
let title;
let subtotal;

document.addEventListener('DOMContentLoaded', function() {
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
        
        // Use FileReader to read the selected file (cover image)
        if (cover) {
            const reader = new FileReader();
            reader.onload = function(e) {
                createBookCard(e.target.result, title, author, price, description, genre);
            };
            reader.readAsDataURL(cover); // Converts the file into a data URL
        } else {
            createBookCard('', title, author, price, description, genre); // No cover image provided
        }

        // Close the form
        document.querySelector('#popupForm').style.display = 'none';
    });


    




  });
  
  document.addEventListener('DOMContentLoaded', function() {
    const cancelButton = document.querySelector('#cancel');
    cancelButton.addEventListener('click', function(event) {
        document.querySelector('#purchContent').remove();
    });
    const proceedButton = document.querySelector('#proceed');
    proceedButton.addEventListener('click', function(event) {
      
      document.querySelector('#checkoutForm').style.display = 'block';
    });

    //Checkout button needs modification
    const checkoutButton=document.querySelector('#checkout');
    checkoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        purchaseItem(subtotal);
        alert("Checkout successful");
    });



    
  });

    

    


function createBookCard(coverImageUrl, title, author, price, description, genre) {
    const card = document.createElement('div');
    card.className = 'inner-card';
    
    card.innerHTML = `
        <img src="${coverImageUrl || 'default-cover-image-path.jpg'}" alt="${title}">
        <p>Title: ${title}</p>
        <p>Author: ${author}</p>
        <p>Price: $${price}</p>
        <p>Description: ${description}</p>
        <button id="Add">Add</button>
    `;

    // Assume the genre translates to an ID - customize this as needed
    const section = document.querySelector(`#${genre.replace(/\s+/g, '-')}`) || document.querySelector('#2024-Books');
    section.appendChild(card);

}




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


