<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-input class="filter-item" size="small"  style="width:170px;" v-model="name" placeholder="输入角色名称"></el-input>
            <el-button class="filter-item" style="margin-left:10px;" size="mini" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button class="filter-item" @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </div>
        <el-table v-loading="tableloading" :data="tableData" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column  prop="name" label="角色名称" width="220">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="eidtFunc(scope.$index)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteFunc(scope.$index)" type="danger" size="mini">删除</el-button>
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
import { fetchList, roles, update, deleteRole, getAllPermission } from '@/api/role'
export default {
    data(){
        return {
            permissions:[],
            isEdit:false,
            page:1,
            total:0,
            pSize:50,
            labelName:'添加',
            editing:false,
            tableloading:false,
            name:'',
            activeName:'first',
            tableData:[],
            ruleForm:{
                id:0,
                name:'',
                permissions:[]
            },
            rules:{
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
            },
            multipleSelection: []
        };
    },
    created(){
        this.getData()
        this.getAllPermission()
    },
    methods:{
        addFunc(){
            this.$router.push({
                name:'/permission/createRole',
                params:{permissions: this.permissions},
                query: {
                    t: +new Date()
                }
            })
        },
        getAllPermission(){
            getAllPermission().then(response => {
                this.permissions = response.data.list;
            }).catch(error => {
                console.log(error);
            });
        },
        handleSizeChange(val) {
            this.pSize = val;
            this.getData();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getData();
        },
        eidtFunc(k){
            let params = {
                role:this.tableData[k],
                permissions: this.permissions
            }
            this.$router.push({
                name:'/permission/createRole',
                params:params,
                query: {
                    t: +new Date()
                }
            })
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
                deleteRole(ids).then(response => {
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
        search(){
            this.page = 1;
            this.getData();
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

