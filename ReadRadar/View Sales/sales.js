

let filteredBooks =[];  // we store on sale books here for a specific seller
let pendingBooks=[]; // all pending Books for all sellers 
let transactions=[]; // we store sold books here
let Allbooks=[] //  we store on sale books here for all sellers

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
const popupCover = document.querySelector("#cover");
const popupUpdateButton = document.querySelector("#update");
const popupCancelButton = document.querySelector("#cancel");
const popupID = document.querySelector("#id");



// event listeners
soldButton.addEventListener("click",showSoldBooks);
onsaleButton.addEventListener("click",showOnSaleBooks);
allButton.addEventListener("click",showAllBooks);
pendingButton.addEventListener("click",showPendingBooks);
popupCancelButton.addEventListener("click",handleCancel);
popupForm.addEventListener("submit",handleSubmit);


// functions


async function loadFiles(){ // loading the file using fetch
    if(!localStorage.onSaleBooks){
        const data =  await fetch('../data/onSaleBooks.json')
        Allbooks = await data.json();
        localStorage.onSaleBooks = JSON.stringify(Allbooks);
        filteredBooks = Allbooks;
    }
    else{
        Allbooks = JSON.parse(localStorage.onSaleBooks);
        filteredBooks = Allbooks;
    }
    
    console.log(filteredBooks);
    if(!localStorage.transactions){
        const data2 =  await fetch('../data/transactions.json')
        transactions = await data2.json();
        localStorage.transactions = JSON.stringify(transactions);
    }
    else{
        transactions = JSON.parse(localStorage.transactions);
    }

    console.log(transactions);

    if(!localStorage.pendingBooks){
        const data3 =  await fetch('../data/pendingBooks.json')
        pendingBooks = await data3.json();
        localStorage.pendingBooks = JSON.stringify(pendingBooks);

    }
    
    if (localStorage.userRole === "Seller"){
        const id = localStorage.currentUserID;
        filterBooks(id);  // filter the books if the role is seller
    }
    
}




function filterBooks(id) { // filters the books after the fetch of the files
    filteredBooks = filteredBooks.filter(b=> b.seller_id == id);
    transactions = transactions.filter(t=>t.seller_id == id);
    pendingBooks = pendingBooks.filter(p=>p.seller_id == id);
    console.log("books length for id " + id + " is : " + books.length );
    console.log("transactions length for id " + id + " is : " + transactions.length ); 
 }



function showSoldBooks(){
    localStorage.selectedTab = "sold";

    soldButton.classList="selected" // setting the background color only to the selected tab
    allButton.classList=""
    onsaleButton.classList=""
    pendingButton.classList=""

    bookListArea.innerHTML=""; // reset the page
    bookAreaTitle.innerHTML="<h1>Sold Books</h1>"
    if(transactions.length === 0){
        bookAreaTitle.innerHTML= bookAreaTitle.innerHTML + `<h2 style="text-align: center;">There is no sold books related for this account</h2>`;
    }
    else{
        bookListArea.innerHTML=transactions.map(transaction=> transactionToHTML(transaction)).join(" ");
    }
    

}

function showAllBooks(){
    localStorage.selectedTab = "all";

    soldButton.classList="" // setting the background color only to the selected tab
    allButton.classList="selected"
    onsaleButton.classList=""
    pendingButton.classList=""

    bookListArea.innerHTML=""; // reset the page
    console.log("All Books button is clicked");
    bookAreaTitle.innerHTML="<h1>All Books</h1>"
    if(transactions.length===0 && filteredBooks.length===0){
        bookAreaTitle.innerHTML=bookAreaTitle.innerHTML +"<h2>There is no Books to be displayed</h2>"
    }
    else{
        bookListArea.innerHTML=filteredBooks.map(b=> onsaleBookToHTML(b)).join(" ") + transactions.map(transaction=> transactionToHTML(transaction)).join(" ");
    }
}

function showOnSaleBooks(){
    localStorage.selectedTab = "sale";

    soldButton.classList="" // setting the background color only to the selected tab
    allButton.classList=""
    onsaleButton.classList="selected"
    pendingButton.classList=""

    bookListArea.innerHTML=""; // reset the page
    bookAreaTitle.innerHTML="<h1>On Sale Books</h1>"
    if(filteredBooks.length === 0){
        bookAreaTitle.innerHTML=  bookAreaTitle.innerHTML + `<h2>There is no books currently on sale</h2>` 
    }
    else{
        bookListArea.innerHTML=filteredBooks.map(b=> onsaleBookToHTML(b)).join(" ")
    }
}

function showPendingBooks(){
    localStorage.selectedTab = "pending";

    soldButton.classList="" // setting the background color only to the selected tab
    allButton.classList=""
    onsaleButton.classList=""
    pendingButton.classList="selected"
    bookListArea.innerHTML=""; // reset the page
    bookAreaTitle.innerHTML="<h1>Pending Approval Books</h1>"
}





