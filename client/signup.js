import axios from 'axios';
import showAlert from './alerts';

const signup = async (name, email, role, password, confirmPassword, photo) => {
  try {
    const res = await axios.post(
      '/api/auth/signup',
      {
        name,
        email,
        role,
        password,
        photo,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    showAlert('success', 'Account created successfully!');

    setTimeout(() => {
      window.location.assign('/');
    }, 500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export default signup;
