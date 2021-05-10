const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderEvaluationSchema = new Schema({
  orderId: Schema.Types.ObjectId,
  seller: {
    id: Schema.Types.ObjectId,
    score: Number,
    content: String,
  },
  buyer: {
    id: Schema.Types.ObjectId,
    score: Number,
    content: String,
  }
});

module.exports = orderEvaluationSchema;