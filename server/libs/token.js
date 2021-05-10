const jwt = require("jsonwebtoken");
const { jwt: config } = require("../config/auth");

const sign = (payload) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      config.secret,
      { expiresIn: config.expiresIn },
      (err, token) => {
        if (err) reject("create token error");
        resolve(token);
      }
    );
  });
};

const verify = function (token = "") {
  let result = false;
  const tk = token.replace("Bearer ", "");
  jwt.verify(tk, config.secret, (err, verified) => {
    if (err) return Promise.reject("token 验证失败");
    result = verified;
  });

  return Promise.resolve(result);
};

module.exports = {
  sign,
  verify,
  expiresIn: config.expiresIn,
};
