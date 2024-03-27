
const searchForm= document.querySelector("#searchForm");
const searchBar = document.querySelector("#searchInput");


searchForm.addEventListener("submit",handleSearch);



function handleSearch(form){
    form.preventDefault();

    if(searchBar.value !=""){
        localStorage.searchValue = searchBar.value ;
        
        window.location.href ="./Search/search.html";
    }
}