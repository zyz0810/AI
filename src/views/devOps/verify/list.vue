<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="设备名称：">
          <el-select v-model="listQuery.status" placeholder="选择设备名称" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="违规类型：">
          <el-select v-model="listQuery.status" placeholder="选择违规类型" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件状态：">
          <el-select v-model="listQuery.status" placeholder="选择违规类型" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见：">
          <el-select v-model="listQuery.status" placeholder="选择违规类型" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件等级：">
          <el-select v-model="listQuery.status" placeholder="选择违规类型" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上报时间：" prop="name">
          <el-date-picker
            v-model="listQuery.yearChoose"
            clearable
            type="daterange"
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
        <el-button type="primary" icon="iconfont icon-daochu1" @click="">导出信息</el-button>
        <el-button type="primary" plain icon="iconfont icon-xiazai" @click="">下载图片</el-button>
        <div class="fr" @click="displayType = displayType == 'table'?'imgList':'table'">切换 </div>
      </div>
      <el-table v-loading="listLoading" :data="list" v-show="displayType=='table'" :height="tableHeight"
                element-loading-text="拼命加载中" fit ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80" align="center"></el-table-column>
        <el-table-column label="事件编号" align="center" prop="num"></el-table-column>
        <el-table-column label="违规类型" align="center" prop="name">
          <template slot-scope="scope">
            <span>{{scope.row.type | filtersType}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡查来源" align="center" prop="source">
          <template slot-scope="scope">
            <span>{{scope.row.source | filtersSource}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="center" prop="name"></el-table-column>
        <el-table-column label="报警点位" align="center" prop="address"></el-table-column>
        <el-table-column label="上报时间" align="center" prop="time"></el-table-column>
        <el-table-column label="事件状态" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.status | filtersStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.status | filtersStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="事件等级" align="center" prop="">
          <template slot-scope="scope">
            <span>{{scope.row.status | filtersStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" prop="time"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template slot-scope="scope">
            <!--            <el-button class="filter-item" type="primary" @click="handleView">详情</el-button>-->
            <i class="iconfont icon-xiangqing baseColor inlineBlock" @click="handleView"></i>
            <i class="iconfont icon-daochufffpx baseColor inlineBlock ml_10" @click="handleView"></i>
          </template>
        </el-table-column>
      </el-table>

      <ul class="img_list flex" style="height:537px;" v-if="displayType=='imgList'">
        <li v-for="(item,index) in list" :key="index">
          <div class="img_list_top clr_white">
            <img class="img_list_img" :src="item.image">
            <span class="block f15 type_tag">{{item.type | filtersType}}</span>
            <p class="f15 time">{{item.time}}</p>
          </div>
          <div class="weui-cell f15">
            <div class="weui-cell__bd">
              <p>报警点位：</p>
              <p>{{item.address}}</p>
            </div>
            <div class="weui-cell__ft">
              <span class="block baseColor bold state_type">{{item.status | filtersStatus}}</span>
            </div>
          </div>
          <div class="flex text-center img_list_operation f14 clr_white bold">
            <div class="flex-item"><i class="iconfont icon-shenhe"></i>审核</div>
            <div class="flex-item"><i class="iconfont icon-daochu"></i>导出</div>
          </div>
        </li>
      </ul>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList" class="text-right"/>
    </div>

    <paraView :showDialog.sync="showViewDialog" :viewData="viewData"></paraView>

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
        displayType:'table',
        showViewDialog:false,
        viewData:{},
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
        total: 16,
        parameterValueList: [{name: ''}],
        list: [{
          num:'AJ5551521133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:1,
          time:'2021-8-9 23:22:01',
          address:'文一路300号',
          source:1,
          name:'ST123456',
          status:1
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:0,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:2,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:3,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:1,
          name:'ST1234312',
          status:0
        },{
          num:'AJ5551521133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:1,
          time:'2021-8-9 23:22:01',
          address:'文一路300号',
          source:1,
          name:'ST123456',
          status:1
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:0,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:2,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:3,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:1,
          name:'ST1234312',
          status:0
        },{
          num:'AJ5551521133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:1,
          time:'2021-8-9 23:22:01',
          address:'文一路300号',
          source:1,
          name:'ST123456',
          status:1
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:0,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:2,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:3,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:1,
          name:'ST1234312',
          status:0
        },{
          num:'AJ5551521133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:1,
          time:'2021-8-9 23:22:01',
          address:'文一路300号',
          source:1,
          name:'ST123456',
          status:1
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:0,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:2,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:0,
          name:'ST1234312',
          status:0
        },{
          num:'AJ3542221133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:3,
          time:'2021-6-12 13:22:01',
          address:'文一路356号',
          source:1,
          name:'ST1234312',
          status:0
        },],
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
        dialogStatus: '',
        rules: {
          name: [{required: true, message: '请输入名称', trigger: 'change'}],
        },
        tableHeight:'100'
      }
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {0: '未审核', 1: '已审核'}
        return StatusArr[value]
      },
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
      filtersSource: function (value) {
        let StatusArr = {0: '其它', 1: '滨康二区',}
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



      handleView(row){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },


    }
  }
</script>
