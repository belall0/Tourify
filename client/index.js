import login from './login.js';
import signup from './signup.js';
import displayMap from './map.js';
import logout from './logout.js';
import updateProfileData from './updateProfile.js';
// DOM ELEMENTS
const map = document.getElementById('map');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');
const logoutBtn = document.querySelector('.nav__el--logout');
const settingsForm = document.querySelector('.form-user-data');
const passwordForm = document.querySelector('.form-user-password');

const profileImage = document.getElementById('profileImage');
const uploadImage = document.getElementById('uploadImage');

if (profileImage || uploadImage) {
  // Add event listener
  uploadImage.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profileImage.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

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
    const photo = document.getElementById('profilePicture').files[0];

    signup(name, email, role, password, confirmPassword, photo);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (settingsForm) {
  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const photo = uploadImage.files[0];

    const data = { name, email, photo };

    updateProfileData(data, 'info');
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return false;
    }

    const data = { currentPassword, newPassword };
    updateProfileData(data, 'password');
  });
}
