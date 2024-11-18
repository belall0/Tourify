import HttpStatus from './httpStatus.js';

class ResponseHandler {
  static success(res, status = HttpStatus.OK, data = null, key = 'data') {
    const response = {
      status: 'success',
    };

    if (status !== HttpStatus.NO_CONTENT) {
      // response.count = data.length || 1;
      response.count = Array.isArray(data) ? data.length || 0 : 1;
      response.data = { [key]: data };
    }

    return res.status(status).json(response);
  }

  static error(res, status = HttpStatus.BAD_REQUEST, errMsg) {
    const response = {
      status: 'fail',
      message: errMsg,
    };

    return res.status(status).json(response);
  }
}

export { HttpStatus, ResponseHandler };
