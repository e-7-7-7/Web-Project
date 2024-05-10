
document.addEventListener("DOMContentLoaded", function () {
    showTabs();
})


function showTabs(){
    // Retrieve the user role from localStorage
    const userRole = localStorage.getItem('userRole');
    const addButton = document.querySelector('#addListItem');
    const viewSalesButton = document.querySelector("#viewSalesListItem");
    const purchaseHistButton = document.querySelector("#purchaseHistListItem");
    const statButton = document.querySelector("#stat")

    var path = window.location.pathname;//to get html file name
    var page = path.split("/").pop();

    


    if (page === "index.html") { //
      if (userRole === 'Seller') {      // Check if the user role is "Seller"
         addButton.classList.remove("hidden")
      }
      
    }
   
    if (userRole ==="Seller" || userRole ==="Admin") { // Check if the user role is "Seller" or "Admin"
       viewSalesButton.classList.remove("hidden")
    }

    if (userRole ==="Customer") {// Check if the user role is "Customer"
       purchaseHistButton.classList.remove("hidden")
    }

     if (userRole =="Admin") { // Check if the user role is "Admin"
       statButton.classList.remove("hidden")
    }
}

