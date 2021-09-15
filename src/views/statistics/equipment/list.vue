<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="监控点名称：">
          <el-input v-model.trim="listQuery.facility_name" placeholder="请输入监控点名称" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button type="primary" icon="iconfont icon-daochu1" @click="">导出信息</el-button>
      </div>
      <el-table v-loading="listLoading" :data="list" :height="tableHeight"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="设备名称" align="center" prop="facility_name"></el-table-column>
        <el-table-column label="巡查来源" align="center" prop="community_id_name"></el-table-column>
        <el-table-column label="所在位置" align="center" prop="address"></el-table-column>
        <el-table-column label="使用状态" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.status | filtersStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <el-button class="filter-item" type="primary" @click="handleView(scope.row)">设备详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
    <paraView :showDialog.sync="showViewDialog" :viewData="viewData"></paraView>
  </div>
</template>

<script>
  import {collectList, } from '@/api/monitor'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'equipmentList',
    directives: {waves},
    components: {
      Pagination,
      paraView
    },
    data() {
      return {
        showViewDialog:false,
        viewData:{},
        paraData:{},
        paraLoading:false,
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 16,
        list: [],
        listLoading: false,
        listQuery: {
          facility_name: '',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 190;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      this.getList();
    },
    methods: {

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        collectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      clickRow(row){
        this.$refs.tableList.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        console.log(val)
        this.rowInfo = val;
        if (val.length == 1) {
          this.updateBtn = false
          this.deleteBtn = false
          if(val[0].status == 0){
            this.enableBtn = false
            this.disableBtn = true
          }else{
            this.enableBtn = true
            this.disableBtn = false
          }
        } else {
          this.updateBtn = true
          this.deleteBtn = true
          this.enableBtn = true
          this.disableBtn = true
        }
      },

      handleView(row){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },


    }
  }
</script>
