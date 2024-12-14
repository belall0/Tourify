import { filterObjectFields, filterDocumentFields } from '../utils/dataFilter.js';

const HttpStatus = {
  // Success responses
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client error responses
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,

  // Server error responses
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

const success = (res, status = HttpStatus.OK, data = null, key = 'data', token = null, message = null) => {
  const response = {
    status: 'success',
  };

  if (token) response.token = token;

  // Filter user document to remove sensitive information from the response
  if (data && key === 'user') {
    data = filterDocumentFields(data, ['name', 'email', 'photo', 'role']);
  }

  if (status !== HttpStatus.NO_CONTENT && data) {
    response.count = Array.isArray(data) ? data.length || 0 : 1;
    response.data = { [key]: data };
  }

  if (message) response.message = message;

  return res.status(status).json(response);
};

export { HttpStatus, success };
