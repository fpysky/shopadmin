<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button class="filter-item" @click="addFunc" size="mini" icon="el-icon-plus">添加</el-button>
            <el-input class="filter-item" style="width:160px;margin-left:10px" v-model="title" size="small" placeholder="查找"></el-input>
            <el-button class="filter-item" style="margin-left:10px;" @click="search" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
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
                prop="title"
                label="名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="on_sale"
                label="是否上架"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.on_sale" style="color:#67C23A">已上架</span>
                    <span v-else style="color:#909399">未上架</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="price"
                label="价格(￥)"
                width="180">
            </el-table-column>
            <el-table-column
                prop="rating"
                label="评分"
                width="180">
                <template slot-scope="scope">
                    <el-rate
                        v-model="scope.row.rating"
                        disabled
                        show-score
                        text-color="#ff9900"
                        score-template="{value}">
                    </el-rate>
                </template>
            </el-table-column>
            <el-table-column
                prop="sold_count"
                label="销量"
                width="180">
            </el-table-column>
            <el-table-column
                prop="review_count"
                label="评论数"
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
import { fetchList, deleteProduct } from '@/api/product'
export default {
    name:'products',
    data(){
        return {
            title:'',
            page:1,
            total:0,
            tableData:[],
            tableloading:false,
            pSize:50,
            multipleSelection: [],
        }
    },
    created(){
        this.getData();
    },
    methods:{
        addFunc(){
            this.$router.push({
                name:'/products/create',
                query: {
                    t: +new Date()
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        editFunc(k){
            let id = this.tableData[k].id;
            this.$router.push({
                name:'/products/edit',
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
        search(){
            this.page = 1
            this.getData()
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
                    deleteProduct(ids).then(response => {
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
                pSize:this.pSize,
                title:this.title
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