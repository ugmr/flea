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
                        label="搜索"
                      ></v-text-field>
                    </v-col>
                    <v-btn fab small class="mt-6 ml-3" @click="getOrderList">
                      <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                  </v-row>
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
                <template v-slot:item.createdAt="{ value }">
                  {{value.slice(0, 10)}}
                </template>
                <template v-slot:item.status="{ value }">
                  <v-chip v-if="value=== 0" color="error" outlined >已取消</v-chip>
                  <v-chip v-if="value=== 1" color="info" outlined >待付款</v-chip>
                  <v-chip v-if="value=== 2" color="info" outlined >待发货</v-chip>
                  <v-chip v-if="value=== 3" color="info" outlined >待收货</v-chip>
                  <v-chip v-if="value=== 4" color="info" outlined >待评价</v-chip>
                  <v-chip v-if="value=== 5" color="success" outlined >已完成</v-chip>
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
    <!-- 删除对话框 -->
    <v-dialog
      v-model="deleteDialog"
      width="400px"
      @click:outside="cancelDelete"
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
    <v-dialog v-model="editDialog" width="600px" @click:outside="cancelEdit"> 
      <v-card>
        <v-card-title class="headline"> 编辑订单 </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="editForm.no" label="订单编号" type="text" disabled></v-text-field>
            <v-text-field
              v-model="editForm.buyer.userName"
              label="买家"
              type="text"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.seller.userName"
              label="卖家"
              type="text"
              required
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.goodsName"
              label="商品"
              type="text"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.price"
              label="交易金额"
              type="number"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="delivery"
              label="收货地址"
              type="text"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.delivery.name"
              label="收货人"
              type="text"
              disabled
            >
            </v-text-field>
            <v-text-field
              v-model="editForm.delivery.mobile"
              label="收货人手机号码"
              type="text"
              disabled
            >
            </v-text-field>
            <v-select
              v-model="editForm.status"
              :items="statusList"
              label="订单状态"
            >
            </v-select>
            <v-select
              v-model="editForm.logistic.types"
              :items="logisticList"
              label="物流类型"
            >
            </v-select>
            <v-text-field
              v-model="editForm.logistic.no"
              label="物流订单号"
            >
            </v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="darken-1" text @click="cancelEdit"> 取消 </v-btn>
          <v-btn color="green darken-1" text @click="confirmEdit"> 修改 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import * as api from "@/api";

export default {
  name: "order",
  data: () => ({
    search: "",
    list: [],
    headers: [
      { text: "索引", value: "index", sortable: false },
      { text: "订单编号", value: "no", sortable: false },
      { text: "买家", value: "buyer.userName", sortable: false },
      { text: "卖家", value: "seller.userName", sortable: false },
      { text: "商品", value: "goodsName", sortable: false },
      { text: "商品封面", value: "cover", sortable: false },
      { text: "订单状态", value: "status", sortable: false },
      { text: "创建时间", value: "createdAt", sortable: true },
      { text: "操作", value: "operation", sortable: false },
    ],
    page: 1,
    pageCount: 1,
    itemsPerPage: 10,

    loading: false,
    // 编辑
    editDialog: false,
    editForm: {
      buyer: {},
      seller: {},
      logistic: {},
      delivery: {}
    },
    // 删除
    deleteDialog: false,
    deleteAdvertId: "",

    statusList: [
      {text: "已关闭", value: 0},
      {text: "待付款", value: 1},
      {text: "待发货", value: 2},
      {text: "待收货", value: 3},
      {text: "待评价", value: 4},
      {text: "已完成", value: 5},
    ],

    logisticList: [
      {text: "申通", value: "STO"},
      {text: "圆通", value: "YTO"},
      {text: "百世", value: "HTKY"},
      {text: "天天", value: "HHTT"},
    ],

    nameRules: [(v) => !!v || "角色名称不能为空"],
  }),
  computed: {
    delivery() {
      return this.editForm.delivery.province || "" 
        + this.editForm.delivery.city || ""
        + this.editForm.delivery.district||""
        + this.editForm.delivery.address || "";
    }
  },
  methods: {
    async getOrderList() {
      this.loading = true;

      const result = await api.getOrderList({
        conditions: {
          no: this.search,
        },
      });
      this.list = result.orders;
      this.count = result.count;

      this.loading = false;
    },
    // 修改
    showEditDialog(order) {
      this.editForm = Object.assign({}, order)
      
      this.editDialog = true;
    },
    cancelEdit() {
      this.editDialog = false;
      this.editForm = {
        buyer: {},
        seller: {},
        logistic: {},
        delivery: {}
      };
    },
    async confirmEdit() {
      try {
        const orderInfo = {
          status: this.editForm.status,
          logistic: this.editForm.logistic
        }
        await api.updateOrder(this.editForm._id, orderInfo)
        this.$toast("修改订单信息成功")
      } catch (e) {
        this.$toast("修改订单信息失败")
      }
      this.cancelEdit()
      this.getOrderList()
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
        await api.deleteOrder(this.deleteId);
        this.$toast("删除订单成功");
      } catch (e) {
        console.log(e);
        this.$toast("删除订单失败");
      }
      await this.getOrderList();
      this.deleteDialog = false;
    },
  },
  async mounted() {
    await this.getOrderList();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/mixins.scss";

.card {
  @include card;
}
</style>
