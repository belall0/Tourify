/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const login = async (email, password) => {
  try {
    const res = await axios.post('/api/users/login', {
      email,
      password,
    });

    showAlert('success', 'Logged in successfully!');

    setTimeout(() => {
      window.location.assign('/');
    }, 500);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export default login;
