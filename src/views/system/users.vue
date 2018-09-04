<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-input class="filter-item" style="width:160px;margin-right:10px" v-model="name" size="small" placeholder="用户名"></el-input>
            <el-button class="filter-item" @click="search" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
            <el-button class="filter-item" @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </div>
        <el-table v-loading="tableloading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" width="180" label="昵称">
            </el-table-column>
            <el-table-column prop="account" width="180" label="登陆账户">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" :disabled="scope.row.id == 1" @click="editFunc(scope.$index)" size="mini">编辑</el-button>
                    <el-button :disabled="scope.row.id == 1" @click="deleteFunc(scope.$index)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"
                :page-sizes="[50, 100, 150, 200]"
                :page-size="pSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!-- <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="管理员管理" name="first">
            <div>
                
            </div>
            
            
        </el-tab-pane>
        <el-tab-pane :label="labelName" name="second">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="用户名：" prop="name">
                    <el-input style="width:300px;" v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="登陆账户：" prop="account">
                    <el-input style="width:300px;" v-model="ruleForm.account"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：" prop="email">
                    <el-input style="width:300px;" v-model.email="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" label="密码：" prop="password">
                    <el-input type="password" style="width:300px;" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" label="确认密码：" prop="confirmPw">
                    <el-input type="password" style="width:300px;" v-model="ruleForm.confirmPw"></el-input>
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
        </el-tab-pane>
        </el-tabs> -->
    </div>
</template>
<script>
import { fetchList,getAllRole,getAdminRoles,adminers,update,deleteAdminer } from '@/api/adminer'
export default {
    data(){
        return {
            tableloading:false,
            name:'',
            labelName:'添加',
            isEdit:false,
            roles:[],
            activeName:'first',
            tableData:[],
            multipleSelection: [],
            page:1,
            pSize:50,
            total:0,
            ruleForm:{
                id:0,
                name:'',
                account:'',
                password:'',
                confirmPw:'',
                email:'',
                roles:[]
            },
            rules:{
                name: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                account: [
                    { required: true, message: '请输入帐户名', trigger: 'blur' }
                ],
                email: [
                    { type:'email', message: '请输入正确的电子邮箱', trigger: 'blur' }
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
        }
    },
    created(){
        this.getData()
    },
    methods:{
        addFunc(){
            this.$router.push({
                name:'/system/createUsers',
                query: {
                    t: +new Date()
                }
            })
        },
        handleSizeChange(val) {
            this.pSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getData();
        },
        search(){
            this.page = 1;
            this.getData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        deleteFunc(k){
            if(k == -1 && this.multipleSelection.length == 0){
                this.$message.warning('请至少选择一条记录');
            }else{
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    if(k == -1){
                        for(let i = 0;i < this.multipleSelection.length;i++){
                            ids.push(this.multipleSelection[i].id);
                        }
                    }else{
                        ids.push(this.tableData[k].id);
                    }
                    deleteAdminer(ids).then(response => {
                        this.$message.success('操作成功');
                        this.getData();
                    }).catch(error => {
                        this.$message.warning(error.response.data.message);
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
        resetData(){
            this.labelName = '添加';
            this.isEdit = false;
            this.resetForm('ruleForm');
        },
        editFunc(k){
            this.labelName = '编辑';
            this.isEdit = true;
            this.activeName = 'second';
            this.ruleForm.id = this.tableData[k].id;
            this.ruleForm.name = this.tableData[k].name;
            this.ruleForm.account = this.tableData[k].account;
            this.ruleForm.email = this.tableData[k].email;
            this.getAdminRoles(this.tableData[k].id);
        },
        editFunc(k){
            let params = {
                adminer:this.tableData[k],
                rolesList: this.role
            }
            this.$router.push({
                name:'/permission/createAdminer',
                params:params,
                query: {
                    t: +new Date()
                }
            })
        },
        handleClick(tab, event){
            if(this.activeName == 'first'){
                this.resetData();
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.ruleForm.id = 0;
        },
        getData(){
            this.tableloading = true;
            let query = {
                page:this.page,
                pSize:this.pSize,
                name:this.name
            };
            fetchList(query).then(response => {
                this.tableloading = false;
                this.tableData = response.data.list;
                this.total = response.data.total;
            }).catch(error => {
                this.tableloading = false;
                this.$message.warning(error.response.data.message);
            });
        },
    },
}
</script>

