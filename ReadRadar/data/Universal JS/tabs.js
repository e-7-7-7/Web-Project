
document.addEventListener("DOMContentLoaded", function () {
    showTabs();
})


function showTabs(){
    // Retrieve the user role from localStorage
    const userRole = localStorage.getItem('userRole');
    const addButton = document.querySelector('#addListItem');
    const viewSalesButton = document.querySelector("#viewSalesListItem");
    const purchaseHistButton = document.querySelector("#purchaseHistListItem");

    var path = window.location.pathname;//to get html file name
    var page = path.split("/").pop();

    

    // Check if the user role is "Seller"
    if (page !== "View_Sales.html" || page !== "purchaseHist.html" || page !== "search.html") {
      if (userRole === 'Seller') {
         addButton.classList.remove("hidden")
      }
      
    }
   
    if (userRole ==="Seller" || userRole ==="Admin") {
       viewSalesButton.classList.remove("hidden")
    }

    if (userRole ==="Customer") {
       purchaseHistButton.classList.remove("hidden")
    }
}