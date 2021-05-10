const { role, permission, user } = require("../model/mongo");

const getRoleList = async (req, res) => {
  //参数解析
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  Object.keys(conditions).forEach((key) => {
    conditions[key] = { $regex: conditions[key], $options: "$i" };
  });
  // 查询
  let roles = await role.find(conditions, fields, options);

  roles = await Promise.all(
    roles.map(async (r) => {
      const permissions = [];
      for (const pId of r.permissions) {
        const pInfo = await permission.findOne({ _id: pId });
        permissions.push(pInfo);
      }

      let obj = Object.assign({}, r["_doc"]);

      obj.permissions = permissions;

      return obj;
    })
  );

  const count = await role.count(conditions);

  // 返回结果
  res.status(200).json({ roles, count });
};

const addRole = async (req, res) => {
  const roleInfo = req.body;

  if (roleInfo.default) {
    await role.updateOne({ default: true }, { default: false });
  }
  const result = await role.create(roleInfo);

  res.status(200).json({
    role: result,
  });
};

const updateRole = async (req, res) => {
  const id = req.params.id;
  const roleInfo = req.body;

  if (roleInfo.default) {
    await role.updateOne({ default: true }, { default: false });
  }

  const result = await role.updateOne({ _id: id }, roleInfo);

  res.status(203).json({
    role: result,
  });
};

const deleteRole = async (req, res) => {
  const id = req.params.id;

  await role.findOneAndDelete({ _id: id });

  const defaultRoleId = await role.findOne({ default: true });
  await user.updateMany({ role: id }, { role: defaultRoleId });

  res.status(204).send();
};

module.exports = {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
};
