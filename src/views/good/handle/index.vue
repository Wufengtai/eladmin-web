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
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="specifications" label="规格" />
      <el-table-column prop="num" label="数量" />
      <el-table-column prop="storeName" label="仓库名称" />
      <el-table-column prop="areaName" label="区域名称" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="warningNum" label="预警数" />
      <el-table-column prop="createBy" label="创建者" />
      <el-table-column prop="updateBy" label="更新者" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
              <div>{{ typeLabel(scope.row.type) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="status" label="上架状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" />
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['admin','good:edit','good:del'])"
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
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :good-status="dict.good_status" :good-type="dict.good_type" />
  </div>
</template>

<script>
import crudGood from '@/api/good/index'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Good',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '货品',
      url: 'api/good',
      crudMethod: { ...crudGood }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['good_type', 'good_status'],
  data() {
    return {
      permission: {
        add: ['admin', 'good:add'],
        edit: ['admin', 'good:edit'],
        del: ['admin', 'good:del']
      }
    }
  },
  mounted () {},
  methods: {
    typeLabel(data){
      for(let item of this.dict.good_type){
        if(item.value == String(data)){
          return item.label
        }
      }
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.good_status[val] + '" ' + data.name + '货品, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // eslint-disable-next-line no-undef
        crudGood.edit(data).then(() => {
          // eslint-disable-next-line no-undef
          this.crud.notify(this.dict.label.good_status[val] + '成功', 'success')
        }).catch(err => {
          data.status = !data.status
          console.log(err.data.message)
        })
      }).catch(() => {
        data.status = !data.status
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
