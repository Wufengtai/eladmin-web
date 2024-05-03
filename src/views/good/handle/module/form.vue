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
        label="规格"
        prop="specifications"
      >
      <el-input
          v-model="form.specifications"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="数量"
        prop="num"
      >
      <el-input
          v-model="form.num"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="仓库名称"
        prop="storeName"
      >
        <el-autocomplete
          v-model="form.storeName"
          :fetch-suggestions="storequerySearchAsync"
          placeholder="请输入仓库名称"
          @select="storehandleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="区域名称"
        prop="areaName"
      >
      <el-autocomplete
          v-model="form.areaName"
          :fetch-suggestions="areaquerySearchAsync"
          placeholder="请输入区域名称"
          @select="areahandleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="用户名称"
        prop="userName"
      >
      <el-autocomplete
          v-model="form.userName"
          :fetch-suggestions="userquerySearchAsync"
          placeholder="请输入用户名称"
          @select="userhandleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item
        label="预警数"
        prop="warningNum"
      >
      <el-input
          v-model="form.warningNum"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
      >
      <el-radio
          v-for="item in goodType"
          :key="item.id"
          v-model="form.type"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>
      <el-form-item
        label="价格"
        prop="price"
      >
      <el-input
          v-model="form.price"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        v-if="form.pid !== 0"
        label="状态"
        prop="status"
      >
        <el-radio
          v-for="item in goodStatus"
          :key="item.id"
          v-model="form.status"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
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
import { getAllUser } from '@/api/system/user'
import { getAllAreas } from '@/api/region/index'
const defaultForm = {
  id: null,
  name: ''
}
export default {
  mixins: [form(defaultForm)],
  props: {
    goodStatus: {
      type: Array,
      required: true
    },
    goodType: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      storeTimeout: null,
      areaTimeout: null,
      userTimeout: null,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        storeName: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择区域', trigger: 'blur', type: 'number' }
        ],
        userId: [
          { required: true, message: '请选择区域', trigger: 'blur', type: 'number' }
        ],
        specifications: [
          { required: true, message: '请输入规格', trigger: 'blur' }
        ],
      }
    }
  },
  mounted() {},
  methods:{
    // 根据名称搜索相关内容
      storequerySearchAsync(queryString, cb) {
        getAllStores(queryString).then(res => {
          var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'name')) : res.content;
          clearTimeout(this.timeout);
          this.storeTimeout = setTimeout(() => {
            cb(results.map(item=>{ return {value: item.name, id: item.id}}));
          }, 2000 * Math.random());
        }).catch(() => { })
      },
      areaquerySearchAsync(queryString, cb) {
        getAllAreas(queryString, this.form.storeId).then(res => {
          console.log('区域开始')
          var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'name')) : res.content;
          console.log(results)
          clearTimeout(this.areaTimeout);
          this.areaTimeout = setTimeout(() => {
            cb(results.map(item=>{ return {value: item.name, id: item.id}}));
          }, 2000 * Math.random());
        }).catch(() => { })
      },
      userquerySearchAsync(queryString, cb) {
        getAllUser(queryString).then(res => {
          var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'nickName')) : res.content;
          clearTimeout(this.userTimeout);
          this.userTimeout = setTimeout(() => {
            cb(results.map(item=>{ return {value: item.nickName, id: item.id}}));
          }, 2000 * Math.random());
        }).catch(() => { })
      },
      createStateFilter(queryString, key) {
        return (state) => {
          return (state[key].includes(queryString));
        };
      },
      storehandleSelect(item) {
        this.form.storeId = item.id;
        this.form.storeName = item.value;
      },
      areahandleSelect(item) {
        this.form.areaId = item.id;
        this.form.areaName = item.value;
      },
      userhandleSelect(item) {
        this.form.userId = item.id;
        this.form.userName = item.value;
      },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
