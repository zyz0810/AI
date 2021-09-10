<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="添加案件小类"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px" >
      <el-form-item label="案件大类名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入负责人" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="案件大类编码" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入负责人电话" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="所属地市" prop="mobile">
        <el-input v-model.trim="temp.mobile" placeholder="请输入负责人电话" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="是否启用" prop="mobile">
        <el-switch v-model="temp.value" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>

  import {cityDetail,addCity,updateCity} from '@/api/jurisdiction'
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

        cityArr: [],
        districtArr: [],
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        },
        dialogStatus: '',
        rules: {
          province: [{ required: true, message: '请选择省', trigger: 'change' }],
          city: [{ required: true, message: '请选择市', trigger: 'change' }],
          area: [{ required: true, message: '请选择区', trigger: 'change' }],
          principal: [{ required: true, message: '请输入负责人', trigger: 'change' }],
          mobile: [{ required: true, message: '请输入手机号', trigger: 'change' }],
        },
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
    methods: {
      updateCity: function () {
        for (var i in this.arr) {
          var obj = this.arr[i];
          if (obj.name == this.temp.province) {
            this.cityArr = obj.sub;
            break;
          }
        }
        this.temp.city = this.cityArr[1].name;
      },
      updateDistrict: function () {
        for (var i in this.cityArr) {
          var obj = this.cityArr[i];
          if (obj.name == this.temp.city) {
            this.districtArr = obj.sub;
            break;
          }
        }
        if(this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
          this.temp.area = this.districtArr[1].name;
        } else {
          this.temp.area = '';
        }
      },
      open(){
        this.dialogStatus = this.paraData.operatorType;
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
        // this.updateCity();
        // this.updateDistrict();
      },
      close(){
        this.cityArr= [];
        this.districtArr= [];
        this.paraLoading=false;
        this.dialogFormVisible= false;
        this.temp= {
          province:'',
          city:'',
          area:'',
          principal:'',
          mobile:'',
        };
        this.dialogStatus= '';
      },
      getView(){
        cityDetail({id:this.paraData.id}).then(res=>{
          const { id, province, city, area, principal, mobile,} = res.data;
          this.temp = { id, province, city, area, principal, mobile,}
        });
      },

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addCity(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
                this.showViewDialog = false;
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            updateCity(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
                this.showViewDialog = false;
                this.$message({
                  message: res.message,
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
    }
  }
</script>
