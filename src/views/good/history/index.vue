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
        <el-table-column prop="storeName" label="仓库名称" />
        <el-table-column prop="areaName" label="区域名称" />
        <el-table-column prop="goodName" label="商品名称" />
        <el-table-column prop="userName" label="用户名称" />
        <el-table-column prop="num" label="数量" />
        <el-table-column prop="type" label="出入库类型">
          <template slot-scope="scope">
              <div>{{ typeLabel(scope.row.type) }}</div>
        </template>
        </el-table-column>
        <el-table-column prop="createBy" label="操作者" />
        <el-table-column prop="createTime" label="创建日期" />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </template>
  
  <script>
  import crudGoodHistory from '@/api/good/goodHistory'
  import eHeader from './module/header'
  import CRUD, { presenter } from '@crud/crud'
  import crudOperation from '@crud/CRUD.operation'
  import pagination from '@crud/Pagination'
  import udOperation from '@crud/UD.operation'
  export default {
    name: 'History',
    components: { eHeader, crudOperation, pagination, udOperation },
    cruds() {
      return CRUD({
        title: '出入库记录',
        url: 'api/goodHis',
        crudMethod: { ...crudGoodHistory },
        optShow: {
          add: false,
          edit: false,
          del: true,
          download: true,
          reset: true
        }
      })
    },
    mixins: [presenter()],
    // 数据字典
    dicts: ['goodHis_type'],
    data() {
      return {
        permission: {
          add: [],
          edit: [],
          del: ['admin', 'goodHis:del']
        }
      }
    },
    methods: {
    typeLabel(data){
      for(let item of this.dict.goodHis_type){
        if(item.value == String(data)){
          return item.label
        }
      }
    },
    }
  }
  </script>
  <style rel="stylesheet/scss" lang="scss" scoped>
   ::v-deep .el-input-number .el-input__inner {
      text-align: left;
    }
  </style>
