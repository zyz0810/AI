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
    <div class="mt_20 mb_20">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="时间选择：">
          <el-date-picker
            v-model="dateTime"
            clearable
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-show="activeIndex == 0">

      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleExport">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="listData.point" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="智能设备" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="count"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="activeIndex == 1">
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleExport">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="listData.category" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="count"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="activeIndex == 2">
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleExport">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="listData.audited" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="count"></el-table-column>
        </el-table>
      </div>
    </div>
    <div v-show="activeIndex == 3">
      <div class="bg_white p20">
        <div class="mb_20">
          <el-button class="filter-item" type="primary" icon="el-icon-notebook-2" @click="handleExport">导出</el-button>
        </div>
        <el-table v-loading="listLoading" :data="listData.source" :header-cell-style="{background:'rgb(241,246,252)'}" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList">
          <el-table-column label="类型名称" align="center" prop="name"></el-table-column>
          <el-table-column label="事件数" align="center" prop="count"></el-table-column>
        </el-table>
      </div>
    </div>
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {earlyWarning} from '@/api/statistics'
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
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          start_time: '',
          end_time: '',
        },
        tableHeight:'100',
        listData:{},
        downLoadUrl:'',
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
      dateTime: {
        get() {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set(v) {
          this.listQuery.start_time = v[0];
          this.listQuery.end_time = v[1];
        },
      },
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
      this.getList();
    },
    methods: {
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'ai/Export/earlyWarning?start_time='+this.listQuery.start_time+'&end_time='+this.listQuery.end_time;
      },
      async handleExport(){
        await this.getUrl();
        document.getElementById("fileDownload").click();
      },
      handleClick(val){
        this.activeIndex = val;
      },
      getList() {
        earlyWarning(this.listQuery).then(res => {
          this.listData = res.data
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
