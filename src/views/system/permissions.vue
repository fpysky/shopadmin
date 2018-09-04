<template>
    <div class="app-container">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="权限管理" name="first">
            <div>
                <el-button @click="deleteFunc(-1)" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                <el-input style="width:160px;" v-model="name" size="small" placeholder="用户名"></el-input>
                <el-button @click="search" type="primary" size="mini" icon="el-icon-search">搜索</el-button>
            </div>
            <el-table :height="h" :data="tableData" v-loading="tableloading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="name" label="权限名称">
                </el-table-column>
                <el-table-column prop="route" label="权限路由">
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="editFunc(scope.$index)" type="text" size="small">编辑</el-button>
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
        </el-tab-pane>
        <el-tab-pane :label="labelName" name="second">
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
        </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import { fetchList } from '@/api/permission'
import { getPidOptions } from '@/api/permission'
import { permissions } from '@/api/permission'
import { update } from '@/api/permission'
import { deletePermission } from '@/api/permission'
export default {
    data(){
        return {
            isEdit:false,
            labelName:'添加',
            activeName:'first',
            tableData:[],
            tableloading:false,
            pidOptions:[],
            h:700,
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
        this.getData(); 
        this.getPidOptions();
    },
    methods:{
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
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.id == 0){
                        permissions(this.ruleForm).then(response => {
                            this.$message.success('操作成功');
                            this.getData();
                            this.activeName = 'first';
                            this.resetData();
                        }).catch(error => {
                            this.$message.warning(error.response.data.message);
                        });
                    }else{
                        update(this.ruleForm).then(response => {
                            this.$message.success('操作成功');
                            this.getData();
                            this.activeName = 'first';
                            this.resetData();
                        }).catch(error => {
                            this.$message.warning(error.response.data.message);
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        editFunc(k){
            this.labelName = '编辑';
            this.isEdit = true;
            this.activeName = 'second';
            this.ruleForm.id = this.tableData[k].id;
            this.ruleForm.name = this.tableData[k].name;
            this.ruleForm.route = this.tableData[k].route; 
            this.ruleForm.pid = this.tableData[k].pid;
            this.ruleForm.icon = this.tableData[k].icon;
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
        resetData(){
            this.labelName = '添加';
            this.isEdit = false;
            this.resetForm('ruleForm');
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

