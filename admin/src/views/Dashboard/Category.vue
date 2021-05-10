<template>
  <div class="category">
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
                    <v-col cols="3">
                      <v-text-field
                          v-model="search"
                          label="搜索"
                          clearable
                      >
                      </v-text-field>
                    </v-col>
                    <v-btn fab small class="mt-6 ml-2" @click="getList()">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-row>
                  <v-col cols="1" align-self="center">
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
                  item-key="id"
                  :page.sync="page"
                  :items-per-page="itemsPerPage"
                  :loading="loading"
                  loading-text="加载中"
                  hide-default-footer
                  show-expand
                  single-expand
                  :expanded.sync="expanded"
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.cover="{ value }">
                  <v-img
                    :src="value"
                    width="40"
                    height="40"
                  >
                  </v-img>
                </template>
                <template v-slot:item.parentId ="{ value }">
                  <v-chip v-if="value" color="green" small outlined>二级</v-chip>
                  <v-chip v-else color="primary" small outlined>一级</v-chip>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" v-if="item.children" class="px-10">
                    <v-data-table
                        class="mt-2 mb-2"
                        :headers="itemHeaders"
                        :items="item.children"
                        item-key="name"
                        hide-default-footer
                    >
                      <template v-slot:item.index="{ index }">
                        {{ (index + 1) }}
                      </template>
                      <template v-slot:item.cover="{ value }">
                        <v-img
                          v-if="value"
                          width="40"
                          height="40"
                          :src="value"
                        ></v-img>
                        <div v-else>暂无</div>
                      </template>
                      <template v-slot:item.parentId ="{ value }">
                        <v-chip v-if="value !== ''" color="green" small outlined>二级</v-chip>
                        <v-chip v-else color="primary" small outlined>一级</v-chip>
                      </template>
                      <template v-slot:item.show ="{ value }">
                        <v-chip v-if="value" color="green" small outlined>展示</v-chip>
                        <v-chip v-else color="error" small outlined>不展示</v-chip>
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
                  </td>
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
    </v-container>
    <!-- 添加对话框 -->
    <v-dialog
        v-model="addDialog"
        width="600px"
        @click:outside="cancelAdd"
    >
      <v-card>
        <v-card-title class="headline">
          添加分类
        </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation class="text-center">
            <v-text-field
                v-model="addForm.name"
                :rules="rules"
                label="名称"
                type="text"
                required
            ></v-text-field>
            <v-select
                v-model="addForm.parentId"
                :rules="rules"
                :items="parentCategorys"
                label="一级分类"
            ></v-select>
            <v-file-input
                v-if="addForm.parentId"
                v-model="addForm.cover"
                accept="image/*"
                label="封面图片"
                show-size
                @change="showAddImage"
                @click:clear="addImageUrl = ''"
            ></v-file-input>
            <img :src="addImageUrl" width="400"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="darken-1"
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
          修改分类
        </v-card-title>
        <v-card-text>
          <v-form ref="editFormRef" lazy-validation class="text-center">
            <v-text-field
                v-model="editForm.name"
                label="名称"
                type="text"
                required
            ></v-text-field>
            <v-select
                v-model="editForm.parentId"
                :items="parentCategorys"
                label="一级分类"
                :disabled="!editForm.parentId"
            ></v-select>
            <v-file-input
                v-if="editForm.parentId"
                v-model="editForm.cover"
                accept="image/*"
                label="封面图片"
                show-size
                @change="showEditImage"
                @click:clear="editImageUrl = ''"
            ></v-file-input>
            <img v-if="editForm.parentId" :src="editImageUrl" width="400"/>
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
import axios from "axios";