function onsaleBookToHTML(book){
   if (localStorage.userRole) {
    if (localStorage.userRole ==="Seller") {
        return `<div class="card">
                <img src="${book.cover}" alt="${book.title}">

                <label for="">Title:</label>
                <p name="bookTitle" id = "">${book.title}</p>

                
                <label for="">Author(s):</label>
                <p>${book.author}</p>

                <label for="">Genre:</label>
                <p>${book.genre}</p>
                

                <label for="">Price: </label>
                <p>${book.price} Qr</p>

                <label for="">Book ID: </label>
                <p>${book.id}</p>
                <div class="bookButtons">
                    <button class ="bookButton" type="button" id="updateButton" onclick="mapBook(${book.id})">Update</button>
                    <button class ="bookButton" type="button" id="deleteButton" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>` ;
        
    } else {
        return `<div class="card">
                <img src="${book.cover}" alt="${book.title}">

                <label for="">Title:</label>
                <p name="bookTitle" id = "">${book.title}</p>

                
                <label for="">Author(s):</label>
                <p>${book.author}</p>

                <label for="">Genre:</label>
                <p>${book.genre}</p>
                

                <label for="">Price: </label>
                <p>${book.price} Qr</p>

                <label for="">Book ID: </label>
                <p>${book.id}</p>
                <div class="bookButtons">
                    <button class ="bookButton" type="button" id="deleteButton" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>` ;
        
    }

   }

}
function transactionToHTML(transaction){ // converts a transcation to html
    const date = new Date(transaction.date);
    let hours=date.getHours();
    
    let time = "";
    if(hours >12){
        hours= hours%12;
        time="PM"
    }
    else if(date.getMinutes()>0 && date.getHours()==12){
        time="PM"
    }
    else{
        time="AM"
    }

    return transaction.books.map(book=> 
        `<div class="card">
            <img src="${book.cover}" alt="${book.title}">

            <label for="">Title:</label>
            <p name="bookTitle" id = "">${book.title}</p>

            <label for="">Author(s):</label>
            <p>${book.author}</p>

            <label for="">Genre:</label>
            <p>${book.genre}</p>
            
            <label for="">Price: </label>
            <p>${book.price} Qr</p>

            <label for="">Customer ID:</label>
            <p>${transaction.customer_id}</p>

            <label for="">Transaction ID:</label>
            <p>${transaction.id}</p>

            <label for="">Date:</label>
            <p>${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} (${hours}:${date.getMinutes()} ${time})</p>
        
            </div>`).join(" ") ;   
}

function deleteBook(id){
    const index = Allbooks.findIndex(b=> b.id == id)
    const book = Allbooks[index];
    let result = confirm(`Are you sure about deleting\nBook: ${book.title}\nPrice: ${book.price}  \nBook ID: ${book.id}`);
    if(result){
        Allbooks.splice(index,1);
        filteredBooks = Allbooks;
        filterBooks();
        localStorage.onSaleBooks = JSON.stringify(Allbooks);
        alert(`The book with the id ${book.id} has been deleted successfully`);
        showSelectedTab();
    }
   
}


function mapBook(id){ // maps the book data to the update form
    popupArea.classList.remove("hidden");
    const index = Allbooks.findIndex(b=> b.id ==id)
    const book = Allbooks[index];
    console.log(book.title);
    popupTitle.value=book.title;
    popupAuthor.value = book.author;
    popupDescription.value = book.description;
    popupGenre.value = book.genre;
    popupPrice.value = book.price;
    popupID.value=book.id;
}


function handleSubmit(event){ // the event here is submitting the updated book
    event.preventDefault();
    const title = popupTitle.value;
    const author = popupAuthor.value;
    const genre = popupGenre.value;
    const price = popupPrice.value;
    const description = popupDescription.value;
    const id = popupID.value;
    const cover = popupCover.files[0];

    console.log("We reached here");
     // Use FileReader to read the selected file (cover image)
    if (cover) {
        console.log("we update book with image");
        const reader = new FileReader();
        reader.onload = function(e) {
            updateBook(e.target.result, title, author, price, description, genre,id);
        };
        reader.readAsDataURL(cover); // Converts the file into a data URL
    } else {
        console.log("we update book without image");
        updateBook('', title, author, price, description, genre,id); // No cover image provided
    }
 
    localStorage.onSaleBooks = JSON.stringify(Allbooks);
    popupForm.reset();
    popupArea.classList.add("hidden");
    alert(`The book with the id ${id} has been updated successfully`)
    showSelectedTab()

}

function updateBook(imageURL,title, author, price, description, genre,id){//update the book by replacing old values with new values
    const index = Allbooks.findIndex(b => b.id == id);
    Allbooks[index].title=title;
    Allbooks[index].author = author;
    Allbooks[index].price= price;
    Allbooks[index].description=description;
    Allbooks[index].genre=genre;
    if(imageURL!= ""){
        Allbooks[index].cover=imageURL;
    }
    
}

function handleCancel(){
    console.log("Cancel reached");
    popupForm.reset();
    popupArea.classList.add("hidden");
}

function showSelectedTab(){
    console.log("Enterd selected tab");
    if (localStorage.selectedTab) {

        if(localStorage.selectedTab =="all"){
            showAllBooks();
        }
        else if(localStorage.selectedTab =="sold"){
            showSoldBooks();
        }
        else if(localStorage.selectedTab =="pending"){
            showPendingBooks();
        }
        else{
            showOnSaleBooks();
        }
    }

    else{
        bookListArea.innerHTML="";
    }
}







