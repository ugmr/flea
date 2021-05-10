<template>
  <div class="alert">
    <!-- 表格 -->
    <v-container>
      <v-row justify="center">
        <v-col cols="12">
          <!-- 卡片 -->
          <v-card class="card">
            <!-- 卡片头部 -->
            <div class="card-header card-header-primary card-header-info">
              <v-container>
                <v-row justify="space-between">
                  <!-- 搜索框 -->
                  <v-col cols="4">
                    <v-text-field
                        dense
                        label="搜索"
                        v-model="search"
                    >
                      <template v-slot:append-outer>
                        <v-btn fab small class="mt--1" @click="getAdvertList">
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
            <!-- 卡片主体 -->
            <div class="card-body">
              <!-- 数据表格 -->
              <v-data-table
                  :headers="headers"
                  :items="adverts"
                  item-key="name"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  hide-default-footer
                  :loading="loading"
                  loading-text="加载中"
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.img="{ value }">
                  <v-img
                    :src="value"
                    width="40"
                    height="40"
                  >
                  </v-img>
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
                <template v-slot:item.isUsed="{ value }">
                  <v-chip color="success" outlined v-if="value">已应用</v-chip>
                  <v-chip color="red" outlined v-else>未应用</v-chip>
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
              @click="cancelDeleteAdvert"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmDeleteAdvert"
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
                v-model="editAdvert.name"
                :rules="titleRules"
                label="推广名称"
                type="text"
                required
            ></v-text-field>
            <v-text-field
                v-model="editAdvert.src"
                :rules="linkRules"
                label="商品ID"
                type="text"
                required
            ></v-text-field>
            <v-file-input
                v-model="editPhoto"
                accept="image/*"
                label="封面图片"
                @click:clear="editImageUrl = ''"
            ></v-file-input>
            <img :src="editImageUrl" width="560"/>
            <v-switch
                label="是否应用"
                v-model="editAdvert.isUsed"
            >
            </v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="cancelEditAdvert"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmEditAdvert"
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
          添加推广
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation>
            <v-text-field
                v-model="addAdvert.name"
                :rules="titleRules"
                label="推广名称"
                type="text"
                required
            ></v-text-field>
            <v-text-field
                v-model="addAdvert.src"
                :rules="linkRules"
                label="商品ID"
                type="text"
                required
            ></v-text-field>
            <v-file-input
                v-model="addPhoto"
                accept="image/*"
                label="封面图片"
                show-size
                :rules="photoRules"
                @change="showImage"
                @click:clear="addImageUrl = ''"
            ></v-file-input>
            <img :src="addImageUrl"/>
            <v-switch
              label="是否应用"
              v-model="addAdvert.isUsed"
            >
            </v-switch>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="cancelAddAdvert"
          >
            取消
          </v-btn>
          <v-btn
              color="green darken-1"
              text
              @click="confirmAddAdvert"
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
import axios from "axios";

export default {
  name: "Advert",
  data: () => ({
    // 表格信息
    search: '',
    headers: [
      { text: '索引', value: 'index', sortable: false },
      { text: '图片', value: 'img', sortable: false },
      { text: '名称', value: 'name', sortable: false }, 
      { text: '商品ID', value: 'src', sortable: false },
      { text: '是否应用', value: 'isUsed' },
      { text: '操作', value: 'operation', sortable: false },
    ],
    adverts: [],
    loading: false,
    // 页脚信息
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    // 编辑对话框
    editDialog: false,
    editAdvert: {},
    editPhoto: null,
    editImageUrl: '',
    // 添加对话框
    addDialog: false,
    addAdvert: {},
    addPhoto: null,
    addImageUrl: '',
    // 删除对话框
    deleteDialog: false,
    deleteAdvertId: '',
    // 验证规则
    titleRules: [
      (v) => !!v || "推广名称不能为空",
    ],
    linkRules: [
      (v) => !!v || "推广链接不能为空",
    ],
    photoRules: [
      value => !!value || "推广封面不能为空",
    ],
  }),
  methods: {
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
    // 获取推广列表
    async getAdvertList () {
      this.loading = true;
      let conditions = {}
      if(this.search) {
        conditions.name = this.search
      }
      try {
        const result = await api.getAdvertList({
          conditions,
        });
        this.adverts = result.adverts;
        this.count = result.count
      } catch {
        this.$toast("获取推广列表失败");
      }
      this.loading = false;
    },
    // 删除推广对话框
    showDeleteDialog(id) {
      this.deleteAdvertId = id;
      this.deleteDialog = true;
    },
    cancelDeleteAdvert() {
      this.deleteDialogId = '';
      this.deleteDialog = false;
    },
    async confirmDeleteAdvert() {
      try {
        await api.deleteAdvert(this.deleteAdvertId);
        this.$toast("删除推广成功");
      } catch(e) {
        console.log(e);
        this.$toast("删除推广失败");
      }
      await this.getAdvertList();
      this.deleteDialog = false;
    },
    // 编辑推广对话框
    async showEditDialog(advert) {
      try {
        Object.keys(advert).forEach(key => {
          this.editAdvert[key] = advert[key];
        });
        this.editImageUrl = this.editAdvert.img;
        const result = await axios.get(this.editImageUrl, {timeout: 5000});
        this.editPhoto = new File([result.data], this.editImageUrl.split("/").slice(-1));
      } catch (e) {
        console.log(e)
      }
      this.editDialog = true;
    },
    cancelEditAdvert() {
      this.editAdvert = {};
      this.editImageUrl = "";
      this.editPhoto = null;
      this.editDialog = false;
    },
    async confirmEditAdvert() {
      const valid = this.$refs.editFormRef.validate();
      if(!valid) return;
      try {
        // 如果修改了封面
        if(this.editAdvert.photo !== this.editImageUrl) {
          const result = api.upload(this.editPhoto);
          this.editAdvert.photo = result.url;
        }
        await api.updateAdvert(this.editAdvert);
        this.$toast("修改推广信息成功")
      } catch(e) {
        console.log(e)
        this.$toast("修改推广信息失败");
      }
      this.editPhoto = null;
      this.editImageUrl = '';
      this.$refs.editFormRef.reset();
      this.getAdvertList();
      this.editDialog = false;
    },
    // 添加推广对话框
    showAddDialog() {
      this.addDialog = true;
    },
    cancelAddAdvert () {
      this.$refs.addFormRef.reset();
      this.addPhoto = null;
      this.addImageUrl = '';
      this.addDialog = false;
    },
    async confirmAddAdvert() {
      const valid = this.$refs.addFormRef.validate();
      if(!valid) return;
      try {
        // 上传图像
        const result = await api.upload(this.addPhoto);
        await api.addAdvert({
          ...this.addAdvert,
          img: result.url
        });
        this.$toast("添加推广成功");
      } catch(e) {
        console.log(e)
        this.$toast("添加推广失败");
      }
      // 更新列表
      await this.getAdvertList();
      this.$refs.addFormRef.reset();
      this.addImageUrl = '';
      this.addPhoto = null;
      this.addDialog = false;
    },
  },
  async mounted() {
    this.$store.commit("CHANGE_TITLE", "推广管理");
    await this.getAdvertList();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}

.v-card::v-deep .v-card__text {
   padding-top: 15px;
}

.mt--1 {
  margin-top: -6px;
}
</style>