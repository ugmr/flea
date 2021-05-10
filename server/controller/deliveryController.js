const { delivery } = require("../model/mongo");

const getDeliveryList = async (req, res) => {
  const { userId } = req.query;

  const deliverys = await delivery.find({ userId });

  res.status(200).json({
    list: deliverys,
    count: deliverys.length,
  });
};

const addDelivery = async (req, res) => {
  const deliveryInfo = req.body;

  const result = await delivery.create(deliveryInfo);

  res.status(201).json({
    delivery: result,
  });
};

const updateDelivery = async (req, res) => {
  const id = req.params.id;
  const deliveryInfo = req.body;

  const result = await delivery.updateOne({ _id: id }, deliveryInfo);

  res.status(203).json({
    delivery: result,
  });
};

const deleteDelivery = async (req, res) => {
  const id = req.params.id;

  await delivery.findOneAndDelete({ _id: id });

  res.status(204).send();
};

module.exports = {
  getDeliveryList,
  addDelivery,
  updateDelivery,
  deleteDelivery,
};
