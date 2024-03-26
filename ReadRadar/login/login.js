

document.addEventListener('DOMContentLoaded', function() {
    let users = JSON.parse(localStorage.getItem('users'));
    // If not found, initialize with default users and save to localStorage
    if (!users) {
      users = [
          { username: "customer1", password: "password123", role: "Customer", account_Balance: 200 },
          { username: "seller1", password: "password123", role: "Seller", account_Balance: 0 },
          { username: "admin1", password: "password123", role: "Admin", account_Balance: 0 },
      ];
      localStorage.setItem('users', JSON.stringify(users));
    }
  
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
      
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const user = users.find(user => user.username === username && user.password === password);
      
      if(user) {
        // Store user role and authentication state in localStorage
        localStorage.setItem('isAuthenticated', 'true');
         localStorage.setItem('userRole', user.role);
          window.location.href = '../index.html';
      } else {
          alert('Login failed. Incorrect username or password.');
      }
  });
  

  });
  