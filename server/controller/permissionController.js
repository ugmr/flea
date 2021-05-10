const { permission, role } = require("../model/mongo");
const { adminWhiteList } = require("../config/auth");
const getPermission = async (req, res) => {
  let { conditions, fields, options } = req.query;
  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  Object.keys(conditions).forEach((key) => {
    const value = conditions[key];
    conditions[key] = { $regex: value, $options: "$i" };
  });

  // 查询一级权限
  conditions.parentId = null;
  // 查询
  const permissions = await permission.find(conditions, fields, options);

  let result = await Promise.all(
    permissions.map(async (p) => {
      const children = await permission.find({ parentId: p._id });

      let obj = Object.assign({}, p["_doc"]);
      obj.children = children;

      return obj;
    })
  );

  res.status(200).json({
    count: result.length,
    permissions: result,
  });
};

const checkPermission = async (req, res) => {
  const { path } = req.body;
  const { role: roleId } = req.token;

  let access = false;
  const inWhiteList = adminWhiteList.some((prefix) => path.startsWith(prefix));
  if (inWhiteList) {
    access = true;
  } else {
    const roleInfo = await role.findOne({ _id: roleId });
    if (roleInfo.isAdmin) {
      for (const pId of roleInfo.permissions) {
        const pInfo = await permission.findOne({ _id: pId });

        if (pInfo && pInfo.path === path) {
          access = true;
        }
      }
    }
  }

  res.status(200).json({ access });
};

module.exports = {
  getPermission,
  checkPermission,
};
