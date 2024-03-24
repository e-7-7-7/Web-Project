

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
      event.preventDefault();
      document.querySelector('#checkoutForm').style.display = 'block';
    });
});


    
const quantityInput = document.querySelector('#quantity');
quantityInput.addEventListener('click', function(event) {
    const quantity = event.target.value;
    purchaseItem("Book", subtotal); 
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



//Purchase Item process 
//UNDER MODIFICATION//



let price; 
let balance;
let title;
let subtotal; 



// The Following 4 function will be called when the user Select a book to be purchased

//Here will be the function of showing the selected book in the Cart Aside
function displaySelected(){

}

function proccessBookData() {
    fetch('items.json') 
      .then(res => res.json())
      .then(data => {
        data.forEach(book => {
          title=book.title;
          price=book.price
        });
      })
      .catch(error => {
        console.error('Error fetching book data:', error);
      });
  }

  function proccessSubtotal(){
    const quantityInput = document.querySelector('#quantity');
    quantityInput.addEventListener('input', function(event) {
        const quantity = event.target.value;
    });

    subtotal = price * quantity;
}

  function displaySubtotal(){
    const p1 = document.createElement('p');
    p1.textContent = 'Subtotal:'
    const p2 = document.createElement('p');
    p2.textContent = 'One Lost Soul'
    const p3 = document.createElement('p');
    p3.textContent = '30 QAR'

    const addElement = document.getElementById('#purchase')
    addElement.appendChild(p1)
    addElement.appendChild(p2)
    addElement.appendChild(p3)

};



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

