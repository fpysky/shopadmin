<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button  @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
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
        this.getAllRole()
    },
    methods:{
        getAllRole(){
            getAllRole().then(response => {
                this.roles = response.data.list;
            }).catch(function (error) {
                console.log(error);
            });
        },
        addFunc(){
            let params = {
                roles: this.roles
            }
            this.$router.push({
                name:'/permission/createUsers',
                params:params,
                query: {
                    t: +new Date()
                }
            })
        },
        editFunc(k){
            let params = {
                adminer:this.tableData[k],
                roles: this.roles
            }
            this.$router.push({
                name:'/permission/createUsers',
                params:params,
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
        getData(){
            this.tableloading = true
            fetchList({
                page:this.page,
                pSize:this.pSize,
                name:this.name
            }).then(response => {
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

