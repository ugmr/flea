exports.jwt = {
  secret: "agumr",
  expiresIn: "1d",
};

exports.userWhiteList = [
  "/reset",
  "/sms",
  "/check_sms",
  "/check_username",
  "/check_mobile",
  "/signin",
  "/login",
  "/user",
  "/user/:id",
  "/user/:id/focus",
  "/user/:id/follow",
  "/user/:id/evaluation",
  "/advert",
  "/category",
  "/goods",
  "/goods/:id",
  "/goods/:id/comment",
  "/topic",
  "/topic/:id",
  "/post",
  "/post/:id",
  "/post/:id/comment",
];

exports.adminWhiteList = [
  "/login",
  "/logout",
  "/profile",
  "/dashboard",
  "/check_permission",
];
