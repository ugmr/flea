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
                <v-row justify="space-between">
                  <v-row>
                    <!-- 搜索框 -->
                    <v-col cols="4">
                      <v-text-field
                          v-model="search"
                          label="搜索"
                      ></v-text-field>
                    </v-col>

                    <v-btn fab small class="mt-6 ml-3" @click="getList">
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
                  :items="list"
                  item-key="_id"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :loading="loading"
                  hide-default-footer
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.content="{ value }">
                  {{value.slice(0, 20)}}
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="primary" @click="showEditDialog(item)">
                    <v-icon small class="mr-1">mdi-square-edit-outline</v-icon>
                    编辑
                  </v-btn>
                  <v-btn small color="error" class="ml-1" @click="showDeleteDialog(item.id)">
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
            编辑帖子
          </v-card-title>
          <v-card-text>
            <v-form ref="editFormRef" lazy-validation>
              <v-select
                v-model="editForm.topicId"
                :items="topics"
                label="请选择话题"
                single-line
              >
              </v-select>
              <v-textarea
                  v-model="editForm.content"
                  label="内容"
              >
              </v-textarea>
              <!-- <v-file-input
                  v-model="editForm.photo"
                  accept="image/*"
                  label="封面图片"
                  show-size
                  small-chips
                  multiple
              ></v-file-input> -->
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
          @click:outside="cancelAdd"
      >
        <v-card>
          <v-card-title class="headline">
            发布贴子
          </v-card-title>
          <v-card-text>
            <v-form ref="addFormRef" lazy-validation>
              <v-select
                v-model="addForm.topicId"
                :items="topics"
                label="请选择话题"
                single-line
              >
              </v-select>
              <v-textarea
                  v-model="addForm.content"
                  label="请输入内容"
                  auto-grow
              ></v-textarea>
              <v-file-input
                multiple
                truncate-length="15"
              ></v-file-input>
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
    </v-container>
  </div>
</template>

<script>
import * as api from "@/api";

export default {
  name: "Report",
  data: () => ({
    search: "",
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "内容", value: "content", sortable: false },
      { text: "发布者", value: "user.userName", sortable: false},
      { text: "所属话题", value: "topicName", sortable: false },
      { text: "操作", value: "operation", sortable: false }
    ],
    list: [],
    count: 0,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,
    topics: [],
    // 添加对话框
    addDialog: false,
    addForm: {},
    addImageUrl: "",
    addPhoto: null,
    // 删除对话框
    deleteDialog: false,
    deleteId: '',
    // 编辑对话框
    editDialog: false,
    editForm: {},
    editImageUrl: "",
    editPhoto: null
  }),
  methods: {
    async getList() {
      this.loading = true;

      const result = await api.getPostList({
        conditions: {
          content: this.search
        },
      });
      console.log(result)
      this.list = result.posts;
      this.pageCount = Math.ceil(this.count / this.itemsPerPage) || 1;
      this.loading = false;

      const res2 = await api.getTopicList()
      this.topics = res2.topics.map(topic=> ({
        text: topic.name,
        value: topic._id
      }))
      console.log(this.topics)
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
        await api.addPost(this.addForm);
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
        await api.deletePost(this.deleteId);
        this.$toast("删除帖子成功");
        await this.getList();
      } catch {
        this.$toast("删除贴子失败");
      }

      this.deleteId = '';
      this.deleteDialog = false;
    },
    // 修改逻辑
    async showEditDialog(post) {
      try {
        Object.keys(post).forEach(key => {
          if(key === "user" || key==="topicName") return
          this.editForm[key] = post[key];
        });
      } catch (e) {
        console.log(e)
      }
      this.editDialog = true;
    },
    cancelEdit() {
      this.editForm = {};
      this.editDialog = false;
    },
    async confirmEdit() {
      const valid = this.$refs.editFormRef.validate();
      if(!valid) return;

      try {
        await api.updatePost(this.editForm.id, this.editForm);
        this.$toast("修改贴子成功")
      } catch {
        this.$toast("修改贴子失败")
      }
      this.getList()
      this.cancelEdit()
    }
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "帖子管理");
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