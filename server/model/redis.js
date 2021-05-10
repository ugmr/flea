const redis = require("redis");
const config = require("../config/db").redis;
const { promisify } = require("util");
const logger = require("../libs/log4j")("redis");
const { order, goods } = require("./mongo");

// 连接redis
const client = redis.createClient(config.port, config.host);
client.on("connect", () => logger.info("redis连接成功..."));
client.on("error", (err) => {
  logger.error("redis error：" + err);
  process.exit(1);
});

// 过期事件监听
client.send_command(
  "config",
  ["set", "notify-keyspace-events", "Ex"],
  SubscribeExpired
);
function SubscribeExpired(e, r) {
  const sub = redis.createClient(config.port, config.host, {
    db: types.ORDER,
  });
  const expired_subKey = `__keyevent@${types.ORDER}__:expired`;
  sub.subscribe(expired_subKey, function () {
    sub.on("message", function (chan, msg) {
      //msg就是过期的key值，由于过期了，所有回调时只有key值
      //相应的处理代码
      _cancelOrder(msg);
    });
  });
}
async function _cancelOrder(orderId) {
  console.log(orderId);
  const orderInfo = await order.findOne({ no: orderId });

  if (orderInfo.status == 1) {
    // 更新订单状态
    const result = await order.update(
      { no: orderId },
      {
        status: 0,
      }
    );

    console.log(result);
    // 更新商品库存
    await goods.update(result.goodsId, { num: 1 });
  }
}

// 使用promise
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);
const selectAsync = promisify(client.select).bind(client);
/**
 * 设置redis值
 * @param dbNum 库号
 * @param key 键
 * @param value 值
 * @param expire 过期时间（单位：秒，可为空，为空则不过期）
 */
const set = async (dbNum, key, value, expire) => {
  await selectAsync(dbNum);
  await setAsync(key, value);
  await expireAsync(key, expire);
};
/**
 * 获取redis值
 * @param dbNum 库号
 * @param key 键
 */
const get = async (dbNum, key) => {
  await selectAsync(dbNum);
  const result = await getAsync(key);
  return result;
};
/**
 * 删除 键
 * @param dbNum 库号
 * @param key 键
 */
const del = async (dbNum, key) => {
  await selectAsync(dbNum);
  await delAsync(key);
};

// redis库
const types = {
  CAPTCHA: 0,
  TOKEN: 1,
  POST: 2,
  ORDER: 3,
  SOCKET: 4,
  SEARCH: 5,
  POST: 6,
};


module.exports = {
  types,
  get,
  set,
  del,
  origin: client,
};
