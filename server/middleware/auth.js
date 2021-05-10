const jwt = require("../libs/token");
const { role, permission } = require("../model/mongo");
const { CError, ERROR } = require("../libs/error");
const { userWhiteList, adminWhiteList } = require("../config/auth");
const logger = require("../libs/log4j")("auth");

const Types = {
  COMMON: "/api/common/v1",
  USER: "/api/user/v1",
  ADMIN: "/api/admin/v1",
  NOT_FOUND: "",
};
/**
 * 解析url
 * @param {String} url
 * @returns {Types} type
 * @returns {String} path
 */
function parseUrl(url) {
  let type;
  for (const value of Object.values(Types)) {
    if (url.startsWith(value)) {
      type = value;
      break;
    }
  }

  const path = url.substring(type.length).split("?")[0];

  return { type, path };
}

/**
 * 验证权限
 * @param {String} method 方法
 * @param {String} path 路径
 * @param {String} roleId 角色ID
 * @returns {Boolean}
 */
async function checkPermission(path, roleId) {
  const roleInfo = await role.findOne({ _id: roleId });
  if (!roleInfo.isAdmin) return false;
  const permissions = roleInfo.permissions;

  for (const pId of permissions) {
    const pInfo = await permission.findOne({ _id: pId });
    if (!pInfo) throw new CError(ERROR.SERVER_ERROR, "权限不存在");
    if (path.startsWith(pInfo.path)) return true;
  }
  return false;
}

/**
 * 权限验证中间件
 */
const auth = () => {
  return async (req, res, next) => {
    // 解析url 和 token
    const { type, path } = parseUrl(req.url);
    try {
      const token = req.get("Authorization");
      req.token = await jwt.verify(token);
    } catch (e) {
      req.token = null;
    }

    if (type === Types.ADMIN) {
      const inWhiteList = adminWhiteList.some((prefix) =>
        path.startsWith(prefix)
      );
      if (inWhiteList) return next();
      if (!req.token)
        return next(new CError(ERROR.LOGIN_REQUIRED, "登录后再来访问吧"));
      // 验证权限
      const hasPermission = await checkPermission(path, req.token.role);
      if (!hasPermission) {
        return next(new CError(ERROR.PERMISSION_DENIED, "权限不足"));
      }
    } else if (type === Types.COMMON || type === Types.USER) {
      const inWhiteList = userWhiteList.includes(path);
      if (!req.token && !inWhiteList)
        return next(new CError(ERROR.LOGIN_REQUIRED, "登录后再来访问吧"));
    }
    next();
  };
};

module.exports = auth;
