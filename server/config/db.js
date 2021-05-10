const mongodb = {
  host: '127.0.0.1',
  port: 27017,
  username: 'appAdmin',
  password: '109451',
  database: 'flea_data',
};
mongodb.url = `mongodb://${mongodb.username}:${mongodb.password}@` +
    `${mongodb.host}:${mongodb.port}/${mongodb.database}`

exports.mongodb = mongodb;

exports.redis = {
  host: '127.0.0.1',
  port: '6379'
};