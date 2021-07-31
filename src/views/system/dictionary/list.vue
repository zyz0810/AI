<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="clearfix">
        <span class="block clr_white f18 dic_name fl text-center">字典名称</span>
        <el-button class="filter-item btn_purple fr" type="primary" icon="el-icon-notebook-2" @click="handleCreate(2)">新增信息</el-button>
      </div>
    </div>
    <div class="flex" style=" align-items:stretch">
      <ul class="dic_parent baseColor m_r30" :style="{height:tableHeight+'px'}">
        <li v-for="item in list" @click="getChilden(item.id)" :class="['p20','f16','bold',activeId == item.id?'active clr_white':'']">{{item.name}}</li>
        <li class="f20 text-center" @click="handleCreate(1)"><i class="el-icon-circle-plus-outline"></i></li>
      </ul>
      <div style="flex:1;">
        <el-table v-loading="listLoading" :data="childenList" :height="tableHeight"
                  element-loading-text="拼命加载中" fit ref="tableList" class="titleBg_table">
          <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
          <el-table-column label="名称" align="center" prop="name"></el-table-column>
          <el-table-column label="排序" align="center" prop="sort"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=2 active-color="#31B06E" inactive-color="#AAAAAA" @change="handleState(scope.$index, scope.row)"></el-switch>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList" class="text-right"/>
      </div>

    </div>

    <paraView :showDialog.sync="showViewDialog" :paraData="paraData" @insertParent="getList" @insertChilden="getChilden(activeId)"></paraView>

  </div>
</template>

<script>
  import {dicList,mofidyStatusDic} from '@/api/dictionary'
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
        activeId:'',
        showViewDialog:false,
        paraData:{},
        total: 0,
        childenList:[],
        list: [],
        listLoading: false,
        listQuery: {
          parent_id: '',
          page: 1,
          pageSize: 10
        },
        dialogStatus: '',
        tableHeight:'100',
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
      this.getList();
    },
    methods: {
      handleCreate(type){
        this.showViewDialog = true;
        this.paraData={
          id: "",
          operatorType: type,
          parent_id: type == 1?'':this.activeId
        }
      },
      handleState(index,row){
        console.log(index)
        // ：active-value得为true
        // ：inactive-value得为false
        let flag = row.status //保存点击之后v-modeld的值(true，false)
        // row.status = !row.status //保持switch点击前的状态
        if(flag == 1){
          flag = 2;
          row.status = 2
        }else if(flag == 2){
          flag = 1;
          row.status = 1
        }
        let paras = {
          id:row.id,
          // status:flag,
        };
        this.$confirm('是否确认此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          mofidyStatusDic(paras).then(res => {
            if (res.code == 1) {
              this.getChilden(this.activeId);
              // row.enabled = !row.enabled;
              if(row.status == 1){
                row.status = 2
              }else if(row.status == 2){
                row.status = 1
              }
              // 逻辑处理
              this.$message.success(res.message);

              // this.GetList();
            } else {
              this.$message.error(res.message);
            }
          }).catch(() => {
          });
        }).catch(() => {
          // this.$message.info('取消操作！')
        });
      },


      getList() {
        dicList({parent_id:0,page: 1,
          pageSize: 99999}).then(res => {
          this.list = res.data.data
          this.activeId = this.list[0].id
          this.getChilden(this.activeId);
        });
      },
      getChilden(id){
        this.activeId = id;
        this.listQuery.parent_id = id;
        dicList(this.listQuery).then(res => {
          this.childenList = res.data.data
          this.total = res.data.total
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  @import './../../../styles/variables.scss';
  .dic_name{
    width: 200px;
    background: #216BAB;
    border-radius: 10px;
    height: 2.5em;
    line-height: 2.5;
  }
  .dic_parent{
    width: 200px;
    border: 1px solid #1362a0;
    line-height: 3;
    overflow: auto;
    li{
      border-bottom: 1px solid #1362a0;
      &.active{
        background: #0a275f !important;
        box-shadow: $menuText 0 0 18px inset;
      }
    }
  }
</style>
