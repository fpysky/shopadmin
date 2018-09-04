<template>
    <div class="app-container">
        <div style="width:75%;margin:0 auto;">
            <el-form :model="ruleForm" :rules="ruleRules" ref="ruleForm" label-width="200px">
                <el-form-item label="选择父分类：" prop="pid">
                    <el-select style="width:100%;" v-model="ruleForm.pid" placeholder="选择父分类">
                        <el-option v-for="item in rootClassify" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="submiting" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { productClassifies, getRootClassify, getClassify, updateClassify } from '@/api/productClassify'
export default {
    name:'productClassify',
    data(){
        return {
            ruleForm:{
                name:'',
                pid:0,
                id:0,
            },
            ruleRules:{
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                pid: [
                    { required: true, message: '请选择商品分类', trigger: 'change' }
                ],
            },
            submiting:false,
            rootClassify:[],
        }
    },
    created(){
        this.getRootClassify();
        this.getClassify();
    },
    methods:{
        getClassify(){
            let query = {id:this.$route.params.id};
            if(query.id){
                getClassify(query).then(res => {
                    this.ruleForm = res.data.list;
                }).catch(error => {});
            }
        },
        getRootClassify(){
            getRootClassify().then(res =>{
                this.rootClassify = res.data;
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submiting = true;
                    productClassifies(this.ruleForm).then(res => {
                        this.submiting = false;
                        this.$router.push({path:'/products/productClassify'});
                    }).catch(error => {
                        this.error = true;
                        this.errors = error.response.data.errors;
                        this.submiting = false;
                    });
                } else {
                    return false;
                }
            });
        },
    },
}
</script>
