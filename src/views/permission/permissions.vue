<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-button class="filter-item" @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-input class="filter-item" size="mini" style="width:160px;" v-model="name" placeholder="用户名"></el-input>
            <el-button class="filter-item" style="margin-left:10px;" @click="search" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table :data="tableData" v-loading="tableloading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="name" label="权限名称">
            </el-table-column>
            <el-table-column prop="route" label="权限路由">
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.id == 1 || scope.row.id == 2 || scope.row.id == 3 || scope.row.id == 4" @click="editFunc(scope.$index)" type="text" size="small">编辑</el-button>
                    <el-button :disabled="scope.row.id == 1 || scope.row.id == 2 || scope.row.id == 3 || scope.row.id == 4" @click="deleteFunc(scope.$index)" type="danger" size="mini">删除</el-button>
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
import { fetchList, getPidOptions, deletePermission  } from '@/api/permission'
export default {
    data(){
        return {
            tableData:[],
            tableloading:false,
            pidOptions:[],
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
            page:1,
            pSize:50,
            total:0,
            name:'',
            multipleSelection:[],
        }
    },
    created(){
        this.getData()
        this.getPidOptions()
    },
    methods:{
        addFunc(){
            this.$router.push({
                name:'/permission/createPermission',
                params:{pidOptions: this.pidOptions},
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
                    deletePermission(ids).then(response => {
                        this.$message.success('操作成功');
                        this.getData();
                    }).catch(error => {
                        this.$message.warning(error.response.data.message);
                    });
                }).catch(error => {
                    console.log(error);
                });
            }
        },
        search(){
            this.page = 1;
            this.getData();
        },
        getPidOptions(){
            getPidOptions().then(response => {
                this.pidOptions = response.data.list;
            }).catch(error => {
                console.log(error);
            });
        },
        editFunc(k){
            let params = {
                permission:this.tableData[k],
                pidOptions: this.pidOptions
            }
            this.$router.push({
                name:'/permission/createPermission',
                params:params,
                query: {
                    t: +new Date()
                }
            })
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

