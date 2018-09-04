<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-button @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button @click="getData" size="mini" icon="el-icon-refresh">刷新</el-button>
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
                prop="image"
                label="imageUrl"
                width="500">
                <template slot-scope="scope">
                    <img style="width:500px;height:100px;" :src="scope.row.image" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <!-- <el-button @click="editFunc(scope.$index)" type="primary" size="mini">编辑</el-button> -->
                    <el-button @click="deleteFunc(scope.$index)" type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
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
</template>
<script>
import { fetchList, deleteProduct } from '@/api/indexBanner'
export default {
    name:'indexBanner',
    data(){
        return {
            page:1,
            total:0,
            pSize:50,
            multipleSelection:[],
            tableData:[],
            tableloading:false,
        }
    },
    created(){
        this.getData();
    },
    methods:{
        editFunc(k){
            let id = this.tableData[k].id;
            this.$router.push({
                name:'/advertisement/indexBanner/indexBannerCreate',
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
        handleSizeChange(val){
            this.pSize = val
            this.getData()
        },
        addFunc(){
            this.$router.push({
                name:'/advertisement/indexBanner/indexBannerCreate',
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
                    deleteIndexBanner(ids).then(response => {
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
        getData(){
            this.tableloading = true
            fetchList({
                page:this.page,
                pSize:this.pSize
            }).then(response => {
                this.tableloading = false
                this.tableData = response.data.list
                this.tableData.forEach((item,index) => {
                    item.image = process.env.BASE_API + item.image
                })
                this.total = response.data.total
            }).catch(error => {
                this.tableloading = false
                this.$message.warning(error.response.data.message)
            });
        },
    }
}
</script>
