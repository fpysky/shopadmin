<template>
    <div class="app-container">
        <div style="width:75%;margin:0 auto;">
            <el-form :model="productForm" :rules="productRules" ref="productForm" label-width="100px">
                <el-form-item label="商品名称：" prop="title">
                    <el-input v-model="productForm.title" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品分类：" prop="product_classify_id">
                    <el-select style="width:100%;" v-model="productForm.product_classify_id" placeholder="商品分类">
                        <el-option v-for="item in secondRootClassify" :label="item.name" :key="item.id" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="封面图片：" prop="image">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="productForm.image" :src="productForm.image" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="商品描述：">
                    <template>
                        <div class="editor-container">
                            <Tinymce :height=400 ref="editor" v-model="productForm.description" />
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="是否上架：" prop="on_sale">
                    <el-switch v-model="productForm.on_sale"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="submiting" type="primary" @click="submitForm('productForm')">确定</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { getSecondRootClassify } from '@/api/productClassify'
import { products } from '@/api/product'
import Tinymce from '@/components/Tinymce'
export default {
    name:'create',
    components: { Tinymce },
    data(){
        return {
            productForm:{
                title:'',
                product_classify_id:'',
                image:'',
                description:'',
                on_sale:false,
            },
            productRules:{
                title: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                product_classify_id: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ],
                image: [
                    { required: true, message: '请上传封面图', trigger: 'blur' }
                ],
            },
            secondRootClassify:[],
            imageUrl:'',
            error:false,
            errors:{},
            submiting:false,
            uploadUrl:'',
        }
    },
    created(){
        this.uploadUrl = process.env.BASE_API + '/api/admin/uploadImage'
        this.getSecondRootClassify();
    },
    methods:{
        handleAvatarSuccess(res, file) {
            this.productForm.image = process.env.BASE_API + file.response.path;
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        getSecondRootClassify(){
            getSecondRootClassify().then(res =>{
                this.secondRootClassify = res.data;
            });
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.imageDialogImageUrl = file.response.path;
            console.log(this.imageDialogImageUrl);
            this.imageDialogVisible = true;
        },
        handleSuccess(response, file, fileList){
            this.productForm.image = process.env.BASE_API + file.response.path;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submiting = true;
                    // console.log(this.productForm);return;
                    products(this.productForm).then(res => {
                        this.submiting = false;
                        this.$router.push({path:'/products/products'});
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
<style>
    input[type=file] {
         display: none;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>