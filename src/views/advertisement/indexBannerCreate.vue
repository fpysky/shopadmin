<template>
    <div class="app-container">
        <div style="width:75%;margin:0 auto;">
            <el-form :model="ruleForm" :rules="ruleRules" ref="ruleForm" label-width="200px">
                <el-form-item label="选择关联商品：" prop="product_id">
                    <el-select style="width:100%;" v-model="ruleForm.product_id" placeholder="选择关联商品">
                        <el-option v-for="item in products" :label="item.title" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传图片：" prop="image">
                    <el-upload
                        :action="uploadUrl"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :file-list="fileList"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="submiting" type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </el-form-item>
            </el-form>
            <el-dialog
                title="查看图片"
                :visible.sync="imageDialogVisible"
                width="80%"
                center>
                <img style="width:100%;" :src="ruleForm.image" alt="" />
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { indexBanners, updateIndexBanner, getIndexBanner } from '@/api/indexBanner' 
import { getSellProducts } from '@/api/product' 
export default {
    name:'indexBannerCreate',
    data(){
        return {
            ruleForm:{
                id:0,
                product_id:'',
                image:'',
            },
            products:[],
            ruleRules:{
                product_id: [
                    { required: true, message: '请选择关联商品', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请上传图片', trigger: 'blur' }
                ]
            },
            submiting:false,
            fileList:[],
            imageDialogVisible:false,
            uploadUrl:'',
        }
    },
    created(){
        this.getSellProducts()
        this.getIndexBanner()
        this.uploadUrl = process.env.BASE_API + '/api/admin/uploadImage'
    },
    methods:{
        getIndexBanner(){
            let id = this.$route.params.id;
            if(id){
                getIndexBanner(id).then(res => {
                    this.ruleForm = res.data.list;
                    this.ruleForm.image = process.env.BASE_API + this.ruleForm.image;
                    this.fileList.push({"url":this.ruleForm.image});
                }).catch(error => {});
            }
        },
        handleSuccess(response, file, fileList){
             this.ruleForm.image = process.env.BASE_API + file.response.path;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            this.imageDialogVisible = true
        },
        getSellProducts(){
            getSellProducts().then(res => {
                this.products = res.data.list
            }).catch(error => {
                this.$message.error(error.response.data.message);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submiting = true;
                    if(this.ruleForm.id == 0){
                        indexBanners(this.ruleForm).then(res => {
                            this.submiting = false;
                            this.$router.push({path:'/advertisement/indexBanner'});
                        }).catch(error => {
                            this.error = true;
                            this.errors = error.response.data.errors;
                            this.submiting = false;
                        });
                    }else{
                        updateIndexBanner(this.ruleForm).then(res => {
                            this.submiting = false;
                            this.$router.push({path:'/advertisement/indexBanner'});
                        }).catch(error => {
                            this.error = true;
                            this.errors = error.response.data.errors;
                            this.submiting = false;
                        });
                    }
                } else {
                    return false;
                }
            });
        },
    },
}
</script>
