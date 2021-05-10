<template>
  <div class="examine">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="card">
            <div class="card-header card-header-info card-header-primary">
              <v-container>
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
              </v-container>
            </div>
            <div class="card-body">
              <v-data-table
                :headers="headers"
                :items="list"
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
                <template v-slot:item.cover="{ value }">
                  <v-img :src="value" width="40" height="40"> </v-img>
                </template>
                <template v-slot:item.operation="{ item }">
                  <v-btn small color="primary" @click="showExamDialog(item)">
                    <v-icon small class="mr-1">mdi-square-edit-outline</v-icon>
                    审核
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

    <!-- 编辑对话框 -->
    <v-dialog v-model="examDialog" width="600px" @click:outside="cancel">
      <v-card>
        <v-card-title class="headline"> 审核商品 </v-card-title>
        <v-card-text>
          <v-form>
            <div>
              商品封面 <v-img :src="examForm.cover" width="100"></v-img>
            </div>
            <v-text-field
              v-model="examForm.name"
              label="商品名称"
              type="text"
            >
            </v-text-field>
            <v-textarea
              v-model="examForm.intro"
              label="商品简介"
              auto-grow
            >
            </v-textarea>
            <v-text-field
              v-model="examForm.price"
              label="商品价格"
              type="number"
            >
            </v-text-field>
            <v-text-field
              v-model="examForm.oldPrice"
              label="商品原价"
              type="number"
            >
            </v-text-field>
            <v-text-field
              v-model="examForm.freight"
              label="商品邮费"
              type="number"
            >
            </v-text-field>
            <v-text-field
              v-model="examForm.category.name"
              label="商品分类"
              type="text"
            >
            </v-text-field>
            <v-text-field
              v-model="examForm.user.userName"
              label="商品发布者"
              type="text"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="darken-1" text @click="cancel"> 取消 </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="notPass"> 不通过 </v-btn>
          <v-btn color="green darken-1" text @click="pass"> 通过 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as api from "@/api";

export default {
  name: "Examine",
  data: () => ({
    search: "",
    list: [],
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

    examDialog: false,
    examForm: {
      user: { userName: ""},
      category: { name: ""}
    },

    nameRules: [(v) => !!v || "角色名称不能为空"],
  }),
  methods: {
    async getGoodsList() {
      this.loading = true;

      const result = await api.getGoodsList({
        conditions: {
          name: this.search,
          status: 0,
        },
      });
      console.log(result);
      this.list = result.goods;
      this.count = result.count;

      this.loading = false;
    },
    showExamDialog(goods) {
      this.examDialog = true;
      this.examForm = Object.assign({}, goods);
    },
    cancel() {
      this.examDialog = false;
      this.examForm = {
        user: { userName: ""},
        category: { name: ""}
      }
    },
    async notPass() {
      await api.updateGoods(this.examForm._id, { status: 2 });
      this.getGoodsList();
      this.cancel();
    },
    async pass() {
      await api.updateGoods(this.examForm._id, { status: 1 });
      this.getGoodsList();
      this.cancel();
    },
  },
  async mounted() {
    await this.getGoodsList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>
