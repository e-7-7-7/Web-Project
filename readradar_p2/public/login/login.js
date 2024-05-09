document.addEventListener("DOMContentLoaded", function () {
  localStorage.setItem("isAuthenticated", "false");
  // let users = JSON.parse(localStorage.getItem('users'));
  // // If not found, initialize with default users and save to localStorage
  // if (!users) {
  //   getUsers()
  // }

  // async function getUsers(){
  //   const data = await fetch("../data/users.json");
  //   users = await data.json();
  //   localStorage.setItem('users', JSON.stringify(users));
  // }

  const passwordInput = document.getElementById("password");
  const passwordEye = document.getElementById("password-eye");

  // Toggle show/hide password
  passwordEye.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    // Toggle the icon class
    this.innerHTML =
      type === "text"
        ? '<i class="ri-eye-line"></i>'
        : '<i class="ri-eye-off-line"></i>';
  });

  document
    .getElementById("login")
    .addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent the default form submit action
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        if (response.ok) {
          const user = (await response.json()).data;
          // Store user role and authentication state in localStorage
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", user.role);
          localStorage.setItem("currentUserID", user.id);

          window.location.href = "../Homepage/index.html";
        } else {
          alert((await response.json()).error);
        }
      } catch (error) {
        alert(error.message);
      }
    });
});
