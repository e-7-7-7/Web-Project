let user;
let userRole;
const profilePopup = document.querySelector("#profilePopup");
const profileImage = document.querySelector("#profileImageInput");
const addressUpdatePopup = document.querySelector("#addressUpdatePopup");
const addressUpdateForm = document.querySelector("#addressUpdateForm");
const addressUpdateCancelButton = document.querySelector(
  "#cancelUpdateAddress"
);

document.addEventListener("DOMContentLoaded", async function () {
  await loadUser();
  profileImage.addEventListener("click", profile);
  addressUpdateForm.addEventListener("submit", profileAddressUpdateSubmition);
  addressUpdateCancelButton.addEventListener("click", addressUpdateCancel);
});

async function loadUser() {
  const usernameArea = document.querySelector("#headerUsername");
  const currentUserID = localStorage.getItem("currentUserID");
  userRole = localStorage.getItem("userRole");
  if (currentUserID) {
    try {
      const response = await fetch(`/api/login?currentUserID=${currentUserID}`);
      if (response.ok) {
        user = (await response.json()).data;
      } else {
        alert((await response.json()).error);
      }
    } catch (error) {
      alert(error.message);
    }
    if (user) {
      if (userRole === "Customer") {
        usernameArea.innerHTML = user.username; // the name here is the customer first name
      }

      if (userRole === "Seller" || userRole === "Admin") {
        usernameArea.innerHTML = user.firstname; // the name here is the Admin/Seller (company) name
      }
    } else {
      usernameArea.innerHTML = "Guest";
    }
  } else {
    usernameArea.innerHTML = "Guest";
  }
}

function profile() {
  profilePopup.classList.remove("hidden");

  if (user) {
    // if signed in
    profilePopup.innerHTML = profileDetails();
  } else {
    // if not signed in
    profilePopup.innerHTML = `
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
        `;
  }
}

function profileDetails() {
  if (userRole === "Customer") {
    return `
        <div class="profileDetailsTitle">
            <h2>User Details</h2>
        </div>
        <div class="profileInfo">
            <label for="">Username:</label>
            <p>${user.username}</p>

            <label for="">Fullname:</label> <!--name + surname-->
            <p>${user.firstname} ${user.surname}</p>
        </div>

            <div class="profileDetailsTitle">
                <h2>Shipping Address</h2>
            </div>
            
            <div class="userShippingAddress">
    
                <label for="">Country:</label>
                <p>${user.shipping_address.country}</p>
                
                <label for="">City:</label>
                <p>${user.shipping_address.city}</p>
                
                <label for="">Street:</label>
                <p>${user.shipping_address.street}</p>
    
                <label for="">House Number:</label>
                <p>${user.shipping_address.house_number}</p>
    
                <label for="">User ID:</label>
                <p>${user.id}</p>
    
                <label for="">Balance:</label>
                <p>${user.account_Balance} QR</p>
            </div>

        <div class="profileButtons">
            <button type="button" id="logoutButton" onclick="profileLogout()">Logout</button>
            <button type="button" id="updateAddressButton" onclick="profileAddressUpdate()">Update Shipping Address</button>
            <button type="button" id="goBack" onclick="profileGoBack()">Go Back</button>
        </div>
        `;
  }

  if (userRole === "Seller") {
    console.log(user);
    return `
        <div class="profileDetailsTitle">
            <h2>User Details</h2>
        </div>
        <div class="profileInfo">
            <label for="">Username:</label>
            <p>${user.username}</p>
            <label for="">Name:</label>
            <p>${user.firstname}</p>
            <label for="">User ID:</label>
            <p>${user.id}</p>
            <label for="">Balance:</label>
            <p>${user.sellers[0].account_Balance} QR</p>
        </div>
        <div class="profileButtons">
            <button type="button" id="logoutButton" onclick="profileLogout()">Logout</button>
            <button type="button" id="goBack" onclick="profileGoBack()">Go Back</button>
        </div>
        `;
  }

  if (userRole === "Admin") {
    return `
        <div class="profileDetailsTitle">
            <h2>User Details</h2>
        </div>
        <div class="profileInfo">
            <label for="">Username:</label>
            <p>${user.username}</p>
            <label for="">Name:</label>
            <p>${user.firstname}</p>
            <label for="">User ID:</label>
            <p>${user.id}</p>
        </div>
        <div class="profileButtons">
            <button type="button" id="logoutButton" onclick="profileLogout()">Logout</button>
            <button type="button" id="goBack" onclick="profileGoBack()">Go Back</button>
        </div>
        `;
  }
}

function profileGoBack() {
  profilePopup.classList.add("hidden");
}

function profileAddressUpdate() {
  // form input fields
  const country = document.querySelector("#country");
  const city = document.querySelector("#city");
  const street = document.querySelector("#street");
  const house_number = document.querySelector("#house_number");

  country.value = user.shipping_address.country;
  city.value = user.shipping_address.city;
  street.value = user.shipping_address.street;
  house_number.value = user.shipping_address.house_number;

  profilePopup.classList.add("hidden");
  addressUpdatePopup.classList.remove("hidden");
}

function profileLogout() {
  const response = confirm("Are you sure you want to logout?");
  if (response) {
    localStorage.isAuthenticated = false;
    delete localStorage.currentUserID;
    delete localStorage.userRole;
    window.location.href = "../../Homepage/index.html";
  }
}

function profileLogin() {
  window.location.href = "../../login/login.html";
}

async function profileAddressUpdateSubmition(form) {
  form.preventDefault();
  const currentUserID = localStorage.getItem("currentUserID");
  const shipping_address = formToObject(form.target);
  // console.log(shipping_address);

  try {
      const response = await fetch(`/api/login?currentUserID=${currentUserID}`);
      if (response.ok) {
        user = (await response.json()).data;
      } else {
        alert((await response.json()).error);
      }
    } catch (error) {
      alert(error.message);
    }
  console.log(user);
  const currentAddress = user.shipping_address
  currentAddress.country = shipping_address.country
  currentAddress.city = shipping_address.city
  currentAddress.street = shipping_address.street
  currentAddress.house_number = shipping_address.house_number

  const customer = {
    id             : user.customers[0].id,  
  account_Balance  : user.customers[0].account_Balance,
  userId        :user.customers[0].userId,   
  shipping_address :user.customers[0].shipping_address,
  }

 customer.shipping_address[0] = currentAddress

 console.log(customer);
 console.log(user.customers[0]);
 
  try {
        await fetch("/api/customer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            customer
          ),
        })
    } catch (error) {
      alert(error.message);
    }


     
  try {
         await fetch("/api/address", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            currentAddress
          ),
    })
    } catch (error) {
      alert(error.message);
    }


  loadUser();
  alert("the Shipping Address has been updated successfully");
  addressUpdatePopup.classList.add("hidden");
  location.reload(); // refresh the page
}

function addressUpdateCancel() {
  // addressUpdateForm.reset();
  profilePopup.classList.remove("hidden");
  addressUpdatePopup.classList.add("hidden");
}

function formToObject(form) {
  // returns the form as an object
  const formData = new FormData(form);

  const data = {};

  for (const [key, value] of formData) {
    // this for loop is to extract the data of the form and put it in an object (works for every form)
    data[key] = value; // the key is the name of the form element and the value is the value
  }

  return data;
}
