const fixTime = (time) => {
  const date = new Date(time);

  // 当前时间 = 包含时差的当前时间 + 时差时间，getTimezoneOffset() 获取时差（以分钟为单位），转为小时需要除以 60
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);

  return date;
};

const today = (offset = 0) => {
  const now = fixTime(new Date(new Date().toLocaleDateString()));

  now.setDate(now.getDate() + offset);

  return now;
};

module.exports = {
  today,
};
