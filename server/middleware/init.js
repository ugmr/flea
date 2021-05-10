const permissions = require("../config/permissions.json");
const {
  permission,
  role,
  user,
  setting,
  advert,
  category,
} = require("../model/mongo");
const logger = require("../libs/log4j")("init");

let defaultRole = {
  name: "超级管理员",
  isAdmin: true,
  default: true,
};

const defaultUser = {
  userName: "超级管理员",
  mobile: "15297372277",
  password: "aaa123",
};

const defaultSetting = {
  name: "",
  domain: "",
  title: "",
  keywords: "",
  description: "",
  copyright: "",
  default: true,
};

/**
 * 初始化权限
 */
const initPermission = async () => {
  const exist = await permission.count({});
  if (exist <= 0) {
    for (const p of permissions) {
      await permission.create({
        name: p.name,
        description: p.description,
        path: p.path,
      });
    }
  }
};
/**
 * 初始化角色
 */
const initRole = async () => {
  const exist = await role.findOne({ name: defaultRole.name });
  if (!exist) {
    const pList = await permission.find();
    (defaultRole.permissions = pList.map((p) => p._id)),
      await role.create(defaultRole);
  }
};

/**
 * 初始化用户
 */
const initUser = async () => {
  const exist = await user.findOne({ userName: defaultUser.userName });
  if (!exist) {
    const roleInfo = await role.findOne({ name: defaultRole.name });
    defaultUser.role = roleInfo._id;
    await user.create(defaultUser);
  }
};

/**
 * 初始化推广
 */
const initAdvert = async () => {
  const advertList = [
    "https://img2.baidu.com/it/u=2134933196,1946020824&fm=26&fmt=auto&gp=0.jpg",
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.588ku.com%2Fback_pic%2F05%2F53%2F41%2F485afb84554a69d.jpg&refer=http%3A%2F%2Fbpic.588ku.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621665187&t=8278ec4e56ac2406ef33039daa0ca147",
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01a8635b3082dea80120b95918ebe4.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621665187&t=778684747c15cf25c3ba985ba47cd33b",
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01f4395544122c0000019ae9f5449a.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1621665187&t=6c344662c6591e207faa5bbd0e5827c4",
  ];

  const num = await advert.count({});
  if (num <= 0) {
    for (ad of advertList) {
      await advert.create({
        name: "123123",
        img: ad,
        src: "111",
        isUsed: true,
      });
    }
  }
};

/**
 * 初始化分类
 */
const initCategory = async () => {
  const categoryList = [
    {
      name: "电子产品",
      children: [
        {
          name: "笔记本电脑",
          cover:
            "https://gw.alicdn.com/tfs/TB1OIxTcLc3T1VjSZLeXXbZsVXa-183-144.png?getAvatar=1",
        },
        {
          name: "硬盘",
          cover:
            "https://gw.alicdn.com/tfs/TB1LvIxVAvoK1RjSZFDXXXY3pXa-183-144.png?getAvatar=1",
        },
        {
          name: "内存条",
          cover:
            "https://gw.alicdn.com/tfs/TB11tFkr7L0gK0jSZFxXXXWHVXa-183-144.png?getAvatar=1",
        },
        {
          name: "键盘",
          cover:
            "https://gw.alicdn.com/tfs/TB1nBktVxTpK1RjSZR0XXbEwXXa-183-144.png?getAvatar=1",
        },
      ],
    },
    {
      name: "服装",
      children: [
        {
          name: "衬衫",
          cover:
            "https://gw.alicdn.com/tfs/TB1llI3f4n1gK0jSZKPXXXvUXXa-183-144.png?getAvatar=1",
        },
        {
          name: "牛仔裤",
          cover:
            "https://gw.alicdn.com/tfs/TB1O_AyVwHqK1RjSZFPXXcwapXa-183-144.png?getAvatar=1",
        },
        {
          name: "运动鞋",
          cover:
            "https://gw.alicdn.com/tfs/TB19yZJVBLoK1RjSZFuXXXn0XXa-183-144.png?getAvatar=1",
        },
        {
          name: "篮球鞋",
          cover:
            "https://gw.alicdn.com/tfs/TB19yZJVBLoK1RjSZFuXXXn0XXa-183-144.png?getAvatar=1",
        },
      ],
    },
  ];

  const num = await category.count({});
  if (num <= 0) {
    for (ct of categoryList) {
      const result = await category.create({ name: ct.name });

      ct.children.forEach(async (child) => {
        await category.create({
          parentId: result._id,
          name: child.name,
          cover: child.cover,
          show: true,
        });
      });
    }
  }
};

/**
 * 初始化网站设置
 */
const initSetting = async () => {
  const exist = await setting.findOne({ default: true });
  if (!exist) {
    await setting.create(defaultSetting);
  }
};

module.exports = async () => {
  logger.info("初始化数据开始...");
  await initPermission();
  await initRole();
  await initUser();
  await initAdvert();
  await initCategory();
  await initSetting();
  logger.info("初始化数据完成！");
};
