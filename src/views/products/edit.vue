<template>
    <div class="app-container">
        <div style="width:84%;margin:0 auto;">
            <el-form :model="productForm" :rules="productRules" ref="productForm" label-width="140px">
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
                <el-form-item label="展示图：">
                    <p>
                        <el-input v-model="imagesValue" style="width:140px;" placeholder="输入颜色"></el-input>
                        <el-button icon="el-icon-plus" @click="addImages(imagesValue)">添加</el-button>
                        <el-button @click="updateColor" :type="updateColorStatus?'primary':'danger'" v-text="updateColorStatus?'已保存':'未保存'"></el-button> <span style="color:#F56C6C">(需要保存才能执行添加sku操作)</span>
                    </p>
                    <p v-for="(item,index) in productForm.images" :key="index">
                        <el-tag v-text="item.value"></el-tag>
                        <el-upload
                            :action="uploadUrl"
                            list-type="picture-card"
                            :limit="4"
                            :file-list="item.images"
                            :on-preview="handlePictureCardPreview"
                            :on-success="((res, file, fileList) => { handleImagesSuccess(res, file,fileList, item) })"
                            :on-remove="((file, fileList) => { handleRemove(file, fileList, item) })">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </p>
                </el-form-item>
                <el-form-item label="商品描述(简短)：" prop="desc">
                     <el-input v-model="productForm.desc" placeholder="一句话描述"></el-input>
                </el-form-item>
                <el-form-item label="商品描述：">
                    <template>
                        <div class="editor-container">
                            <Tinymce :height=600 ref="editor" v-model="productForm.description" />
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="是否上架：" prop="on_sale">
                    <el-switch v-model="productForm.on_sale"></el-switch>
                </el-form-item>
                <el-form-item
                    v-for="(attributes, index) in productForm.attributes"
                    :label="'商品sku类别' + index + ':'"
                    :key="attributes.key"
                    :prop="'attributes.' + index + '.name'"
                    :rules="{required: true, message: '商品sku类别', trigger: 'blur'}">
                    <el-input :disabled="updateAttributesStatus || attributes.id != 0" placeholder="商品sku类别 示例：内存组合、网络制式" style="width:60%;" v-model="attributes.name"></el-input><el-button style="margin-left:10px;" @click.prevent="removeAttribute(attributes)">删除</el-button>
                    <el-button :disabled="updateAttributesStatus || attributes.id != 0" :type="updateAttributesStatus || attributes.id != 0?'primary':'danger'" v-text="updateAttributesStatus || attributes.id != 0?'已保存':'未保存'" @click="saveAttribute(attributes)"></el-button><span v-if="attributes.id == 0 " style="color:#F56C6C"> (需要保存才能执行添加sku操作)</span>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-plus" :disabled="!updateColorStatus" @click="addAttribute">新增商品sku类别</el-button>
                </el-form-item>
                <el-form-item
                    v-for="(sku, index) in productForm.sku"
                    :key="sku.key"
                    :label="'商品sku' + index + ':'">
                    <p><span>名称：</span> <el-input placeholder="名称" style="width:70%;" v-model="sku.title"></el-input></p>
                    <p><span>描述：</span> <el-input placeholder="描述" style="width:70%;" v-model="sku.description"></el-input></p>
                    <p><span>价格：</span> <el-input placeholder="价格" style="width:70%;" v-model="sku.price"></el-input></p>
                    <p><span>库存：</span> <el-input placeholder="库存" style="width:70%;" v-model="sku.stock"></el-input></p>
                    <p><span>颜色：</span>
                        <el-select style="width:70%;" v-model="sku.color" placeholder="请选择颜色">
                            <el-option
                                v-for="item in productForm.images"
                                :key="item.value"
                                :label="item.value"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </p>
                    <p v-for="(item,attributes_k) in productForm.sku[index].attributes" :key="attributes_k">
                        <span v-text="item.name + '：'"></span> <el-input :placeholder="item.name" style="width:70%;" v-model="item.value"></el-input>
                    </p>
                    <el-button style="margin-left:10px;" @click.prevent="removeSku(sku)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-plus" :disabled="!updateColorStatus || !updateAttributesStatus" @click="addSku">新增商品sku</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="submiting" type="primary" @click="submitForm('productForm')">确定</el-button>
                </el-form-item>
            </el-form>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import { getSecondRootClassify } from '@/api/productClassify'
