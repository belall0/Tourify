const HttpStatus = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  NOT_FOUND: 404,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
};

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
}

export { HttpStatus, ResponseHandler };
