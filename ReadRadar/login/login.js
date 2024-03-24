import User from "../data/user";

document.addEventListener('DOMContentLoaded', function() {
    const users = [
      { username: "customer1", password: "password123", role: "Customer" },
      { username: "seller1", password: "password123", role: "Seller" },
      { username: "admin1", password: "password123", role: "Admin" },
    ];
  
    const passwordInput = document.getElementById('password');
    const passwordEye = document.getElementById('password-eye');
  
    // Toggle show/hide password
    passwordEye.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      // Toggle the icon class
      this.innerHTML = type === 'text' ? '<i class="ri-eye-line"></i>' : '<i class="ri-eye-off-line"></i>';
    });
  
    document.getElementById('login').addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default form submit action
      const username = document.getElementById('username').value;
      const password = passwordInput.value;
  
      const user = users.find(user => user.username === username && user.password === password);
  
      if(user) {
        //alert(`Login successful as ${user.role}`);
        window.location.href = '../index.html';
        
      } else {
        alert('Login failed. Incorrect username or password.');
      }
    });
  });
  