<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="policeInfo" label="是否有火情">
        <template slot-scope="scope">
          <i class="el-icon-s-opportunity" :style="!Boolean(scope.row.policeInfo) ? 'color: #a8ec0a' : 'color: red;'"></i>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="type" label="仓库类型">
        <template slot-scope="scope">
              <div>{{ typeLabel(scope.row.type) }}</div>
            </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" />
      <el-table-column prop="userName" label="用户名称" >
        <template slot-scope="scope">
              <div>{{ scope.row.userName }}</div>
            </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" />
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','store:edit','store:del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation
            :data="scope.row"
            :permission="permission"
          />
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button v-if="isAdmin == true && Boolean(scope.row.policeInfo)" class="filter-item" size="mini" type="success" icon="el-icon-edit"
            @click="godown(scope.row)">
            火情已控制
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :warehouse-type="dict.warehouse_type" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import crudWarehouse from '@/api/warehouse/index'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Warehouse',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '仓库',
      url: 'api/store',
      crudMethod: { ...crudWarehouse }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['warehouse_type', 'store_info'],
  data() {
    return {
      isAdmin: false,
      permission: {
        add: ['admin', 'store:add'],
        edit: ['admin', 'store:edit'],
        del: ['admin', 'store:del']
      }
    }
  },
  mounted(){
    this.isAdmin = Boolean(Cookies.get('isAdmin'));
    console.log(this.isAdmin)
  },
  methods: {
    // 火情已控制
    godown(data) {
      data.policeInfo = false;
      crudWarehouse.edit(data).then(res => {
        this.$notify({
          title: '控制成功',
          message: `火情已正常`,
          type: 'success'
        });

      }).catch((e) => {
        this.$notify.error({
          title: '控制失败',
          message: e.message
        });
      })
    },
    typeLabel(data){
      for(let item of this.dict.warehouse_type){
        if(item.value == String(data)){
          return item.label
        }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-icon-s-opportunity{
  font-size: 50px;
}
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
