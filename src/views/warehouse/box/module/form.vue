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
        label="地址"
        prop="address"
      >
      <el-input
          v-model="form.address"
          style="width: 370px;"
        />
      </el-form-item>
      <el-form-item
        label="仓库类型"
        prop="type"
      >
      <el-radio-group v-model="form.type">
          <el-radio
            v-for="item in warehouseType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >{{ item.label }}</el-radio>
      </el-radio-group>
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
        label="联系方式"
        prop="phone"
      >
      <el-input
          v-model="form.phone"
          style="width: 370px;"
        />
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
import { getAllUser } from '@/api/system/user'
const defaultForm = {
  id: null,
  name: ''
}
export default {
  mixins: [form(defaultForm)],
  props: {
    warehouseType: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择用户', trigger: 'blur', type: 'number' }
        ],
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {},
  methods:{
    // 获取弹窗内用户数据
    userquerySearchAsync(queryString, cb) {
      getAllUser(queryString).then(res => {
          var results = queryString ? res.content.filter(this.createStateFilter(queryString)) : res.content;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results.map(item=>{ return {value: item.nickName, id: item.id}}));
          }, 3000 * Math.random());
        }).catch(() => { })
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.nickName.includes(queryString));
        };
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
