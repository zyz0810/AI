<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="查看重复事件"
    class="dialogContainer"
    @open="open"
  >
    <div class="mb_10">
      <el-button type="primary" icon="iconfont icon-daochu1" @click="">导出信息</el-button>
      <el-button type="primary" plain icon="iconfont icon-xiazai" @click="">下载图片</el-button>
    </div>
    <ul class="img_list flex" style="height:537px;">
      <li v-for="(item,index) in repeatData.list" :key="index">
        <div class="img_list_top clr_white">
          <img class="img_list_img" :src="item.images">
          <span class="block f15 type_tag">{{item.category_big_name}}</span>
          <!--//事件状态-->
          <p class="f15 time">{{$moment(item.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
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
          <div class="flex-item" @click="handleView(item)"><i class="iconfont icon-shenhe"></i>审核</div>
          <div class="flex-item"><i class="iconfont icon-daochu"></i>导出</div>
        </div>
      </li>
    </ul>
    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"-->
                <!--@pagination="getList" class="text-right"/>-->
  </myDialog>
</template>

<script>
  import {collectList, } from '@/api/monitor'
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
      repeatData: {
        required: true,
        type: Object,
        default: {
          list: []
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        updateBtn:true,
        total:0,
        specificationsItem:[''],
        // list: [],
        listLoading: false,
        listQuery:{
          page:1,
          limit:10
        },
        updateId:undefined,
        dialogFormVisible: false,
        temp: {
          name:'',
          parameterId:undefined,
          deleted:0
        },
        textMap: {
          update: '编辑规格信息',
          create: '新增规格信息'
        },
        dialogStatus: '',
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        },
        name:''
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
        // this.getList();
      },
      close(){},
      handleView(row){
        this.$router.push({path:'/statistics/intelligenceView',query: {id:row.id}})
      },
      getList(){
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
        if(val.length > 1){
          this.updateBtn = true
          this.deleteBtn = true
        }else if(val.length == 1){
          this.updateBtn = false
          this.deleteBtn = false
        }else{
          this.updateBtn = true
          this.deleteBtn = true
        }
      },

      resetTemp() {
        this.temp = {
          // parameterId:undefined,
          name:'',
          parameterId:undefined,
          deleted:0
          // orders:'',
          // isSystem:1,
        }
      },

      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.parameterId = this.paraData.id
            paraValueSave(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                this.getList();
                // this.list.unshift(res.data);
                this.dialogFormVisible = false;
                // debugger
                this.getList();
                this.$message({
                  message: '增加成功',
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, this.rowInfo[0]); // copy obj
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            const tempData = Object.assign({}, this.temp);
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            paraValueUpdate(tempData).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                // const index = this.list.findIndex(v => v.id === this.temp.id);
                // this.list.splice(index, 1, res.data);
                this.getList();
                this.dialogFormVisible = false;
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
      handleDelete(row, index) {
        this.$confirm('确定删除此记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: this.rowInfo[0].id};
          paraValueDelete(para).then((res) => {
            this.listLoading = false;
            if(res.resp_code == 0) {
              this.getList();
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }).catch(() => {

        });
      },



    }
  }
</script>
