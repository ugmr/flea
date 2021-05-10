const { CError, ERROR } = require("../libs/error");
const { notice } = require("../model/mongo");

const getNoticeList = async (req, res) => {
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  Object.keys(conditions).forEach((key) => {
    const value = conditions[key];
    if (key === "userId") return;
    conditions[key] = { $regex: value, $options: "$i" };
  });

  try {
    const notices = await notice.find(conditions, fields, options);
    const count = await notice.count(conditions);
    res.status(200).json({
      notices,
      count,
    });
  } catch (e) {
    if (e && e.kind === "ObjectId") {
      res.status(200).json({ notices: [], count: 0 });
    } else {
      throw new CError(ERROR.SERVER_ERROR, e);
    }
  }
};

const getNotice = async (req, res) => {
  const { id } = req.params;

  const result = await notice.findOne({ _id: id });

  res.status(200).json({
    data: {
      item: result,
    },
  });
};

const deleteNotice = async (req, res) => {
  const id = req.params.id;

  await notice.findOneAndRemove({ _id: id });

  res.status(204).send();
};

const updateNotice = async (req, res) => {
  const id = req.params.id;
  const newInfo = req.body;

  const result = await notice.updateOne({ _id: id }, newInfo);

  res.status(203).json({
    notice: result,
  });
};

module.exports = {
  getNoticeList,
  getNotice,
  deleteNotice,
  updateNotice,
};
