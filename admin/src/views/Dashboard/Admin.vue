<template>
  <div class="admin">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
               <v-container>
                <v-row justify="space-between">
                  <v-row>
                    <!-- 搜索框 -->
                    <v-col cols="4">
                      <v-text-field
                          v-model="search"
                          label="搜索"
                      ></v-text-field>
                    </v-col>
                    <v-btn fab small class="mt-6 ml-3" @click="getUserList">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-row>
                </v-row>
              </v-container>
            </div>
            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 数据表格 -->
              <v-data-table
                :headers="headers"
                :items="userList"
                item-key="mobile"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                :loading="loading"
                loading-text="加载中"
                hide-default-footer
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.profilePhoto="{ value }">
                  <v-img width="40" height="40" :src="value" v-if="value !== ''"></v-img> 
                  <div v-else>暂无</div>
                </template>
                <template v-slot:item.gender="{ value }">
                  {{ value == "male" ? "男" : "女" }}
                </template>
                <template v-slot:item.credit="{ value }">
                  <v-chip outlined :color="creditChipColor(value)">
                    {{ value }}
                  </v-chip>
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="primary" @click="showEditDialog(item)">
                    <v-icon small class="mr-1">mdi-square-edit-outline</v-icon>
                    编辑
                  </v-btn>
                  <v-btn small color="error" class="ml-1" @click="showDeleteDialog(item._id)">
                    <v-icon small class="mr-1">mdi-delete</v-icon>
                    删除
                  </v-btn>
                </template>
              </v-data-table>
              <!-- 分页 -->
              <div class="text-center pt-2">
                <v-pagination
                    v-model="page"
                    :length="pageCount"
                    prev-icon="mdi-chevron-left"
                    next-icon="mdi-chevron-right"
                ></v-pagination>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
     <!-- 删除对话框 -->
    <v-dialog
        v-model="deleteDialog"
        width="400px"
    >
      <v-card>
        <v-card-title class="headline">
          提示
        </v-card-title>
        <v-card-text>
          确定删除吗？
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="darken-1"
              text
              @click="cancelDelete"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmDelete"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 编辑对话框 -->
    <v-dialog
        v-model="editDialog"
        width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          修改用户信息
        </v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" lazy-validation class="text-center">
            <v-text-field
              v-model="editForm.mobile"
              label="手机号码"
              type="text"
              required
              disabled
            >
            </v-text-field>
            <v-text-field
                v-model="editForm.userName"
                label="用户名"
                type="text"
                required
            ></v-text-field>
            <v-select
                v-model="editForm.role"
                :items="roleList"
                label="用户角色"
            ></v-select>
            <v-select
              v-model="editForm.gender"
              :items="genderItems"
              label="性别"
            >
            </v-select>
            <v-textarea
              v-model="editForm.intro"
              label="用户简介"
              auto-grow
            >
            </v-textarea>
            <v-text-field
                v-model="editForm.credit"
                label="信誉分"
                max="100"
                min="0"
                type="number"
                required
            ></v-text-field>
            <v-text-field
                v-model="editForm.address"
                label="常驻地址"
                type="text"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="darken-1"
              text
              @click="cancelEdit"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmEdit"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as api from "@/api";
// import axios from "axios";

export default {
  name: "Admin",
  data: () => ({
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "头像", value: "profilePhoto", sortable: false},
      { text: "昵称", value: "userName", sortable: false},
      { text: "手机号码", value: "mobile", sortable: false},
      { text: "性别", value: "gender", sortable: false },
      { text: "角色", value: "role.name", sortable: true},
      { text: "操作", value: "operation", sortable: false}
    ],
    userList: [],
    roleList: [],
    count: 0,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,
    search: "",
    genderItems: [
      {text: "男", value: "male"},
      {text: "女", value: "female"}
    ],
    deleteId: "",
    deleteDialog: false,

    editDialog: false,
    editForm: {},
    editImageUrl: '',
  }),
  methods: {
    async getUserList() {
      this.loading = true;
      const result = await api.getUserList({
        conditions: {
          userName: this.search
        },
        isAdmin: true
      });

      console.log(result)

      this.userList = result.users;
      this.count = result.count;

      this.loading = false;
    },
    async getRoleList() {
      const result = await api.getRoleList();
      this.roleList = result.roles.map(r => ({
        text: r.name,
        value: r._id
      }));
    },
    // 删除逻辑
    showDeleteDialog(id) {
      this.deleteId = id;
      this.deleteDialog = true;
    },
    cancelDelete() {
      this.deleteId = '';
      this.deleteDialog = false;
    },
    async confirmDelete() {
      try {
        await api.deleteUser(this.deleteId);
        this.$toast("删除用户成功");
      } catch {
        this.$toast("删除用户失败");
      }

      await this.getUserList();
      this.deleteId = '';
      this.deleteDialog = false;
    },
   

    // 修改逻辑
    async showEditDialog(data) {
      Object.keys(data).forEach(key => {
        if(key == "role") {
          this.editForm[key] = data[key]._id
          return 
        }
        this.editForm[key] = data[key]
      })
      console.log(this.editForm)

      await this.getRoleList();
      this.editDialog = true;
    },
    cancelEdit() {
      this.editForm = {};
      this.editImageUrl = '';
      this.editDialog = false;
    },
    async confirmEdit() {
      // base64 数据 -> 已修改
      try {
        await api.updateUser(this.editForm._id, this.editForm);
        this.$toast("修改用户成功");
      } catch {
        this.$toast("修改用户失败");
      }
      this.getUserList()
      this.editForm = {};
      this.editImageUrl = '';
      this.editDialog = false;
    }
  },
  async mounted() {
    this.getUserList();
    this.getRoleList();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>