import { getAttributes, saveAttribute, deleteAttributes, getProduct, updateColor, updateProducts, deleteSku } from '@/api/product'
export default {
    name:'edit',
    components: { Tinymce },
    data(){
        return {
            productForm:{
                id:this.$route.params.id,
                title:'',
                product_classify_id:'',
                image:'',
                description:'',
                on_sale:false,
                attributes: [{
                    id:0,
                    product_id:this.$route.params.id,
                    name: '',
                }],
                sku:[],
                colorAttribute:{},
                images:[],
                desc:'',
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
                desc: [
                    { required: true, message: '请输入商品简介(简短)', trigger: 'blur' }
                ],
            },
            secondRootClassify:[],
            imageUrl:'',
            error:false,
            errors:{},
            submiting:false,
            dialogImageUrl: '',
            dialogVisible: false,
            fileList:{},
            imagesValue:'',
            uploadUrl:'',
            updateColorStatus:false,
            updateAttributesStatus:false,
        }
    },
    created(){
        this.getSecondRootClassify()
        this.getProduct()
        this.getAttributes()
        this.uploadUrl = process.env.BASE_API + '/api/admin/uploadImage'
    },
    methods:{
        updateColor(){
            this.updateColorStatus = true
            let images = []
            this.productForm.images.forEach(item => {
                let img = []
                item.images.forEach(imgItem => {
                    img.push({url: imgItem.url})
                })
                images.push({
                    value: item.value,
                    images: img
                })
            })
            updateColor({
                id:this.productForm.id,
                images: images
            }).then(res => {
                this.$message.success('添加颜色成功')
            }).catch(error =>{
                this.$message.warning(error.response.data.message)
            });
        },
        handleImagesSuccess(res, file,fileList,images){
            images.images.push({"url":process.env.BASE_API + res.path})
            this.updateColorStatus = false
        }, 
        handleRemove(file, fileList,item) {
            item.images.splice(item.images.length-1)
            this.updateColorStatus = false
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        addSku(){
            this.productForm.attributes.forEach((item,index)=>{
                item.value = '';
            });
            let attributes = JSON.parse(JSON.stringify(this.productForm.attributes));
            this.productForm.sku.push({
                id:0,
                title: '',
                description:'',
                price:0.00,
                stock:0,
                color:'',
                product_id:this.$route.params.id,
                attributes:attributes,
                images:[],
            });
        },
        addImages(value){ 
            this.productForm.images.push({
                value:value,
                images:[],
            })
            this.imagesValue = ''
        },
        removeSku(item){
            // console.log(item)
            if(item.id != 0){
                this.deleteSku(item.id)
            }
            let index = this.productForm.sku.indexOf(item)
            if (index !== -1) {
                this.productForm.sku.splice(index, 1)
            }
        },
        deleteSku(id){
            deleteSku({id:id}).then(res => {
                this.$message.success('删除sku成功')
            }).catch(error => {
                this.$message.warning(error.response.data.message)
            })
        },
        deleteAttributes(attributes){
            deleteAttributes(attributes.id).then(res => {
                this.$message.success(res.data.message)
            });
        },
        getAttributes(){
            getAttributes(this.productForm.id).then(res => {
                this.productForm.attributes = res.data.list
                if(this.productForm.attributes.length > 0){
                    this.updateAttributesStatus = true
                }
            })
        },
        saveAttribute(attributes){
            this.updateAttributesStatus = true
            saveAttribute(attributes).then(res => {
                this.productForm.attributes.forEach((item,index) => {
                    if(item.name == res.data.list.name){
                        item.id = res.data.list.id
                    }
                })
                this.$message.success('保存成功')
            }).catch(error => {
                this.$message.warning('已保存或名字重复!');
            });
        },
        addAttribute(){
            this.updateAttributesStatus = false
            this.productForm.attributes.push({
                id:0,
                name: '',
                product_id:this.$route.params.id,
            });
        },
        removeAttribute(item) {
            if(item.id != 0){
                this.deleteAttributes(item)
            }else{
                this.updateAttributesStatus = true
            }
            let index = this.productForm.attributes.indexOf(item)
            if (index !== -1) {
                this.productForm.attributes.splice(index, 1)
            }
        },
        getProduct(){
           getProduct(this.productForm.id).then(res => {
                this.productForm.id = res.data.list.product.id
                this.productForm.title = res.data.list.product.title
                this.productForm.desc = res.data.list.product.desc
                this.productForm.product_classify_id = res.data.list.product.product_classify_id
                this.productForm.image = process.env.BASE_API + res.data.list.product.image
                this.productForm.images = res.data.list.product.images
                this.productForm.images.forEach(item => {
                    item.images.forEach(img => {
                        img.url = process.env.BASE_API + img.url
                    })
                })
                this.productForm.on_sale = res.data.list.product.on_sale
                this.productForm.sku = res.data.list.productSkus
                this.productForm.description = res.data.list.product.description
                if(this.productForm.images.length > 0){
                    this.updateColorStatus = true
                }
            })
            console.log(this.productForm)
        },
        handleAvatarSuccess(res, file) {
            this.productForm.image = file.response.path;
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
        handleSuccess(response, file, fileList){
            this.productForm.image = file.response.path;
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submiting = true;
                    updateProducts(this.productForm).then(res => {
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