import HttpStatus from './httpStatus.js';

const success = (
  res,
  status = HttpStatus.OK,
  data = null,
  key = 'data',
  token = null,
  message = null,
) => {
  const response = {
    status: 'success',
  };

  if (token) {
    response.token = token;
  }

  if (status !== HttpStatus.NO_CONTENT && data) {
    response.count = Array.isArray(data) ? data.length || 0 : 1;
    response.data = { [key]: data };
  }

  if (message) {
    response.message = message;
  }

  return res.status(status).json(response);
};

export { HttpStatus, success };
