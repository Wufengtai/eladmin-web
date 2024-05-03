<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model="form.name"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="仓库编号"
        prop="storeName"
      >
        <el-autocomplete
          v-model="form.storeName"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入仓库名称"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { form } from '@crud/crud'
import { getAllStores } from '@/api/warehouse/index'
const defaultForm = {
  id: null,
  name: ''
}
export default {
  mixins: [form(defaultForm)],
  props: {},
  components: {},
  data() {
    return {
      stores: [],
      timeout:  null,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        storeName: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {},
  methods:{
    // 根据名称搜索仓库
    async querySearchAsync(queryString, cb) {
        getAllStores(queryString).then(res => {
          this.stores = res.content
          var results = queryString ? this.stores.filter(this.createStateFilter(queryString)) : this.stores;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results.map(item=>{ return {value: item.name, id: item.id}}));
          }, 3000 * Math.random());
        }).catch(() => { })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.includes(queryString));
        };
      },
      handleSelect(item) {
        this.form.storeId = item.id;
        this.form.storeName = item.value;
      },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
