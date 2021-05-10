<template>
  <div class="role">
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
                          label="角色名"
                      ></v-text-field>
                    </v-col>
                    <v-btn fab small class="mt-6 ml-3" @click="getRoleList">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-row>
                  <v-col cols="1">
                    <v-btn @click="showAddDialog">添加</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 数据表格 -->
              <v-data-table
                  :headers="headers"
                  :items="roleList"
                  item-key="mobile"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :loading="loading"
                  hide-default-footer
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.permissions="{ value }">
                  <v-chip class="ml-1 mt-1" v-for="(item, i) in value.slice(0, 3)" :key="i">
                    {{ item.name }}
                  </v-chip>
                  <span v-if="value.length > 3">  ...</span>
                </template>
                <template v-slot:item.isAdmin="{ value }">
                  <v-chip color="success" outlined v-if="value">是</v-chip>
                  <v-chip color="red" outlined v-else>否</v-chip>
                </template>
                 <template v-slot:item.default="{ value }">
                  <v-chip color="success" outlined v-if="value">是</v-chip>
                  <v-chip color="red" outlined v-else>否</v-chip>
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
     <!-- 添加对话框 -->
    <v-dialog
      v-model="addDialog"
      width="600px"
      @click:outside="cancelAdd"
    >
      <v-card>
        <v-card-title class="headline">
          添加角色
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation>
            <v-text-field
              v-model="addForm.name"
              :rules="nameRules"
              label="角色名称"
              type="text"
              required
            >
            </v-text-field>
            <v-select
              v-show="addForm.isAdmin"
              v-model="addForm.permissions"
              :items="permissions"
              label="角色权限"
              :menu-props="{ top: true, offsetY: true }"
              chips
              multiple
            >
            </v-select>
            <v-textarea
              v-model="addForm.desc"
              :rules="nameRules"
              label="角色描述"
              auto-grow
              required
            >
            </v-textarea>
            <v-switch
              label="是否是管理员"
              v-model="addForm.isAdmin"
            >
            </v-switch>
            <v-switch
              label="默认角色"
              v-model="addForm.default"
            >
            </v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="cancelAdd"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmAdd"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
     <!-- 修改对话框 -->
    <v-dialog
      v-model="editDialog"
      width="600px"
      @click:outside="cancelEdit"
    >
      <v-card>
        <v-card-title class="headline">
          修改通知
        </v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" lazy-validation>
           <v-text-field
              v-model="editForm.name"
              :rules="nameRules"
              label="角色名称"
              type="text"
              required
            >
            </v-text-field>
            <v-select
              v-model="editForm.permissions"
              :items="permissions"
              label="角色权限"
              :menu-props="{ top: true, offsetY: true }"
              chips
              multiple
            >
            </v-select>
            <v-textarea
              v-model="editForm.desc"
              :rules="nameRules"
              label="角色描述"
              auto-grow
              required
            >
            </v-textarea>
            <v-switch
              label="是否是管理员"
              v-model="editForm.isAdmin"
            >
            </v-switch>
            <v-switch
              label="默认角色"
              v-model="editForm.default"
            >
            </v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
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
              color="green darken-1"
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
  </div>
</template>

<script>
import * as api from "@/api";

export default {
  name: "Role",
  data: () => ({
    search: "",
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "角色", value: "name", sortable: false },
      { text: "描述", value: "desc", sortable: false },
      { text: "管理员", value: "isAdmin", sortable: false },
      { text: "权限", value: "permissions", sortable: false },
      { text: "默认角色", value: "default", sortable: false },
      { text: "操作", value: "operation", sortable: false }
    ],
    roleList: [],
    count: 0,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,

    permissions: [],

    // 添加
    addForm: {},
    addDialog: false,
    // 修改
    editForm: {},
    editDialog: false,
    // 删除
    deleteDialog: false,
    deleteId: "",
    nameRules: [
      (v) => !!v || "角色名称不能为空",
    ],
  }),
  computed: {
  },
  methods: {
    async getRoleList() {
      this.loading = true;
      const result = await api.getRoleList({
        conditions: {
          name: this.search,
        },
      });
      this.roleList = result.roles;
      this.count = result.count;
     
      this.loading = false;
    },
    async getPermissionList() {
      const result = await api.getPermissionList()
      this.permissions = result.permissions.map(p => ({
        text: p.name,
        value: p._id,
      }))
    },
     // 添加逻辑
    showAddDialog() {
      this.addDialog = true;
    },
    cancelAdd() {
      this.$refs.addFormRef.reset();
      this.addForm = {};
      this.addDialog = false;
    },
    async confirmAdd() {
      const valid = this.$refs.addFormRef.validate();
      if(!valid) return;

      try {
        await api.addRole(this.addForm);
        this.$toast("添加角色成功");
        await this.getRoleList();
      } catch(e) {
        this.$toast("添加角色失败");
      }

      this.addForm = {};
      this.addDialog = false;
    },
    // 修改逻辑
    showEditDialog(role) {
      this.editDialog = true
      this.editForm = Object.assign({}, role);
      this.editForm.permissions = this.editForm.permissions.map(p => p._id)
    },
    cancelEdit() {
      this.editDialog = false
      this.editForm = {}
    },
    async confirmEdit() {
      const valid = this.$refs.editFormRef.validate()
      if(!valid) return

      try {
        await api.updateRole(this.editForm._id, this.editForm);
        this.$toast("修改角色信息成功")
      } catch(e) {
        this.$toast("修改角色信息失败");
      }

      this.$refs.editFormRef.reset();
      this.getRoleList();
      this.editDialog = false;
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
        await api.deleteRole(this.deleteId);
        this.$toast("删除通知成功");
        await this.getRoleList();
      } catch {
        this.$toast("删除通知失败");
      }

      this.deleteId = '';
      this.deleteDialog = false;
    },
  },
  async mounted() {
    await this.getRoleList();
    await this.getPermissionList();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>