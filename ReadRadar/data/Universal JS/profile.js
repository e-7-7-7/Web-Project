let user;
const profileImage = document.querySelector("#profileImageInput");

document.addEventListener('DOMContentLoaded', function() {
    loadUser();
    profileImage.addEventListener("click",profile)

});

function loadUser(){
    const usernameArea = document.querySelector("#headerUsername");
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserID = localStorage.getItem('currentUserID');

    if (currentUserID) {
        user = usersData.find(u => u.id ===currentUserID)
        if (user) {
            usernameArea.innerHTML = user.username; 
        }
        else{
            usernameArea.innerHTML = "Guest";
        }
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
        delete localStorage.currentUserID;
        delete localStorage.userRole;
        location.reload();
    }
}

function profileLogin(){
    window.location.href="../../login/login.html";
}

