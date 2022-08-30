<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="监控点名称：">
          <el-input v-model.trim="listQuery.facility_name" placeholder="请输入监控点名称" autocomplete="off" clearable/>
        </el-form-item>
        <el-form-item label="违规类型：">
          <!--<el-select v-model="listQuery.category" placeholder="选择违规类型" @change="handleFilter">-->
            <!--<el-option label="启用" value="1"></el-option>-->
            <!--<el-option label="禁用" value="0"></el-option>-->
          <!--</el-select>-->
          <el-cascader ref="cascaderPublish" clearable v-model="listQuery.category_small" :options="categoryList" @change="changeCategory" :show-all-levels="false" filterable :props="props" placeholder="请选择违规类型"></el-cascader>

        </el-form-item>
        <el-form-item label="事件状态：">
          <el-select v-model="listQuery.status" placeholder="选择违规类型" clearable>
            <!--1: '未审核', 2: '已审核'-->
            <el-option label="未审核" :value="1"></el-option>
            <el-option label="已审核" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见：">
          <!--1: '立案', 2: '暂不立案',3: '在学习', 4: '结案'-->
          <el-select v-model="listQuery.is_audited" placeholder="选择违规类型" clearable>
            <el-option label="通过" :value="1"></el-option>
            <el-option label="不通过" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件等级：">
          <!--1: '一般案件', 2: '重大案件'-->
          <el-select v-model="listQuery.is_important" placeholder="选择违规类型" clearable>
            <el-option label="一般案件" :value="1"></el-option>
            <el-option label="重大案件" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间：" prop="name">
          <el-date-picker
            v-model="dateTime"
            clearable
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="p20 bg_white">
      <div class="mb_10">
        <el-button type="primary" icon="iconfont icon-daochu1" @click="handleExport">导出信息</el-button>
        <el-button type="primary" plain icon="iconfont icon-xiazai" @click="">下载图片</el-button>
        <div class="fr" @click="displayType = displayType == 'table'?'imgList':'table'"><img src="./../../../assets/image/display_icon.png"/> </div>
      </div>
      <el-table v-loading="listLoading" :data="list" v-show="displayType=='table'" :height="tableHeight"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="事件编号" align="center" prop="number_no"></el-table-column>
        <el-table-column label="违规类型" align="center" prop="category_big_name"></el-table-column>
        <el-table-column label="巡查来源" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.depart_id | filtersDepart}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="facility_name"></el-table-column>
        <el-table-column label="报警点位" align="center" prop="address"></el-table-column>
        <el-table-column label="上报时间" align="center" prop="collect_time">
          <template slot-scope="scope">
            <span>{{scope.row.collect_time?$moment(scope.row.collect_time).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件状态" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.status | filtersStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.is_audited | filtersAudited}}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件等级" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.is_important | filtersImportant}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="审核时间" align="center" prop="update_at">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.update_at?$moment(scope.row.update_at).format('YYYY-MM-DD HH:mm:ss'):''}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <!--            <el-button class="filter-item" type="primary" @click="handleView">详情</el-button>-->
            <i class="iconfont icon-xiangqing baseColor inlineBlock" @click="handleView(scope.row)"></i>
            <i class="iconfont icon-daochufffpx baseColor inlineBlock ml_10" @click=""></i>
          </template>
        </el-table-column>
      </el-table>

      <ul class="img_list flex" :style="{height:tableHeight+'px'}" v-if="displayType=='imgList'">
        <li v-for="(item,index) in list" :key="index">
          <div class="img_list_top clr_white">
            <img class="img_list_img" :src="item.alarm_original_pic">
            <span class="block f14 type_tag">{{item.category_big_name}}</span>
            <!--//事件状态-->
            <p class="f14 time">{{$moment(item.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
          </div>
          <div class="weui-cell f14">
            <div class="weui-cell__bd">
              <p>报警点位：</p>
              <p class="overflow_three mr_10">{{item.address}}</p>
            </div>
            <div class="weui-cell__ft">
              <span class="block baseColor bold state_type">{{item.status | filtersStatus}}</span>
            </div>
          </div>
          <div class="flex text-center img_list_operation f14 clr_white bold">
            <div class="flex-item pointer" @click="handleView(item)"><i class="iconfont icon-shenhe"></i>审核</div>
            <div class="flex-item pointer"><i class="iconfont icon-daochu"></i>导出</div>
          </div>
        </li>
      </ul>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                  @pagination="getList" class="text-right"/>
    </div>
<!--    <paraView :showDialog.sync="showViewDialog" :viewData="viewData"></paraView>-->
    <a v-show="false" :href="downLoadUrl" id="fileDownload"></a>
  </div>
</template>

<script>
  import {categoryList, collectList,} from '@/api/monitor'
  import {departTree, } from '@/api/category'
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
        props: {
          expandTrigger: "click",
          value: "id",
          label: "name",
          children: "parent_list",
          disabled: false,
        },
        categoryList:[],
        displayType:'imgList',
        showViewDialog:false,
        viewData:{},
        total: 0,
        list: [],
        listLoading: false,
        listQuery: {
          status:'',
          start_time:'',
          end_time:'',
          facility_name:'',
          category_big:'',
          category_small:'',
          is_audited:'',
          is_important:'',
          page: 1,
          pageSize: 10
        },
        tableHeight:'100',
        downLoadUrl:'',
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {1: '未审核', 2: '已审核'};
        return StatusArr[value]
      },
      filtersDepart: function (value) {
        let StatusArr = {1: '浦沿中队', 2: '长河中队',3: '西兴中队'};
        return StatusArr[value]
      },
      filtersAudited: function (value) {
        let StatusArr = {1: '通过', 2: '不通过',};
        return StatusArr[value]
      },
      filtersImportant: function (value) {
        let StatusArr = {1: '一般案件', 2: '重大案件'};
        return StatusArr[value]
      },
    },
    computed: {
      dateTime: {
        get () {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.listQuery.start_time = v[0];
            this.listQuery.end_time = v[1];
          } else {
            this.listQuery.start_time = "";
            this.listQuery.end_time = "";
          }
        },
      },
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
      this.getCategory();
    },
    methods: {
      changeCategory(val){
        this.listQuery.category_big = val[0];
        this.listQuery.category_small = val[1];
      },
      getCategory() {
        // departTree().then(res => {
        //   this.categoryList = this.getTreeData(res.data);
        // });
        categoryList({page:1,pageSize:99999,class:1}).then(res=>{
          this.categoryList = res.data.data

        });
      },
      getTreeData (data) {
        if (data != "" || data != null) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].child.length < 1) {
              // children若为空数组，则将children设为undefined
              // if (data[i].grade == 3) {
              //   data[i].childrens = undefined;
              // }
              data[i].child = undefined;
            } else {
              // children若不为空数组，则继续 递归调用 本方法
              this.getTreeData(data[i].child);
            }
          }
          return data;
        }
      },
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
        this.$router.push({path:'/statistics/intelligenceView',query: {id:row.id,status:row.status}})
      },
      // 导出
      getUrl(){
        this.downLoadUrl= this.global.domainName + 'ai/Export/collectList?status='+this.listQuery.status+'&start_time='+this.listQuery.start_time+'&end_time='+this.listQuery.end_time
          +'&facility_name='+this.listQuery.facility_name + '&category_big='+this.listQuery.category_big
          + '&category_small='+this.listQuery.category_small + '&is_audited='+this.listQuery.is_audited + '&is_important='+this.listQuery.is_important
          + '&page='+this.listQuery.page + '&pageSize='+this.listQuery.pageSize;
      },
      async handleExport(){
        await this.getUrl();
        document.getElementById("fileDownload").click();
      },
    }
  }
</script>
