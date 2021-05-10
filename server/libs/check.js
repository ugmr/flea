/*
    * 移动号码包括的号段：134/135/136/137,138,139；
    *                     147/148(物联卡号)；
    *                     150/151/152/157/158/159；
    *                     165（虚拟运营商）；
    *                     1703/1705/1706（虚拟运营商）、178；
    *                     182/183/184/187/188
    *                     198

    * 联通号段包括：130/131
    *               145
    *               155/156
    *               166/167(虚拟运营商)
    *               1704/1707/1708/1709、171
    *               186/186
    *
    * 电信号段包括： 133
    *                153
    *                162(虚拟运营商)
    *                1700/1701/1702(虚拟运营商)
    *                180/181/189
    *                191/199
    * */
const mpattern = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
const ppattern = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
// 手机号验证
exports.checkMobile = function (mobile) {
  return mpattern.test(mobile);
}
// 密码验证
exports.checkPassword = function (password) {
  return ppattern.test(password);
}
// 用户名验证
exports.checkUserName = function (userName) {
  console.log(userName.length);
  return userName.length > 0 && userName.length <= 20;
}
//
exports.checkClientId = function (clientId) {
  return clientId !== null && typeof clientId === "string"
}

exports.checkCode = function(code) {
  return typeof code === 'string' && code.length === 6;
}