import Vue from "vue";
import VueRouter from "vue-router";
import store from "./store";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  routes: [
    // 登陆
    {
      path: "/sign",
      component: () =>
        import(/* webpackChunkName: "sign" */ "./views/Login/Index"),
      children: [
        {
          path: "login",
          name: "Login",
          component: () =>
            import(/* webpackChunkName: "login" */ "./views/Login/Login"),
        },
        {
          path: "reset",
          name: "Forget",
          component: () =>
            import(/* webpackChunkName: "reset" */ "./views/Login/Forget"),
        },
      ],
    },
    // 管理页面
    {
      path: "/",
      component: () =>
        import(/* webpackChunkName: "home" */ "./views/Dashboard/Index"),
      children: [
        // 跳转
        {
          path: "",
          redirect: () => {
            if (store.state.log.isLogin) return { name: "Dashboard" };
            else return { name: "Login" };
          },
        },
        // 首页
        {
          path: "dashboard",
          name: "Dashboard",
          meta: {
            requireAuth: true, //需要登陆验证
            title: "首页",
          },
          component: () =>
            import(
              /* webpackChunkName: "dashboard" */ "./views/Dashboard/Dashboard"
            ),
        },

        // 推广管理
        {
          path: "advert",
          name: "Advert",
          meta: {
            requireAuth: true,
            title: "推广管理",
          },
          component: () =>
            import(/* webpackChunkName: "advert" */ "./views/Dashboard/Advert"),
        },
        {
          name: "Admin",
          path: "admin",
          meta: {
            requireAuth: true,
            title: "管理员管理",
          },
          component: () =>
            import(/* webpackChunkName: "admin" */ "./views/Dashboard/Admin"),
        },
        {
          name: "User",
          path: "user",
          meta: {
            requireAuth: true,
            title: "用户管理",
          },
          component: () =>
            import(/* webpackChunkName: "user" */ "./views/Dashboard/User"),
        },
        {
          name: "Role",
          path: "role",
          meta: {
            requireAuth: true,
            title: "角色管理",
          },
          component: () =>
            import(/* webpackChunkName: "role" */ "./views/Dashboard/Role"),
        },
        {
          name: "Permission",
          path: "permission",
          meta: {
            requireAuth: true,
            title: "权限管理",
          },
          component: () =>
            import(
              /* webpackChunkName: "permission" */ "./views/Dashboard/Permission"
            ),
        },
        {
          name: "Post",
          path: "post",
          meta: {
            requireAuth: true,
            title: "贴子管理",
          },
          component: () =>
            import(/* webpackChunkName: "post" */ "./views/Dashboard/Post"),
        },
        {
          name: "Topic",
          path: "topic",
          meta: {
            requireAuth: true,
            title: "话题管理",
          },
          component: () =>
            import(/* webpackChunkName: "topic" */ "./views/Dashboard/Topic"),
        },
        {
          name: "Notice",
          path: "notice",
          meta: {
            requireAuth: true,
            title: "通知管理",
          },
          component: () =>
            import(/* webpackChunkName: "notice" */ "./views/Dashboard/Notice"),
        },
        {
          name: "Examine",
          path: "examine",
          meta: {
            requireAuth: true,
            authPath: "/goods",
            title: "商品审核",
          },
          component: () =>
            import(
              /* webpackChunkName: "examine" */ "./views/Dashboard/Examine"
            ),
        },
        {
          name: "Goods",
          path: "goods",
          meta: {
            requireAuth: true,
            title: "商品管理",
          },
          component: () =>
            import(/* webpackChunkName: "goods" */ "./views/Dashboard/Goods"),
        },
        {
          name: "Category",
          path: "category",
          meta: {
            requireAuth: true,
            title: "分类管理",
          },
          component: () =>
            import(
              /* webpackChunkName: "category" */ "./views/Dashboard/Category"
            ),
        },
        {
          name: "Profile",
          path: "profile",
          meta: {
            requireAuth: true,
            title: "个人信息",
          },
          component: () =>
            import(
              /* webpackChunkName: "profile" */ "./views/Dashboard/Profile"
            ),
        },
        {
          name: "Order",
          path: "order",
          meta: {
            requireAuth: true,
            title: "订单管理",
          },
          component: () =>
            import(/* webpackChunkName: "order" */ "./views/Dashboard/Order"),
        },
        {
          name: "Password",
          path: "password",
          meta: {
            requireAuth: true,
            authPath: "/profile",
            title: "修改密码",
          },
          component: () =>
            import(
              /* webpackChunkName: "password" */ "./views/Dashboard/Password"
            ),
        },
      ],
    },
  ],
});

// 登陆拦截
router.beforeEach((to, from, next) => {
  store.commit("overlay/SHOW_OVERLAY");
  if (to.meta.title) {
    store.commit("CHANGE_TITLE", to.meta.title);
  }
  if (
    !to.meta.requireAuth ||
    (to.meta.requireAuth && store.state.log.isLogin)
  ) {
    next();
  } else {
    next({
      name: "Login",
      query: { redirect: to.name },
    });
  }
});

router.afterEach(() => {
  store.commit("overlay/HIDE_OVERLAY");
});

export default router;
