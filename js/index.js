import login from './login.js';
import signup from './signup.js';
import displayMap from './map.js';
import logout from './logout.js';

// DOM ELEMENTS
const map = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logoutBtn = document.querySelector('.nav__el--logout');

// ATTACH EVENT LISTENERS
if (map) {
  const locations = JSON.parse(map.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;

    signup(name, email, role, password, confirmPassword);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
