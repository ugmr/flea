const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offlineSchema = new Schema({
    from: Schema.Types.ObjectId,
    to: Schema.Types.ObjectId,
    avatar: String,
    name: String,
    message: String,
    createdAt: {type: Schema.Types.Date, default: new Date()}
});

module.exports = offlineSchema;