<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-input class="filter-item" style="width:160px;margin-left:10px;" v-model="name" size="small" placeholder="查找"></el-input>
            <el-button style="margin-left:10px;" class="filter-item" @click="search" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
            <el-button class="filter-item" @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </div>
        <el-table v-loading="tableloading" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="ID"
                width="80">
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button @click="editFunc(scope.$index)" type="primary" size="mini">编辑</el-button>
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
import { fetchList, deleteProductClassify } from '@/api/productClassify'
export default {
    name:'productClassify',
    data(){
        return {
            name:'',
            page:1,
            total:0,
            pSize:50,
            tableData:[],
            tableloading:false,
            multipleSelection: [],
        }
    },
    created(){
        this.getData();
    },
    methods:{
        editFunc(k){
            let id = this.tableData[k].id;
            this.$router.push({
                name:'/products/createClassify',
                params:{id:id},
                query: {
                    t: +new Date()
                }
            })
        },
        handleCurrentChange(val) {
            this.page = val
            this.getData()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val){
            this.pSize = val
            this.getData()
        },
        addFunc(){
            this.$router.push({
                name:'/products/createClassify',
                query: {
                    t: +new Date()
                }
            })
        },
        deleteFunc(k){
            if(k == -1 && this.multipleSelection.length == 0){
                this.$message.warning('请至少选择一条记录')
            }else{
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = []
                    if(k == -1){
                        for(let i = 0;i < this.multipleSelection.length;i++){
                            ids.push(this.multipleSelection[i].id)
                        }
                    }else{
                        ids.push(this.tableData[k].id)
                    }
                    deleteProductClassify(ids).then(response => {
                        this.$message.success('操作成功')
                        this.getData()
                    }).catch(error => {
                        this.$message.warning(error.response.data.message)
                    })
                }).catch(function (error) {
                    console.log(error)
                });
            }
        },
        search(){
            this.page = 1
            this.getData()
        },
        getData(){
            this.tableloading = true
            fetchList({
                page:this.page,
                pSize:this.pSize,
                name:this.name
            }).then(response => {
                this.tableloading = false
                this.tableData = response.data.list
                this.total = response.data.total
            }).catch(error => {
                this.tableloading = false
                this.$message.warning(error.response.data.message)
            });
        },
    },
}
</script>

