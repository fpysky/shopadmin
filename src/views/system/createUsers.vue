<template>
    <div class="app-container" style="width:50%;margin:20px auto;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="昵称：" prop="name">
                <el-input style="width:300px;" placeholder="请输入昵称" v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="登陆账户：" prop="account">
                <el-input style="width:300px;" placeholder="请输入登陆账户" v-model="ruleForm.account"></el-input>
            </el-form-item>
            <el-form-item label="封面图片：" prop="avatar">
                <el-upload
                    class="avatar-uploader"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="电子邮箱：" prop="email">
                <el-input style="width:300px;" placeholder="请输入电子邮箱" v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item v-if="!isEdit" label="密码：" prop="password">
                <el-input type="password" placeholder="请输入密码" style="width:300px;" v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item v-if="!isEdit" label="确认密码：" prop="confirmPw">
                <el-input type="password" placeholder="请输入确认密码" style="width:300px;" v-model="ruleForm.confirmPw"></el-input>
            </el-form-item>
            <el-form-item label="角色分配：" prop="roles">
                <el-checkbox-group v-model="ruleForm.roles" size="small">
                    <el-checkbox v-for="item in roles" :label="item.id" :key="item.id" border><span v-text="item.name"></span></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getAllRole,getAdminRoles,adminers } from '@/api/adminer'
export default {
    name:'createUsers',
    data(){
        return {
            ruleForm:{
                id:0,
                name:'',
                account:'',
                password:'',
                confirmPw:'',
                email:'',
                roles:[],
                avatar:''
            },
            rules:{
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入帐户名', trigger: 'blur' }
                ],
                email: [
                    { type:'email', message: '请输入正确的电子邮箱', trigger: ['blur', 'change'] }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 17, message: '密码长度在6到17个字符', trigger: 'blur' }
                ],
                confirmPw: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { min: 6, max: 17, message: '密码长度在6到17个字符', trigger: 'blur' }
                ],
                roles: [
                    { required: true, message: '请选择角色', trigger: 'change' }
                ]
            },
            isEdit:false,
            roles:[],
            uploadUrl:'',
        }
    },
    created(){
        this.getAllRole()
        this.uploadUrl = process.env.BASE_API + '/api/admin/uploadImage'
    },
    methods:{
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        handleAvatarSuccess(res, file) {
            this.ruleForm.avatar = process.env.BASE_API + file.response.path
        },
        getAdminRoles(id){
            getAdminRoles(id).then(response => {
                this.ruleForm.roles = response.data.list;
            }).catch(error =>{
                console.log(error);
            });
        },
        getAllRole(){
            getAllRole().then(response => {
                this.roles = response.data.list;
            }).catch(function (error) {
                console.log(error);
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.password != this.ruleForm.confirmPw){
                        this.$message.warning('两次密码输入不一致！');
                        return;
                    }
                    adminers(this.ruleForm).then(response => {
                        this.$message.success('操作成功');
                        this.$router.push({path:'/system/users'});
                    }).catch(error => {
                        this.$message.warning(error.response.data.message);
                    });
                } else {
                    return false;
                }
            });
        },
    }
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
