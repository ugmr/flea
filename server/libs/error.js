const ERROR = {
  USER_EXISTED: {
    type: 'USER_EXISTED',
    message: '用户已存在'
  },
  USER_NOT_FOUND: {
    type: 'USER_NOT_FOUND',
    message: '用户不存在'
  },
  BAD_REQUEST: {
    type: 'BAD_REQUEST',
    message: 'Bad request'
  },
  FORMAT_INVALID: {
    type: 'FORMAT_INVALID',
    message: 'The request format is invalid'
  },
  DATA_NOT_FOUND: {
    type: 'DATA_NOT_FOUND',
    message: 'The data is not found in database'
  },
  DATA_EXISTED: {
    type: 'DATA_EXISTED',
    message: 'The data has exist in database'
  },
  DATA_INVALID: {
    type: 'DATA_INVALID',
    message: 'The data is invalid'
  },
  LOGIN_REQUIRED: {
    type: 'LOGIN_REQUIRED',
    message: 'Please login first'
  },
  PERMISSION_DENIED: {
    type: 'PERMISSION_DENIED',
    message: 'You have no permission to operate'
  },
  SERVER_ERROR: {
    type: 'SERVER_ERROR',
    message: 'Server error'
  },
  UNKNOWN_ERROR: {
    type: 'UNKNOWN_ERROR',
    message: 'Unknown error'
  }
};

class CError extends Error {
  constructor(error, detail) {
    super();
    Error.captureStackTrace(this, this.constructor);

    if (!error in ERROR) {
      error = ERROR.UNKNOWN_ERROR;
    }

    this.name = 'CError';
    this.type = error.type;
    this.message = error.message;
    this.detail = detail;
  }
}

module.exports = {
  CError,
  ERROR
};