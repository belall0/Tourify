import axios from 'axios';
import showAlert from './alerts';

const logout = async () => {
  try {
    const res = await axios.post('/api/auth/logout', {});
    showAlert('success', 'Logged out successfully!');
    window.location.assign('/login');
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

export default logout;
