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

export default HttpStatus;
