<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="10vh"
    title="核实"
    class="dialogContainer"
    @open="open"
  >

    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px">

      <el-form-item label="设备编号" prop="name">
        <el-input v-model.trim="name" placeholder="请输入规格名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="餐企名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入规格值" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入规格值" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="所属辖区" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障类型" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="故障日期" prop="name">
        <el-date-picker v-model="temp.name" type="datetime" placeholder="选择日期时间" prefix-icon="none"></el-date-picker>
      </el-form-item>
      <el-form-item label="核实状态" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="修复状态" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
      <el-form-item label="故障详情" prop="name">
        <el-input type="textarea" v-model.trim="temp.name" placeholder="故障详情……500字以内" clearable></el-input>
      </el-form-item>
      <el-form-item label="核实详情" prop="name">
        <el-input type="textarea" v-model.trim="temp.name" placeholder="核实详情……500字以内" clearable></el-input>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px" style="margin-top: 50px;">

      <el-form-item label="运维人员" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运维日期" prop="name">
        <el-date-picker v-model="temp.name" type="datetime" placeholder="选择日期时间" prefix-icon="none"></el-date-picker>
      </el-form-item>
      <el-form-item label="运维类型" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态" prop="name">
        <el-select v-model="temp.status">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运维照片" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入规格值" autocomplete="off" clearable/>
      </el-form-item>

    </el-form>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
      <el-form-item label="运维照片" prop="name">
        <SingleImage :tempUrl="temp.imageUrl" v-on:imgSrc="hasImgSrc"></SingleImage>
      </el-form-item>
      <el-form-item label="备  注" prop="name">
        <el-input type="textarea" v-model.trim="temp.name" placeholder="备注" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
      <!--<el-button type="primary" @click="handleAdd()">确 定</el-button>-->
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData(updateId)" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      viewData: {
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
      hasImgSrc(val) {
        this.temp.imageUrl = val;
      },
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
