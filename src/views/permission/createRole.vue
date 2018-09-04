<template>
    <div class="app-container" style="width:50%;margin:20px auto;">
        <el-form style="width:30%;" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="角色名称：" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="角色授权:" prop="permissions">
                <el-checkbox-group v-model="ruleForm.permissions" size="small">
                    <el-checkbox v-for="item in permissions" :label="item.id" :key="item.id" border><span v-text="item.name"></span></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { roles, getRolePermission } from '@/api/role'
export default {
    name:'createRole',
    data(){
        return {
            ruleForm:{
                id:0,
                name:'',
                permissions:[]
            },
            rules:{
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                permissions:[
                    { required: true, message: '请选择权限', trigger: 'change' }
                ],
            },
            permissions:[]
        }
    },
    created(){
        if(this.$route.params.permissions){
            this.permissions = this.$route.params.permissions
        }
        let role = this.$route.params.role
        if(role){
            this.ruleForm.id = role.id
            this.ruleForm.name = role.name
            this.getRolePermission(role.id)
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    roles(this.ruleForm).then(response => {
                        this.$message.success('操作成功');
                        this.$router.push({path:'/permission/roles'});
                    }).catch(error => {
                        this.$message.warning(error.response.data.message);
                    });
                } else {
                    return false;
                }
            });
        },
        getRolePermission(id){
            getRolePermission({id:id}).then(response => {
                this.ruleForm.permissions = response.data.list;
            }).catch(error => {
                console.log(error);
            });
        },
    }
}
</script>
