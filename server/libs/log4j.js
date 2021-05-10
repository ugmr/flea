const config = require('../config/log4j');
const log4j = require('log4js');

log4j.configure(config);

module.exports = log4j.getLogger;