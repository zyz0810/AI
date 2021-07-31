<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="查看明细"
    class="dialogContainer"
    @open="open"
  >
    <div class="filter-container">
      <div class="flex" v-if="operatingMode!=2">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" :disabled="updateBtn" @click="handleUpdate">编辑</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="danger" :disabled="updateBtn" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </div>
    </div>
    <div class="f14">参数名：{{name}}</div>
    <div class="f14" v-if="operatingMode!=2">参数值：</div>

    <el-table v-loading="listLoading" :data="list" :header-cell-style="{background:'#f5f7fa'}" element-loading-text="拼命加载中" border fit highlight-current-row ref="tableList" @row-click="clickRow" @selection-change="handleSelectionChange" v-if="operatingMode!=2">
      <el-table-column type="selection" width="40" align="center" ></el-table-column>
      <el-table-column label="名称" align="center" prop="name"></el-table-column>
      <el-table-column label="创建人" align="center" prop="createUserName"></el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改人" align="center" prop="updateUserName"></el-table-column>
      <el-table-column label="最后修改时间" align="center">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.updateTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList" class="text-right" v-if="operatingMode!=2"/>
    <myDialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:50px;">

        <el-form-item label="参数名称" prop="name">
          <el-input v-model.trim="name" placeholder="请输入规格名称" autocomplete="off" :disabled="true" clearable/>
        </el-form-item>
        <el-form-item label="参数值" prop="name">
          <el-input v-model.trim="temp.name" placeholder="请输入规格值" autocomplete="off" clearable/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
        <!--<el-button type="primary" @click="handleAdd()">确 定</el-button>-->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData(updateId)" :loading="paraLoading">确 定</el-button>
      </div>
    </myDialog>


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
      paraData: {
        required: true,
        type: Object,
        default: {
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        operatingMode:'',
        updateBtn:true,
        total:0,
        specificationsItem:[''],
        list: null,
        listLoading: false,
        listQuery:{
          parameterId:'',
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
        this.listQuery.parameterId = this.paraData.id
        this.operatingMode = this.paraData.option.operatingMode
        this.getList();
        this.name = this.paraData.option.name
      },
      close(){},
      getList(){
        paraValueList(this.listQuery).then(res=>{
          this.list = res.data.data;
          this.total = res.data.count
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
