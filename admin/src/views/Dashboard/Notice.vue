<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="card">
            <div class="card-header card-header-info card-header-primary">
              <!-- 搜索框 -->
              <v-container>
                <v-row justify="space-between">
                  <v-col cols="4">
                    <v-text-field
                        dense
                        label="搜索"
                        v-model="search"
                    >
                      <template v-slot:append-outer>
                        <v-btn fab small @click="getNoticeList">
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <!-- 添加按钮 -->
                  <v-col cols="1">
                    <v-btn @click="showAddDialog">添加</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="card-body">
              <v-data-table
                :headers="headers"
                :items="notices"
                item-key="name"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                :loading="loading"
                loading-text="加载中"
              >
                <template v-slot:item.createdAt="{ value }">
                  {{ value.slice(0, 10) }}
                </template>

                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>

                <template v-slot:item.operation="{ item }">
                  <v-btn small color="primary" @click="showEditDialog(item)">
                    <v-icon small class="mr-1">mdi-square-edit-outline</v-icon>
                    查看详情
                  </v-btn>
                  <v-btn small color="error" class="ml-1" @click="showDeleteDialog(item._id)">
                    <v-icon small class="mr-1">mdi-delete</v-icon>
                    删除
                  </v-btn>
                </template>
                <template v-slot:item.status="{ value }">
                  <v-chip color="success" small outlined v-if="value">已读</v-chip>
                  <v-chip color="red" small outlined v-else>未读</v-chip>
                </template>
              </v-data-table>
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
          发布通知
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation>
            <v-text-field
                v-model="addForm.userId"
                :rules="userRules"
                label="用户ID"
                type="text"
                required
            ></v-text-field>
            <v-text-field
                v-model="addForm.title"
                :rules="titleRules"
                label="通知标题"
                type="text"
                required
            ></v-text-field>
            <v-textarea
                v-model="addForm.content"
                :rules="contentRules"
                label="通知内容"
                auto-grow
                required
            ></v-textarea>
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
                v-model="editForm.userId"
                :rules="userRules"
                label="用户ID"
                type="text"
            ></v-text-field>
            <v-text-field
                v-model="editForm.title"
                :rules="titleRules"
                label="通知标题"
                type="text"
                required
            ></v-text-field>
            <v-textarea
                v-model="editForm.content"
                :rules="contentRules"
                label="通知内容"
                auto-grow
            ></v-textarea>
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
  name: "Notice",
  data: () => ({
    search: "",
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "标题", value: "title", sortable: false },
      { text: "用户ID", value: "userId", sortable: false },
      { text: "时间", value: "createdAt", sortable: true },
      { text: "状态", value: "status" },
      { text: "操作", value: "operation", sortable: false }
    ],
    notices: [],
    count: 0,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,
    
    // 添加对话框
    addDialog: false,
    addForm: {},
    // 删除对话框
    deleteDialog: false,
    deleteId: '',
    // 查看详情对话框
    editDialog: false,
    editForm: {},
    // 验证规则
    titleRules: [
      (v) => !!v || "通知标题不能为空",
    ],
    userRules: [
      (v) => !!v || "用户ID不能为空",
    ],
    contentRules: [
      (v) => !!v || "通知内容不能为空",
    ],
  }),
  methods: {
    async getNoticeList() {
      this.loading = true;
      const conditions = this.search ? {
        userId: this.search
      } : {}
      const result = await api.getNoticeList({
       conditions
      });
      this.notices = result.notices;
      this.count = result.count;

      this.loading = false;
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
        await this.$store.dispatch("notice/SEND_NOTICE", this.addForm)
        this.$toast("发送通知成功");
        await this.getNoticeList();
      } catch(e) {
        this.$toast("发送通知失败");
      }

      this.addForm = {};
      this.addDialog = false;
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
        await api.deleteNotice(this.deleteId);

        this.$toast("删除通知成功");
        await this.getNoticeList();
      } catch {
        this.$toast("删除通知失败");
      }

      this.deleteId = '';
      this.deleteDialog = false;
    },
    // 修改逻辑
    showEditDialog(notice) {
      this.editDialog = true
      this.editForm = notice
    },
    cancelEdit() {
      this.editDialog = false
      this.editForm = {}
    },
    async confirmEdit() {
      const valid = this.$refs.editFormRef.validate()
      if(!valid) return

      try {
        await api.updateNotice(this.editForm._id, this.editForm);
        this.$toast("修改通知信息成功")
      } catch(e) {
        this.$toast("修改通知信息失败");
      }

      this.$refs.editFormRef.reset();
      this.getNoticeList();
      this.editDialog = false;
    }
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "通知管理");
    await this.getNoticeList();
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>