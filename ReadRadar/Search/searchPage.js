const searchForm= document.querySelector("#searchForm");
const searchBar = document.querySelector("#searchInput");
const searchTitle = document.querySelector("#searchTitle");
const searchResults = document.querySelector("#searchResults");
let books =[]; // array of for sale books

if(localStorage.searchValue){
    displayWantedBooks(localStorage.searchValue);
}


searchForm.addEventListener("submit",handleSearch);

function handleSearch(form){
    form.preventDefault();
    searchTitle.innerHTML="" // reset the search title
    searchResults.innerHTML="" // reset the search area
    if(searchBar.value !=""){
        localStorage.searchValue = searchBar.value ;
        displayWantedBooks(searchBar.value)
    }
}


function getBooks(){
    if(!localStorage.addedBooks){
        localStorage.addedBooks = JSON.stringify(books);
    }
    else{
        books = JSON.parse(localStorage.addedBooks);
    }
    
}


function displayWantedBooks(searchValue){
    getBooks();
    const searchWord =  new RegExp (searchValue,"i"); // creates a value to work with the search function
    const wantedBooks = books.filter(book => book.title.toLowerCase().search(searchWord) >=0 || book.author.toLowerCase().search(searchWord) >=0);
    console.log(wantedBooks);
    if(wantedBooks.length == 0){
        searchTitle.innerHTML=`<h2>There is no Books with the title / author  " ${searchValue} "</h2>`
        return;
    }
    else{
        searchTitle.innerHTML=`<h2>Results for " ${searchValue} "</h2>`;
        searchResults.innerHTML= wantedBooks.map(b=> createSearchBookCard(b)).join(" ");
    }
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
        <p>Price: ${price} QR</p>
        <p>Description: ${description}</p>
        <p>Genre: ${genre}</p>
    </div>
    `;
    
}
