import axios from 'axios';
import showAlert from './alerts';

const updateProfileData = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/users/update-password' : '/api/users/me';
    console.log(url);
    const res = await axios.put(url, data);

    showAlert('success', res.data.message);
    console.log(`finished`);
    return;

    // setTimeout(() => {
    //   window.location.assign('/me');
    // }, 500);
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export default updateProfileData;
