<template>
  <v-navigation-drawer
    app
    width="230"
    src="@/assets/imgs/sidebar-2.jpg"
  >
    <!-- 图像插槽 -->
    <template v-slot:img="props">
        <v-img :gradient="gradient" v-bind="props"/>
    </template>

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar
            class="align-self-center"
            color="white"
            contain
        >
          <v-img
              src="@/assets/imgs/icon.png"
              max-height="30"
              max-width="30"
          />
        </v-list-item-avatar>

        <h3><span class="colorful">Matrix</span> Admin</h3>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list dense nav>
      <template v-for="(item, i) in items">
        <v-list-group v-if="item.children" :key="`group-${i}`">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            v-for="(child, childI) in item.children"
            :key="`child-group-${childI}`"
            :to="child.to"
          >
            <v-list-item-icon>
              <v-icon v-text="child.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :to="item.to" :key="`item-${i}`" color="primary">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'NavBar',
  data: () => ({
    items: [{
        title: '首页',
        icon: 'mdi-home',
        to: '/dashboard',
      }, {
        title: '信息管理',
        icon: 'mdi-text-box-outline',
        children: [{
            title: '推广管理',
            to: '/advert'
          }, {
            title: '通知管理',
            to: '/notice'
          }]
      },{
        title: '商城管理',
        icon: 'mdi-storefront-outline',
        children: [
          {
            title: '商品审核',
            to: '/examine'
          },
          {
            title: '商品管理',
            to: '/goods'
          }, {
            title: '订单管理',
            to: '/order'
          },{
            title: '分类管理',
            to: '/category'
          }
        ],
      }, {
        title: '话题管理',
        icon: 'mdi-chat-processing-outline',
        children: [{
            title: "话题管理",
            to: "/topic"
          }, {
            title: "帖子管理",
            to: "/post"
          }
        ]
      }, {
        title: '用户管理',
        icon: 'mdi-account-multiple',
        children: [
          {
            title: "网站用户",
            to: "/user"
          }, {
            title: "后台管理员",
            to: "/admin"
          }
        ]
      }, {
        title: '权限管理',
        icon: 'mdi-key',
        children: [{
          title: "权限列表",
          to: "/permission"
        }, {
          title: "角色管理",
          to: "/role"
        }]
      },
      {
        title: "个人信息",
        icon: "mdi-account",
        children: [
          {
            title: "个人资料",
            to: "/profile"
          },
          {
            title: "修改密码",
            to: "/password"
          }
        ]
      },
    ],
  }),
  computed: {
    ...mapState("theme", ["dark"]),
    gradient () {
      return this.dark
          ? "to bottom, rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)"
          : "to bottom, rgba(255, 255, 255, .8), rgba(255, 255, 255, .8)";
    }
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
@import "../assets/style/mixins.scss";

.colorful {
  @include colorful;
}

.v-list-group::v-deep .v-list-group__header__append-icon .v-icon {
  font-size: 0.8125rem;
}

.v-navigation-drawer {
  box-shadow: 0 16px 38px -12px rgb(0 0 0 / 56%), 0 4px 25px 0 rgb(0 0 0 / 12%), 0 8px 10px -5px rgb(0 0 0 / 20%);
}

.v-list-group::v-deep .v-list-group__header.v-list-item--active {
  &.theme--light {
    color: rgba(0, 0, 0, 0.87);

    .v-icon {
      color: rgba(0, 0, 0, 0.54);
    }
  }

  &.theme--dark {
    color: #fff;
  }
}

.active {
  &.theme--light {
    color: #5C6BC0;

    .v-icon {
      color: rgba(0, 0, 0, 0.54);
    }
  }

  &.theme--dark {
    color: #3949AB;
  };
}
</style>
