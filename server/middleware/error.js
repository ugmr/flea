const { CError, ERROR } = require('../libs/error');
const logger = require("../libs/log4j")("error");

module.exports = () => {
  return function (err, req, res, next) {
    console.log(err);
    if(!err) {
      res.status(404);
    }

    else if(err instanceof CError){
      let status;
      switch(err.type) {
        case ERROR.USER_EXISTED.type:
          status = 205;
          break;
        case ERROR.USER_NOT_FOUND.type:
          status = 206;
          break;
        case ERROR.BAD_REQUEST.type:
        case ERROR.FORMAT_INVALID.type:
        case ERROR.DATA_EXISTED.type:
        case ERROR.DATA_INVALID.type:
          status = 400;
          break;
        case ERROR.LOGIN_REQUIRED.type:
          status = 401;
          break;
        case ERROR.PERMISSION_DENIED.type:
          status = 403;
          break;
        case ERROR.DATA_NOT_FOUND.type:
          status = 404;
          break;
        case ERROR.SERVER_ERROR.type:
        case ERROR.UNKNOWN_ERROR.type:
          status = 500;
          break;
        default:
          status = 500;
          break;
      }
      res.status(status).json({
        type: err.type,
        detail: err.detail
      });
    }
    else {
      res.status(500).json({
        type: 'UNKNOWN_ERROR',
        detail: '未知错误'
      });
    }
  };
}