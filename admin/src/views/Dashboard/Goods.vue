<template>
  <div class="goods">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="card">
            <div class="card-header card-header-info card-header-primary">
              <v-container>
                <v-row justify="space-between">
                  <v-row>
                    <!-- 搜索框 -->
                    <v-col cols="4">
                      <v-text-field
                        v-model="search"
                        label="商品名称"
                      ></v-text-field>
                    </v-col>
                    <v-btn fab small class="mt-6 ml-3" @click="getGoodsList">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-row>
                  <v-col cols="1">
                    <v-btn @click="showAddDialog">添加</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div class="card-body">
              <v-data-table
                :headers="headers"
                :items="list"
                item-key="_id"
                :page.sync="page"
                :items-per-page="itemsPerPage"
                hide-default-footer
                :loading="loading"
                loading-text="加载中"
              >
                <template v-slot:item.index="{ index }">
                  {{ (pageCount - 1) * itemsPerPage + index + 1 }}
                </template>
                <template v-slot:item.cover="{ value }">
                  <v-img :src="value" width="40" height="40"> </v-img>
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="primary" @click="showEditDialog(item)">
                    <v-icon small class="mr-1">mdi-square-edit-outline</v-icon>
                    编辑
                  </v-btn>
                  <v-btn
                    small
                    color="error"
                    class="ml-1"
                    @click="showDeleteDialog(item._id)"
                  >
                    <v-icon small class="mr-1">mdi-delete</v-icon>
                    删除
                  </v-btn>
                </template>
              </v-data-table>
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
    <v-dialog v-model="addDialog" width="600px" @click:outside="cancelAdd">
      <v-card>
        <v-card-title class="headline"> 添加商品 </v-card-title>
        <v-card-text>
          <v-form ref="addFormRef" lazy-validation>
            <v-text-field
              v-model="addForm.name"
              label="商品名称"
              type="text"
              required
            >
            </v-text-field>
            <v-textarea
              v-model="addForm.intro"
              label="商品描述"
              auto-grow
              required
            >
            </v-textarea>
            <v-text-field
              v-model="addForm.userId"
              label="用户ID"
              type="text"
              required
            >
            </v-text-field>
            <v-file-input
              v-model="addForm.photo"
              accept="image/*"
              label="封面图片"
              chips
              multiple
            ></v-file-input>
            <v-text-field
              v-model="addForm.price"
              label="价格"
              max="100"
              min="0"
              type="number"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="addForm.oldPrice"
              label="原价"
              max="100"
              min="0"
              type="number"
              required
            >
            </v-text-field>
            <v-text-field
              v-model="addForm.freight"
              label="运费"
              max="100"
              min="0"
              type="number"
              required
            >
            </v-text-field>
            <v-select
              v-model="parentId"
              :items="parentCategory"
              label="一级分类"
              @change="changeCategory"
            >
            </v-select>
            <v-select
              v-if="parentId"
              v-model="addForm.category"
              :items="childCategory"
              label="二级分类"
            >
            </v-select>
            <v-select v-model="addForm.new" :items="newList" label="新旧程度">
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancelAdd"> 取消 </v-btn>
          <v-btn color="green darken-1" text @click="confirmAdd"> 确定 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 编辑对话框 -->
    <v-dialog v-model="editDialog" width="600px" @click:outside="cancelEdit"> 
      <v-card>
        <v-card-title class="headline"> 审核商品 </v-card-title>
        <v-card-text>
          <v-form>
            <div>
              商品封面 <v-img :src="editForm.cover" width="100"></v-img>
            </div>
            <v-text-field v-model="editForm.name" label="商品名称" type="text">
            </v-text-field>
            <v-textarea v-model="editForm.intro" label="商品简介" auto-grow>
            </v-textarea>
            <v-text-field
              v-model="editForm.price"
              label="商品价格"
              type="number"
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.oldPrice"
              label="商品原价"
              type="number"
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.freight"
              label="商品邮费"
              type="number"
              required
            >
            </v-text-field>
            <v-select
              v-model="parentId"
              :items="parentCategory"
              label="一级分类"
              @change="changeCategory"
            >
            </v-select>
            <v-select
              v-if="parentId"
              v-model="editForm.category"
              :items="childCategory"
              label="二级分类"
            >
            </v-select>
            <v-text-field
              v-model="editForm.userId"
              label="商品发布者"
              type="text"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color=" darken-1" text @click="cancelEdit"> 取消 </v-btn>
          <v-btn color="green darken-1" text @click="confirmEdit"> 修改 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 删除对话框 -->
    <v-dialog v-model="deleteDialog" width="400px">
      <v-card>
        <v-card-title class="headline"> 提示 </v-card-title>
        <v-card-text> 确定删除吗？ </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cancelDelete">
            取消
          </v-btn>
          <v-btn color="green darken-1" text @click="confirmDelete">
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
  name: "editine",
  data: () => ({
    search: "",
    list: [],
    categoryList: [],
    parentCategory: [],
    childCategory: [],
    parentId: "",
    newList: [
      {
        text: "全新",
        value: "全新",
      },
      {
        text: "几乎全新",
        value: "几乎全新",
      },
      {
        text: "轻微使用痕迹",
        value: "轻微使用痕迹",
      },
      {
        text: "明显使用痕迹",
        value: "明显使用痕迹",
      },
    ],
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "商品封面", value: "cover", sortable: false },
      { text: "名称", value: "name", sortable: false },
      { text: "发布者", value: "user.userName", sortable: false },
      { text: "分类", value: "category.name", sortable: false },
      { text: "价格", value: "price", sortable: false },
      { text: "操作", value: "operation", sortable: false },
    ],
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,

    loading: false,
    // 添加
    addDialog: false,
    addForm: {},
    // 编辑
    editDialog: false,
    editForm: {
      user: { userName: "" },
      category: { name: "" },
    },
    // 删除
    deleteDialog: false,
    deleteAdvertId: "",

    nameRules: [(v) => !!v || "角色名称不能为空"],
  }),
  methods: {
    async getGoodsList() {
      this.loading = true;

      const result = await api.getGoodsList({
        conditions: {
          name: this.search,
          status: 1,
        },
      });
      console.log(result);
      this.list = result.goods;
      this.count = result.count;

      this.loading = false;
    },
    async getCategoryList() {
      try {
        const result = await api.getCategoryList();
        this.categoryList = result.category;
        this.parentCategory = result.category.map((c) => ({
          text: c.name,
          value: c.id,
        }));
      } catch {
        this.$toast("获取分类列表失败");
      }
      this.loading = false;
    },
    changeCategory() {
      this.childCategory = this.categoryList
        .filter((item) => {
          return item.id === this.parentId;
        })[0]
        .children.map((item) => ({
          text: item.name,
          value: item.id,
        }));
    },
    // 修改
    showEditDialog(goods) {
      this.editForm = Object.assign({}, goods);
      this.parentId = this.editForm.category.parentId
      console.log(this.parentCategory)
      this.changeCategory()
      this.editForm.category = this.editForm.category._id
      this.editDialog = true;
    },
    cancelEdit() {
      this.editDialog = false;
      this.parentId = "";
      this.editForm = {};
    },
    async confirmEdit() {
      try {
        await api.updateGoods(this.editForm._id, this.editForm)
        this.$toast("修改商品信息成功")
      } catch (e) {
        this.$toast("修改商品信息失败")
      }
      this.editForm = {}
      this.parentId = ""
      this.getGoodsList()
    },
    // 删除推广对话框
    showDeleteDialog(id) {
      this.deleteId = id;
      this.deleteDialog = true;
    },
    cancelDelete() {
      this.deleteDialogId = "";
      this.deleteDialog = false;
    },
    async confirmDelete() {
      try {
        await api.deleteGoods(this.deleteId);
        this.$toast("删除商品成功");
      } catch (e) {
        console.log(e);
        this.$toast("删除商品失败");
      }
      await this.getGoodsList();
      this.deleteDialog = false;
    },
    // 添加逻辑
    showAddDialog() {
      this.addDialog = true;
    },
    cancelAdd() {
      this.$refs.addFormRef.reset();
      this.addForm = {};
      this.parentId = "";
      this.addDialog = false;
    },
    async confirmAdd() {
      try {
        this.addForm.photo = await Promise.all(
          this.addForm.photo.map(async (item) => {
            const result = await api.upload(item);
            return result.url;
          })
        );
        this.addForm.cover = this.addForm.photo[0];
        this.addForm.num = 1;
        this.addForm.address = "北京市";
        await api.addGoods(this.addForm);
        this.$toast("添加商品成功");
        await this.getGoodsList();
      } catch (e) {
        console.log(e);
        this.$toast("添加商品失败");
      }

      this.addDialog = false;
      this.addForm = {};
    },
  },
  async mounted() {
    await this.getGoodsList();
    await this.getCategoryList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>
