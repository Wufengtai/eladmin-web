<template>
  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
    <el-form-item label="仓库名称" prop="storeName">
      <el-autocomplete v-model="form.storeName" :fetch-suggestions="storequerySearchAsync" placeholder="请输入仓库名称"
        @select="storehandleSelect"></el-autocomplete>
    </el-form-item>
    <el-form-item label="用户名称" prop="userName">
      <el-autocomplete v-model="form.userName" :fetch-suggestions="userquerySearchAsync" placeholder="请输入用户名称"
        @select="userhandleSelect"></el-autocomplete>
    </el-form-item>
    <el-form-item label="货品名称" prop="userName">
      <el-autocomplete v-model="form.goodName" :fetch-suggestions="goodquerySearchAsync" placeholder="请输入货品名称"
        @select="goodhandleSelect"></el-autocomplete>
    </el-form-item>
    <el-form-item label="区域名称" prop="areaName">
      <el-autocomplete v-model="form.areaName" :fetch-suggestions="areaquerySearchAsync" placeholder="请输入区域名称"
        @select="areahandleSelect"></el-autocomplete>
    </el-form-item>
    <el-form-item label="总价格" prop="price">
      <el-input v-model="form.price" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="数量" prop="num">
      <el-input v-model="form.num" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="联系电话" prop="phone">
      <el-input v-model="form.phone" style="width: 370px;" />
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="form.address" style="width: 370px;" />
    </el-form-item>
    <el-form-item v-if="form.pid !== 0" label="保险状态" prop="status">
      <el-radio v-for="item in orderStatus" :key="item.id" v-model="form.status" :label="item.value === 'true'">
        {{ item.label }}
      </el-radio>
    </el-form-item>
  </el-form>
</template>

<script>
import { form } from '@crud/crud'
import { getAllStores } from '@/api/warehouse/index'
import { getAllUser } from '@/api/system/user'
import { getAllAreas } from '@/api/region/index'
import { getAllGood } from '@/api/good/index'
const defaultForm = {
  id: null,
  name: ''
}
export default {
  mixins: [form(defaultForm)],
  props: {
    orderStatus: {
      type: Array,
      required: true
    },
    orderProgress: {
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
        price: [
          { required: true, message: '请输入总价格', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择保险状态', trigger: 'blur' }
        ],
        progress: [
          { required: true, message: '请选择进度', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入数量', trigger: 'blur' }
        ],
        storeName: [
          { required: true, message: '请选择仓库', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        goodName: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        areaName: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() { },
  methods: {
    // 根据名称搜索相关内容
    storequerySearchAsync(queryString, cb) {
      getAllStores(queryString).then(res => {
        var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'name')) : res.content;
        clearTimeout(this.timeout);
        this.storeTimeout = setTimeout(() => {
          cb(results.map(item => { return { value: item.name, id: item.id } }));
        }, 2000 * Math.random());
      }).catch(() => { })
    },
    goodquerySearchAsync(queryString, cb) {
      getAllGood(queryString).then(res => {
        var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'name')) : res.content;
        clearTimeout(this.timeout);
        this.storeTimeout = setTimeout(() => {
          cb(results.map(item => { return { value: item.name, id: item.id } }));
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
          cb(results.map(item => { return { value: item.name, id: item.id } }));
        }, 2000 * Math.random());
      }).catch(() => { })
    },
    userquerySearchAsync(queryString, cb) {
      getAllUser(queryString).then(res => {
        var results = queryString ? res.content.filter(this.createStateFilter(queryString, 'nickName')) : res.content;
        clearTimeout(this.userTimeout);
        this.userTimeout = setTimeout(() => {
          cb(results.map(item => { return { value: item.nickName, id: item.id } }));
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
    goodhandleSelect(item) {
      this.form.goodId = item.id;
      this.form.goodName = item.value;
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
