<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="历史信息"
    class="dialogContainer"
    @open="open"
  >
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="选择辖区" @change="handleFilter">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model.trim="listQuery.name" placeholder="输入餐企名称或简称" @change="handleFilter" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" fit ref="tableList" :height="tableHeight" class="titleBg_table">
      <el-table-column label="序号" type="index" width="80" align="center" ></el-table-column>
      <el-table-column label="设备名称" align="center" prop="name"></el-table-column>
      <el-table-column label="监测时间" align="center">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="油烟浓度（mg/m3）" align="center" prop="updateUserName"></el-table-column>
      <el-table-column label="TVOC（mg/m3）" align="center" prop="updateUserName"></el-table-column>
      <el-table-column label="风机状态" align="center" prop="num">
        <template slot-scope="scope">
          <!--          <span>{{$moment(scope.row.time).format('YYYY-MM-DD HH:mm:ss')}}</span>-->
          <i :class="['iconfont','icon-fengji',scope.row.status == 1 ? 'red01':'green01']"></i>
        </template>
      </el-table-column>
      <el-table-column label="净化器" align="center" prop="num">
        <template slot-scope="scope">
          <i :class="['iconfont','icon-fengji',scope.row.status == 1 ? 'red01':'green01']"></i>
        </template>
      </el-table-column>
      <el-table-column label="监测状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.status | filtersStatus}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" class="text-right"/>

  </myDialog>
</template>

<script>
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      historyData: {
        required: true,
        type: Object,
        default: {
          option: {},
          id: ""
        }
      }
    },
    data() {
      return {
        tableHeight:200,
        paraLoading:false,
        total:0,
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
          status:2
        }],
        listLoading: false,
        listQuery:{
          parameterId:'',
          page:1,
          limit:10
        },
        dialogFormVisible: false,
        temp: {
          name:'',
          parameterId:undefined,
          deleted:0
        },
        dialogStatus: '',
      }
    },
    computed: {
      showViewDialog: {
        get() {
          return this.showDialog;
        },
        set(value) {
          this.$emit("update:show-dialog", value);
        }
      },
    },
    filters:{
      filtersStatus: function(value) {
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
    },
    mounted() {

    },
    methods: {
      open(){
        // this.listQuery.parameterId = this.paraData.id
        // this.getList();
        // this.name = this.paraData.option.name
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
      },
      close(){},
      getList(){
        paraValueList(this.listQuery).then(res=>{
          this.list = res.data.data;
          this.total = res.data.count
        });
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },

    }
  }
</script>
