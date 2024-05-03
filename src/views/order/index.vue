<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;"
      @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="storeName" label="仓库名称" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="goodName" label="商品名称" />
      <el-table-column prop="areaName" label="区域名称" />
      <el-table-column prop="num" label="数量" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="updateBy" label="更新者" />
      <el-table-column prop="progress" label="进度">
        <template slot-scope="scope">
          <div>{{ typeLabel(scope.row.progress) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="保险状态" align="center">
        <template slot-scope="scope">
          <el-switch :disabled="true" v-model="scope.row.status" active-color="#409EFF" inactive-color="#F56C6C" />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column v-if="checkPer(['admin', 'order:edit', 'order:del'])" label="操作" width="130px" align="center"
        fixed="right">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button v-if="isAdmin == true && scope.row.progress == 2" class="filter-item" size="mini" type="success" icon="el-icon-edit"
            @click="godown(scope.row)">
            入库
          </el-button>
          <el-button v-if="isAdmin == true && scope.row.progress == 1" class="filter-item" size="mini" type="success" icon="el-icon-edit"
            @click="godown(scope.row)">
            出库
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :order-status="dict.order_status" :order-progress="dict.order_progress" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import crudOrder from '@/api/order/index'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Order',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '订单',
      url: `api/order/${Cookies.get('username')}`,
      crudMethod: { ...crudOrder }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['order_status', 'order_progress'],
  data() {
    return {
      isAdmin: true,
      permission: {
        add: ['admin', 'order:add'],
        edit: ['admin', 'order:edit'],
        del: ['admin', 'order:del']
      }
    }
  },
  mounted() {
    this.isAdmin = Boolean(Cookies.get('isAdmin'));
    console.log(this.isAdmin)
  },
  methods: {
    //入库
    godown(data) {
      if(data.progress == 1){
        data.progress = 0
      }else{
        data.progress = 1;
      }
      crudOrder.edit(data).then(res => {
        this.$notify({
          title: '入库成功',
          message: `该${data.goodName}货品入库成功`,
          type: 'success'
        });

      }).catch((e) => {
        this.$notify.error({
          title: '入库失败',
          message: e.message
        });
      })
    },
    typeLabel(data) {
      for (let item of this.dict.order_progress) {
        if (item.value == String(data)) {
          return item.label
        }
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
