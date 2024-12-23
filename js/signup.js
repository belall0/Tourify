import axios from 'axios';
import showAlert from './alerts';

const validateForm = (passwordValue, confirmPasswordValue) => {
  // validate confirm password
  if (passwordValue !== confirmPasswordValue) {
    alert('Passwords do not match');
    return false;
  }

  return true;
};

const signup = async (name, email, role, password, confirmPassword) => {
  // validate form
  if (!validateForm(password, confirmPassword)) return;

  try {
    const res = await axios.post('/api/users/signup', {
      name,
      email,
      role,
      password,
      photo: 'default.jpg',
    });

    showAlert('success', 'Account created successfully!');

    setTimeout(() => {
      window.location.assign('/');
    }, 500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default signup;
