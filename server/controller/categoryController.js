const { CError, ERROR } = require("../libs/error");
const { category } = require("../model/mongo");

// 查询全部分类
const getAllCategory = async (req, res) => {
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  let result = null;

  // 查询首页的分类
  if (conditions.show) {
    result = (await category.find(conditions, fields, options)).map((item) => {
      return {
        id: item._id,
        name: item.name,
        parentId: item.parentId,
        show: item.show,
        cover: item.cover,
        createdAt: item.createdAt,
      };
    });
  } else {
    // 查询一级分类
    const queryAll = await category.find({
      parentId: null,
    });

    // 查询二级分类
    result = await Promise.all(
      queryAll.map(async (item) => {
        const children = (await category.find({ parentId: item._id })).map(
          (child) => {
            return {
              id: child._id,
              name: child.name,
              parentId: child.parentId,
              cover: child.cover,
              show: child.show,
              createdAt: child.createdAt,
            };
          }
        );

        return {
          id: item._id,
          name: item.name,
          parentId: item.parentId,
          show: item.show,
          cover: item.cover,
          createdAt: item.createdAt,
          children,
        };
      })
    );
  }

  res.status(200).json({ category: result });
};

// 添加新分类
const addCategory = async (req, res) => {
  const info = req.body;

  if (info.parentId) {
    const exist = await category.findOne({ _id: info.parentId });
    if (!exist) throw new CError(ERROR.DATA_INVALID, "一级分类不存在");
  }

  const result = await category.create(info);

  res.status(201).json({
    category: result,
  });
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const categoryInfo = req.body;

  const result = await category.updateOne({ _id: id }, categoryInfo);

  res.status(203).json({
    category: result,
  });
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;

  await category.findOneAndDelete({ _id: id });

  res.status(204).send();
};

module.exports = {
  getAllCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