export default {
  name: "Category",
  data: () => ({
    search: "",
    expanded: [],
    headers: [
      {text: "索引", value: "index", sortable: false },
      {text: "分类名称", value: "name",width: 400, sortable: false},
      {text: "分类级别", value: "parentId", sortable: false},
      {text: "操作", value: "operation", sortable: false},
      {value: 'data-table-expand', width: 100}
    ],
    itemHeaders: [
      {text: "索引", value: "index", sortable: false },
      {text: "封面", value: "cover", sortable: false },
      {text: "分类名称", value: "name", width: 400, sortable: false},
      {text: "分类级别", value: "parentId", sortable: false},
      {text: "展示", value: "show", sortable: false},
      {text: "操作", value: "operation", sortable: false}
    ],
    list: [],
    count: 1,
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,
    loading: false,

    parentCategorys: [],
    addDialog: false,
    addForm: {},
    addImageUrl: '',

    deleteDialog: false,
    deleteId: '',

    editDialog: false,
    editForm: {},
    editImageUrl: '',

    rules: [
      (v) => !!v || "该字段不能为空",
    ]
  }),
  methods: {
    // 获取数据
    async getList () {
      try {
        this.loading = true;
        const result = await api.getCategoryList({
          conditions: {
            name: this.search,
          }
        });
        this.list = result.category;
        this.count = Math.ceil(this.count / this.itemsPerPage) || 1;
      } catch {
        this.$toast("获取权限列表失败");
      }
      this.loading = false;
    },
    async getParentList() {
      try {
        // 获取一级分类列表
        const result = await api.getCategoryList({
          conditions: {
            parentId: null,
          },
        });
        result.category.map((item) => {
          this.parentCategorys.push({
            text: item.name,
            value: item.id
          });
        });
        this.parentCategorys.unshift({
          text: "无", value: null,
        });
      } catch {
        this.$toast("获取分类列表失败");
      }
    },
    // 展示图片
    showImage(image, callback) {
      if(!image) return;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onloadend = callback;
    },
    showAddImage(image) {
      this.showImage(image, (e) => {
        this.addImageUrl = e.target.result;
      });
    },
    showEditImage(image) {
      this.showImage(image, (e) => {
        this.editImageUrl = e.target.result;
      });
    },

    // 添加逻辑
    async showAddDialog() {
      this.parentCategorys.length > 0 || await this.getParentList();
      this.addDialog = true;
    },
    cancelAdd() {
      this.addForm = {};
      this.addImageUrl = '';
      this.addDialog = false;
    },
    async confirmAdd() {
      // 验证
      const valid = this.$refs.addFormRef.validate()
      if(!valid) return
      try {
        const result = await api.upload(this.addForm.cover);
        this.addForm.cover = result.url;
        await api.addCategory(this.addForm);
        this.$toast("添加分类成功");
      } catch {
        this.$toast("添加分类失败");
      }
      await this.getList();
      this.addForm = {};
      this.addImageUrl = '';
      this.parentCategorys = [];
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
        await api.deleteCategory(this.deleteId);
        this.$toast("删除分类成功");
      } catch {
        this.$toast("删除分类失败");
      }

      await this.getList();
      this.deleteId = '';
      this.deleteDialog = false;
    },
    // 修改逻辑
    async showEditDialog(data) {
      Object.keys(data).forEach(key => {
        if(key === "children") return
        this.editForm[key] = data[key]
      })
      console.log(data)
      this.parentCategorys || await this.getParentList()
      this.editForm.parentId || (this.editForm.parentId = null)
      try {
        const result = await axios.get(this.editForm.cover, {timeout: 5000});
        this.editImageUrl = this.editForm.cover;
        this.editForm.cover = new File([result.data ? result.data: ''], this.editForm.cover.split("/").slice(-1));
      } catch {
        this.editForm.cover = null;
      }

      await this.getParentList();
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
        if(this.editImageUrl.startsWith("data")) {
          const result = await api.upload(this.editForm.cover);
          this.editForm.cover = result.url;
        }
        await api.updateCategory(this.editForm.id, this.editForm);
        this.$toast("修改分类成功");
      } catch {
        this.$toast("修改分类失败");
      }
      this.getList()
      this.editForm = {};
      this.editImageUrl = '';
      this.editDialog = false;
    }
  },
  async mounted() {
    await this.getList();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.v-data-table::v-deep .v-data-table__expand-icon {
  font-size: 14px;
}

.card {
  @include card;
}
</style>