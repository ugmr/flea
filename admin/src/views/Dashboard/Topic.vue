<template>
  <div class="notice">
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
              <!-- 搜索框 -->
              <v-row>
                <v-col cols="3">
                  <v-text-field
                      v-model="search.title"
                      label="搜索"
                  ></v-text-field>
                </v-col>
                <v-col cols="1">
                  <v-btn fab small class="mt-3" @click="getList">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="1" align-self="center">
                  <v-btn @click="showAddDialog">添加</v-btn>
                </v-col>
              </v-row>
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
                <template v-slot:item.cover="{ value }">
                  <v-img
                    v-if="value"
                    :src="value"
                    width="40"
                    height="40"
                  >
                  </v-img>
                  <div v-else>暂无</div>
                </template>
                <template v-slot:item.intro="{ value }">
                  {{value || "暂无"}}
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
          @click:outside="cancelEdit"
      >
        <v-card>
          <v-card-title class="headline">
            编辑话题
          </v-card-title>
          <v-card-text>
            <v-form ref="editFormRef" lazy-validation>
              <v-text-field
                v-model="editForm.name"
                :rules="nameRules"
                label="话题名称"
                type="text"
                required
              ></v-text-field>
              <v-textarea
                  v-model="editForm.intro"
                  :rules="introRules"
                  label="话题简介"
                  auto-grow
              ></v-textarea>
              <v-file-input
                  v-model="editPhoto"
                  accept="image/*"
                  label="封面图片"
                  show-size
                  @change="showImage"
                  @click:clear="editImageUrl = ''"
              ></v-file-input>
              <img :src="editImageUrl" width="480"/>
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
     <!-- 添加对话框 -->
    <v-dialog
      v-model="addDialog"
      width="600px"
      @click:outside="cancelAdd"
    >
      <v-card>
        <v-card-title class="headline">
          添加话题
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation class="text-center">
            <v-text-field
                v-model="addForm.name"
                :rules="nameRules"
                label="话题名称"
                type="text"
                required
            ></v-text-field>
            <v-textarea
                v-model="addForm.intro"
                :rules="introRules"
                label="话题简介"
                auto-grow
            ></v-textarea>
            <v-file-input
                v-model="addPhoto"
                accept="image/*"
                label="封面图片"
                show-size
                @change="showImage"
                @click:clear="addImageUrl = ''"
            ></v-file-input>
            <img :src="addImageUrl" width="480"/>
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
import axios from "axios";

export default {
  name: "Notice",
  data: () => ({
    search: "",
    selected: [],
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "封面", value: "cover", sortable: false},
      { text: "名称", value: "name", sortable: false },
      { text: "简介", value: "intro", sortable: false },
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
    addImageUrl: "",
    addPhoto: null,
    // 删除对话框
    deleteDialog: false,
    deleteId: '',
    // 编辑对话框
    editDialog: false,
    editForm: {},
    editImageUrl: "",
    editPhoto: null,

    nameRules: [
      (v) => !!v || "话题名称不能为空",
    ],
    introRules: [
      (v) => !!v || "话题简介不能为空",
    ]
  }),
  computed: {
  },
  methods: {
    async getList() {
      this.loading = true;

      const result = await api.getTopicList({
        conditions: {
          name: this.search
        },
      });
      console.log(result)
      this.list = result.topics;
      this.pageCount = Math.ceil(result.count / this.itemsPerPage) || 1;
      this.loading = false
    },
    showImage(image) {
      if(!image) return;
      const that = this;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onloadend = function(oFRevent){
        const src = oFRevent.target.result;
        that.addImageUrl = src;
      }
    },
    // 添加逻辑
    showAddDialog() {
      this.addDialog = true;
    },
    cancelAdd() {
      this.$refs.addFormRef.reset()
      this.addForm = {};
      this.addDialog = false;
    },
    async confirmAdd() {
      const valid = this.$refs.addFormRef.validate();
      if(!valid) return;

      try {
        // 上传图像
        const result = await api.upload(this.addPhoto);
        await api.addTopic({
          ...this.addForm,
          cover: result.url
        });
        this.$toast("添加话题成功");
        await this.getList();
      } catch {
        this.$toast("添加话题失败");
      }

      this.addForm = {};
      this.addDialog = false;
    },
    // 删除逻辑
    showDeleteDialog(id) {
      console.log(id)
      this.deleteId = id;
      this.deleteDialog = true;
    },
    cancelDelete() {
      this.deleteId = '';
      this.deleteDialog = false;
    },
    async confirmDelete() {
      try {
        await api.deleteTopic(this.deleteId);

        this.$toast("删除话题成功");
        await this.getList();
      } catch {
        this.$toast("删除话题失败");
      }

      this.deleteId = '';
      this.deleteDialog = false;
    },

     async showEditDialog(topic) {
      try {
        console.log(topic)
        Object.keys(topic).forEach(key => {
          this.editForm[key] = topic[key];
        });
        this.editImageUrl = this.editForm.cover;
        const result = await axios.get(this.editImageUrl, {timeout: 5000});
        this.editPhoto = new File([result.data], this.editImageUrl.split("/").slice(-1));
      } catch (e) {
        console.log(e)
      }
      this.editDialog = true;
    },
    cancelEdit() {
      this.editAdvert = {};
      this.editImageUrl = "";
      this.editPhoto = null;
      this.editDialog = false;
    },
    async confirmEdit() {
      const valid = this.$refs.editFormRef.validate();
      if(!valid) return;
      try {
        // 如果修改了封面
        if(this.editForm.cover !== this.editImageUrl) {
          const result = api.upload(this.editPhoto);
          this.editForm.cover = result.url;
        }
        console.log(this.editForm)
        await api.updateTopic(this.editForm._id, this.editForm);
        this.$toast("修改推广信息成功")
      } catch(e) {
        console.log(e)
        this.$toast("修改推广信息失败");
      }
      this.editPhoto = null;
      this.editImageUrl = '';
      this.$refs.editFormRef.reset();
      this.getList();
      this.editDialog = false;
    },
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "话题管理");
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