const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new mongoose.Schema({
  userId: Schema.Types.ObjectId,
  default: {type: Boolean},
  province: String,
  city: String,
  district: String,
  address: String,
  name: String,
  mobile: String
});

module.exports = deliverySchema;