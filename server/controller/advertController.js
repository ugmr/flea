const { advert } = require("../model/mongo");

const getAllAdvert = async (req, res) => {
  let { conditions, fields, options } = req.query;

  conditions = JSON.parse(conditions || "{}");
  fields = JSON.parse(fields || "{}");
  options = JSON.parse(options || "{}");

  Object.keys(conditions).forEach((key) => {
    const value = conditions[key];
    conditions[key] = { $regex: value, $options: "$i" };
  });

  const queryAll = await advert.find(conditions, fields, options);
  const num = await advert.count(conditions);

  res.status(200).json({
    adverts: queryAll,
    count: num,
  });
};

const updateAdvert = async (req, res) => {
  const id = req.params.id;
  const info = req.body;

  const result = await advert.updateOne({ _id: id }, info);

  res.status(203).json({
    advert: result,
  });
};

const addAdvert = async (req, res) => {
  const info = req.body;

  const result = await advert.create(info);

  res.status(201).json({
    advert: result,
  });
};

const deleteAdvert = async (req, res) => {
  const id = req.params.id;

  await advert.findOneAndRemove({ _id: id });

  res.status(204).send();
};

module.exports = {
  getAllAdvert,
  updateAdvert,
  addAdvert,
  deleteAdvert,
};
