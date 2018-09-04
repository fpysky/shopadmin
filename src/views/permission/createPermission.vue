<template>
    <div class="app-container" style="width:50%;margin:20px auto;">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="权限层级:" prop="pid">
                <el-select v-model="ruleForm.pid" placeholder="--请选择层级--">
                    <el-option
                        v-for="item in pidOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限名称:" prop="name">
                <el-input v-model="ruleForm.name" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item label="图标:" prop="icon">
                <el-input v-model="ruleForm.icon" style="width:300px;"></el-input>
                <a target="_blank" href="http://fontawesome.dashgame.com/">不知道格式?</a>
            </el-form-item>
            <el-form-item label="权限路由:" prop="route">
                <el-input v-model="ruleForm.route" style="width:300px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { getPidOptions, permissions } from '@/api/permission'
export default {
    name:'createPermission',
    data(){
        return {
            ruleForm:{
                id:0,
                name:'',
                icon:'',
                route:'',
                pid:0,
            },
            rules: {
                name: [
                    {required: true, message: '请输入权限名称', trigger: 'blur'},
                ],
                route: [
                    {required: true, message: '请输入权限路由', trigger: 'blur'},
                ],
            },
            pidOptions:[],
        }
    },
    created(){ 
        if(this.$route.params.pidOptions){
            this.pidOptions = this.$route.params.pidOptions
        }
        let permission = this.$route.params.permission
        if(permission){
            this.ruleForm.id = permission.id
            this.ruleForm.name = permission.name
            this.ruleForm.icon = permission.icon
            this.ruleForm.route = permission.route
            this.ruleForm.pid = permission.pid
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    permissions(this.ruleForm).then(response => {
                        this.$message.success('操作成功')
                        this.$router.push({path:'/permission/permissions'})
                    }).catch(error => {
                        this.$message.warning(error.response.data.message);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>
