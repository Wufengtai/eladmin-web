<template>
    <div class="app-container">
        <el-row>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    <button class="animated-button" @click="bookAppointment">
                        预约
                    </button>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">
                    <input class="icInput" type="text" v-model="ic" placeholder="点击数字键输入身份证">
                </div>

                <div class="grid-content bg-purple-light">
                    <div class="keypad">
                        <template v-for="(item, index) in keypadNumbers">
                            <button class="keypad-button" @click="inputNumber(item)">
                                {{ item }}
                            </button>
                            <!-- 添加换行判断 -->
                            <div v-if="(index + 1) % 3 === 0" class="keypad-row-break"></div>
                        </template>
                    </div>
                </div>
                <div class="grid-content">
                    <button class="animated-button" @click="submitInput">
                        提货
                    </button>
                    <button class="animated-button" style="margin-left: 100px;" @click="reset">
                        重置
                    </button>
                </div>
            </el-col>
        </el-row>
        <el-dialog append-to-body :close-on-click-modal="false" :before-close="handleClose" :visible="visible"
            :title="title" width="500px">
            <!--表单渲染-->
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
                <el-form-item label="仓库名称" prop="storeName">
                    <el-autocomplete v-model="form.storeName" :fetch-suggestions="storequerySearchAsync"
                        placeholder="请输入仓库名称" @select="storehandleSelect"></el-autocomplete>
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
                    <el-radio v-for="item in dict.order_status" :key="item.id" v-model="form.status"
                        :label="item.value === 'true'">
                        {{ item.label }}
                    </el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="text" @click="handleClose">
                    取消
                </el-button>
                <el-button :loading="crud.status.cu === 2" type="primary" @click="submit">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import Cookies from 'js-cookie'
import { appoint, getGood } from '@/api/onlineOrder/index'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
import { getAllStores } from '@/api/warehouse/index'
import { getAllUser } from '@/api/system/user'
import { getAllAreas } from '@/api/region/index'
import { getAllGood } from '@/api/good/index'
export default {
    name: 'OnlineHandle',
    components: { crudOperation, eForm, pagination, udOperation },
    cruds() {
        return CRUD({
            title: '线上订单处理',
            url: `api/order/${Cookies.get('username')}`,
            crudMethod: {  }
        })
    },
    mixins: [presenter()],
    // 数据字典
    dicts: ['order_status', 'order_progress'],
    data() {
        return {
            form: {},
            title: '预约',
            visible: false,
            ic: "",
            keypadNumbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'X'],
            storeTimeout: null,
            areaTimeout: null,
            userTimeout: null,
            rules: {}
        }
    },
    methods: {
        // 预约
        submit() {
            this.form.progress = 2;
            appoint(this.form).then(() => {
                this.$notify({
                    title: '预约成功',
                    message: '稍后区域管理员将与你确认',
                    type: 'success'
                });
            }).catch(() => {
                this.$notify.error({
                    title: '预约失败',
                    message: '请联系该区域管理员'
                });
            })
            this.visible = false;
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.visible = false;
                    done();
                })
                .catch(_ => { });
        },
        inputNumber(num) {
            this.ic += num.toString();
        },
        // 确认提交
        submitInput() {
            getGood(this.ic).then(res => {
                if(res.length > 0){
                    this.$notify({
                    title: '提货成功',
                    message: '该用户对应的仓门已打开',
                    type: 'success'
                });
                }else{
                    this.$notify.error({
                    title: '提货失败',
                    message: '该用户没有货品待取'
                });
                }
                
            }).catch((e) => {
                this.$notify.error({
                    title: '提货失败',
                    message: e.message
                });
             })
            this.reset();
        },
        // 重置提交
        reset() {
            this.ic = "";
        },
        bookAppointment() {
            console.log('预约按钮被点击');
            this.visible = true;
            // 这里可以添加你的预约逻辑  
        },
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

.icInput {
    width: 30%;
    height: 70px;
}

.keypad {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中（如果需要的话）*/
}

.keypad-button {
    /* 设置按钮样式 */
    flex: 0 0 calc(33.33% - 10px);
    /* 假设每个按钮占1/3宽度减去间距 */
    margin: 5px;
    height: 70px;
}

.keypad-row-break {
    width: 100%;
    /* 确保换行 */
    height: 0;
    /* 不占据空间 */
    visibility: hidden;
    /* 隐藏元素 */
}

.app-container {
    background-image: url('~@/assets/images/background.jpeg');
    /* 确保图片覆盖整个元素 */
    background-size: cover;

    /* 不重复背景图片 */
    background-repeat: no-repeat;

    /* 总是显示背景图片 */
    background-attachment: fixed;

    /* 确保元素填满整个容器 */
    width: 100%;
    height: 100vh;
    /* 视口高度，或者你可以使用其他值如height: 100%; */
}

.animated-button {
    padding: 15px 30px;
    font-size: 100px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-size: 200% 100%;
    animation: Gradient 2s ease infinite;
    background-image: linear-gradient(45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    color: white;
    transition: all 0.3s ease-in-out;
    font-weight: bold;
    text-transform: uppercase;
    margin-top: 10%;
    min-width: 200px;
}

@keyframes Gradient {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animated-button:hover {
    background-position: 50% 50%;
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 0 5px rgba(255, 255, 255, 0.1);
}

.animated-button:active {
    background-color: #666;
    background-image: none;
    box-shadow: none;
    text-shadow: none;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.grid-content {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    min-height: 36px;
    margin-top: 20px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
  