<template>
  <div class="app-container">
    <div class="flex data_flex clr_white bold">
      <div class="flex-item flex flex-vertical" @click="handleClick(0)">
        <span class="data_icon block text-center mr_5"><i class="iconfont icon-xingxing f26"></i></span>
        <span class="f16">设备工作统计</span>
      </div>
      <div class="flex-item flex flex-vertical" @click="handleClick(1)">
        <span class="data_icon block text-center mr_5"><i class="iconfont icon-xiangqing f26"></i></span>
        <span class="f16">类型事件统计</span>
      </div>
      <div class="flex-item flex flex-vertical" @click="handleClick(2)">
        <span class="data_icon block text-center mr_5"><i class="iconfont icon-xiangqing f26"></i></span>
        <span class="f16">审核事件统计</span>
      </div>
      <div class="flex-item flex flex-vertical" @click="handleClick(3)">
        <span class="clr_white data_icon block text-center mr_5"><i class="iconfont icon-xiangqing f26"></i></span>
        <span class="f16">来源事件统计</span>
      </div>
    </div>
    <div v-show="activeIndex == 0">
      <div class="mt_20 mb_20">
        <el-form :inline="true" :model="listQuery" class="search_form">
          <el-form-item label="时间选择：" prop="name">
            <el-date-picker
              v-model="temp.name"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column label="智能设备" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="num"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </div>
    </div>
    <div v-show="activeIndex == 1">
      <div class="mt_20 mb_20">
        <el-form :inline="true" :model="listQuery" class="search_form">
          <el-form-item label="时间选择：" prop="name">
            <el-date-picker
              v-model="temp.name"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="num"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </div>
    </div>
    <div v-show="activeIndex == 2">
      <div class="mt_20 mb_20">
        <el-form :inline="true" :model="listQuery" class="search_form">
          <el-form-item label="时间选择：" prop="name">
            <el-date-picker
              v-model="temp.name"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="num"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </div>
    </div>
    <div v-show="activeIndex == 3">
      <div class="mt_20 mb_20">
        <el-form :inline="true" :model="listQuery" class="search_form">
          <el-form-item label="时间选择：" prop="name">
            <el-date-picker
              v-model="temp.name"
              clearable
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleCreate">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="num"></el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </div>
    </div>
    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insertProduct="getList"></paraView>

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
        activeIndex:0,
        showViewDialog:false,
        paraData:{},
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
        let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 460;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 460;
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
      handleClick(val){
        this.activeIndex = val;
      },
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

      resetList() {
        this.listQuery = {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        }
        this.getList();
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

    }
  }
</script>
<style lang="scss">
  @import './../../../styles/variables.scss';
  .data_flex{
    .flex-item{
      padding: 20px;
      border-radius: 5px;
      /*background: #0a275f !important;*/

      &:nth-child(1){
        background-image: linear-gradient(90deg, rgb(75,140,237), rgb(43,184,245));
        i{
          background-image:-webkit-linear-gradient(left,rgb(75,140,237), rgb(43,184,245));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          cursor:pointer;
        }
      }
      &:nth-child(2){
        margin: 0 10px;
        background-image: linear-gradient(90deg, rgb(244,183,32), rgb(254,205,0));
        i{
          background-image:-webkit-linear-gradient(left,rgb(244,183,32), rgb(254,205,0));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          cursor:pointer;
        }
      }
      &:nth-child(3){
        margin: 0 10px;
        background-image: linear-gradient(90deg, rgb(94,75,203), rgb(137,98,249));
        i{
          background-image:-webkit-linear-gradient(left,rgb(94,75,203), rgb(137,98,249));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          cursor:pointer;
        }
      }
      &:nth-child(4){
        background-image: linear-gradient(90deg, rgb(66,201,135), rgb(92,218,120));
        i{
          background-image:-webkit-linear-gradient(left,rgb(66,201,135), rgb(92,218,120));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          cursor:pointer;
        }
      }
    }
    .data_icon{
      width: 6vh;
      height: 6vh;
      line-height: 6vh;
      border-radius: 50%;
      margin-right: 10px;
      background: #fff;
    }
  }
</style>
