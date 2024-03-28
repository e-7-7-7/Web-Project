

document.addEventListener('DOMContentLoaded', function() {
    localStorage.setItem('isAuthenticated', 'false');
    let users = JSON.parse(localStorage.getItem('users'));
    // If not found, initialize with default users and save to localStorage
    if (!users) {
      getUsers()
    }

    async function getUsers(){
      const data = await fetch("../data/users.json");
      users = await data.json();
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


      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      const user = users.find(user => user.username === username && user.password === password);
      
      if(user) {
        // Store user role and authentication state in localStorage
         localStorage.setItem('isAuthenticated', 'true');
         localStorage.setItem('userRole', user.role);
         localStorage.setItem('currentUser', JSON.stringify(user));

          window.location.href = '../index.html';
      } else {
        
          alert('Login failed. Incorrect username or password.');
      }
  });
  

  });
  