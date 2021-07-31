<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="选择辖区" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="运维类型" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="运维人员" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="处理状态" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model.trim="listQuery.name" placeholder="运维单号" @change="handleFilter" clearable/>
        </el-form-item>


        <el-form-item label="" prop="name">
          <el-date-picker v-model="listQuery.name" type="daterange" range-separator="zhi " start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>


        <el-form-item label="" prop="name">
          <el-input v-model.trim="listQuery.name" placeholder="输入餐企名称或简称" @change="handleFilter" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">新增信息</el-button>
        <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">导出信息</el-button>

      </div>
    </div>
    <el-table v-loading="listLoading" :data="list" :height="tableHeight" element-loading-text="拼命加载中" fit ref="tableList">
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column label="运单编号" align="center" prop="name"></el-table-column>
      <el-table-column label="餐企名称" align="center" prop="name"></el-table-column>
      <el-table-column label="设备名称" align="center" prop="name"></el-table-column>
      <el-table-column label="所属辖区" align="center" prop="address"></el-table-column>
      <el-table-column label="设备编号" align="center" prop="address"></el-table-column>
      <el-table-column label="运维类型" align="center" prop="address"></el-table-column>
      <el-table-column label="运维日期" align="center" width="140">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.time).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="运维人员" align="center" prop="address"></el-table-column>
      <el-table-column label="处理状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status | filtersStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <el-button class="filter-item" type="primary" @click="handleUpdate">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" class="text-right"/>
    <paraView :showDialog.sync="showViewDialog" :viewData="viewData" @insertProduct="getList"></paraView>

  </div>
</template>

<script>
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView
    },
    data() {
      return {
        showViewDialog:false,
        viewData:{},
        paraLoading:false,
        operationOption: [{
          id: 0,
          name: '下拉框'
        }, {
          id: 1,
          name: '复选框'
        }, {
          id: 2,
          name: '输入框'
        }],
        updateBtn: true,
        enableBtn: true,
        disableBtn: true,
        total: 0,
        parameterValueList: [{name: ''}],
        list: [{
          name:'列表1',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        },{
          name:'列表2',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        }],
        listLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        updateId: undefined,
        dialogFormVisible: false,
        temp: {
          // id: undefined,
          status: 1,
          name: '',
          orders: '',
          isRequired: 0,
          operatingMode: 0,
          parameterValueList: [],
        },
        textMap: {
          update: '编辑参数信息',
          create: '新增参数信息',
          view:'查看'
        },
        dialogStatus: '',
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '禁用', 1: '启用'}
        return StatusArr[value]
      },
      filtersMode: function (value) {
        let StatusArr = {0: '下拉框', 1: '复选框', 2: '输入框'}
        return StatusArr[value]
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 260;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 260;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      // this.getList();
    },
    methods: {

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      getList() {
        paraList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.count
        });
      },


      handleCreate() {

      },

      handleUpdate(row) {
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },



    }
  }
</script>
