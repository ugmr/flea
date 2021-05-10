<template>
  <div class="notice">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
              <v-container>
                <v-row>
                  <!-- 搜索框 -->
                  <v-col cols="4">
                    <v-text-field
                        v-model="search.title"
                        label="标题"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-btn fab small class="mt-3" @click="getList">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-col>
                  <v-spacer></v-spacer>
                  <!-- 添加按钮 -->
                  <v-col cols="1" align-self="center">
                    <v-btn @click="showAddDialog">添加</v-btn>
                  </v-col>
                  <!-- 批量操作 -->
                  <v-col cols="2" v-if="!isSelect" align-self="center">
                    <v-btn @click="isSelect = true">
                      批量操作
                    </v-btn>
                  </v-col>
                  <v-col align-self="center" cols="2" v-else>
                    <v-btn class="mr-2" @click="isSelect = false">取消</v-btn>
                    <v-btn @click="deleteAll">删除</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 数据表格 -->
              <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="list"
                  item-key="_id"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :loading="loading"
                  hide-default-footer
                  :show-select="isSelect"
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.status="{ value }">
                  <v-chip v-if="value" color="success">已读</v-chip>
                  <v-chip v-else color="red">未读</v-chip>
                </template>
                <template v-slot:item.createdAt="{ value }">
                  {{value.slice(0, 10)}}
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
    <!-- 编辑对话框 -->
    <v-dialog
        v-model="editDialog"
        width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          编辑推广
        </v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" lazy-validation>
            <v-text-field
                v-model="editForm.title"
                label="推广名称"
                type="text"
                required
            ></v-text-field>
            <v-textarea
                v-model="editForm.content"
                label="内容"
            >
            </v-textarea>
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
    <!-- 添加对话框 -->
    <v-dialog
        v-model="addDialog"
        width="600px"
    >
      <v-card>
        <v-card-title class="headline">
          发送通知
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation>
            <v-text-field
                v-model="addForm.title"
                label="推广名称"
                type="text"
                required
            ></v-text-field>
            <v-text-field
                v-model="addForm.userId"
                label="目标用户"
                type="text"
                required
            ></v-text-field>
            <v-textarea
                v-model="addForm.content"
                label="内容"
            >
            </v-textarea>
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
  </div>
</template>

<script>
import * as api from "@/api";

export default {
  name: "Report",
  data: () => ({
    search: {
      title: "",
      status: null
    },
    selected: [],
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "名称", value: "title", sortable: false },
      { text: "举报人", value: "userId", sortable: false},
      { text: "时间", value: "createdAt", sortable: true },
      { text: "操作", value: "operation", sortable: false }
    ],
    list: [],
    count: 0,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,
    isSelect: false,
    // 添加对话框
    addDialog: false,
    addForm: {},
    // 删除对话框
    deleteDialog: false,
    deleteId: '',
    // 编辑对话框
    editDialog: false,
    editForm: {}
  }),
  computed: {
  },
  methods: {
    async getList() {
      this.loading = true;

      const conditions = {};
      conditions.title = this.search.title;
      if (this.search.status) {
        conditions.status = this.search.status;
      }

      const result = await api.getReportList({
        conditions,
        options: {
          limit: this.itemsPerPage,
          skip: (this.pageCount - 1) * this.itemsPerPage
        }
      });
      this.list = result.data.list;
      console.log(this.list)
      this.count = result.data.count;
      const num = Math.ceil(this.count / this.itemsPerPage);
      this.pageCount = num <= 0 ? 1 : num;
      this.loading = false;
    },
    deleteAll() {
      this.deleteDialog = true;
    },
    // 添加逻辑
    showAddDialog() {
      this.addDialog = true;
    },
    cancelAdd() {
      this.addForm = {};
      this.addDialog = false;
    },
    async confirmAdd() {
      const valid = this.$refs.addFormRef.validate();
      if(!valid) return;

      try {
        await api.addNotice(this.addForm);
        this.$toast("添加通知成功");
        await this.getList();
      } catch {
        this.$toast("添加通知失败");
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
        await this.getList();
      } catch {
        this.$toast("删除通知失败");
      }

      this.deleteId = '';
      this.deleteDialog = false;
    },
    // 修改逻辑

    showEditDialog(item) {
      this.editForm = item;
      this.editDialog = true;
    },
    cancelEdit() {
      this.editForm = {};
      this.editDialog = false;
    },
    async confirmEdit() {
      const valid = this.$refs.eidtFormRef.validate();
      if(!valid) return;


    }
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "举报管理");
    await this.getList();
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>