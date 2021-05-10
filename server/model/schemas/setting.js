const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 网站设置文档
 */
const settingSchema = new Schema({
  name: String,
  domain: String,
  title: String,
  keywords: String,
  description: String,
  copyright: String,
  default: Boolean
});

module.exports = settingSchema;