<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="6vh"
    title="监控信息"
    class="dialogContainer"
    @open="open"
  >

    <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px">

      <el-form-item label="所属辖区" prop="city_id">
        <el-select v-model="temp.city_id" placeholder="选择辖区">
          <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="生产地" prop="product">
        <el-input v-model.trim="temp.product" placeholder="请输入生产地" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入设备名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="设备型号" prop="version">
        <el-input v-model.trim="temp.version" placeholder="请输入设备名称" autocomplete="off" clearable/>
      </el-form-item>

      <el-form-item label="设备编号" prop="facility_no">
        <el-input v-model.trim="temp.facility_no" placeholder="请输入设备名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="设备IMEI" prop="imei">
        <el-input v-model.trim="temp.imei" placeholder="请输入设备名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="安装日期" prop="start_time">
        <el-date-picker v-model="temp.start_time" type="datetime" placeholder="请选择时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
      </el-form-item>
    </el-form>

    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
      <el-form-item label="安装照片" prop="images">
        <SingleImage :tempUrl="temp.images" v-on:imgSrc="hasImgSrc"></SingleImage>
      </el-form-item>
      <el-form-item label="备  注" prop="remark">
        <el-input type="textarea" v-model.trim="temp.remark" placeholder="备注：1000字以内" clearable></el-input>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>
  import {facilityDetail,addFacility,editFacility,} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {cityList} from "@/api/jurisdiction";
  import {userDetail} from "@/api/user"; // waves directive
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
        dialogStatus:'',
        paraLoading:false,
        cityList:[],
        temp: {
          product:'',
          city_id:'',
          name:'',
          version: '',
          facility_no:'',
          imei:'',
          start_time:'',
          images:'',
          remark:''
        },
        rules: {
          name: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
          version: [{ required: true, message: '请输入设备型号', trigger: 'change' }],
          facility_no: [{ required: true, message: '请输入设备编号', trigger: 'change' }],
          imei: [{ required: true, message: '请输入设备IMEI', trigger: 'change' }],
          start_time: [{ required: true, message: '请选择安装日期', trigger: 'change' }],
          images: [{ required: true, message: '请上传安装照片', trigger: 'change' }],
          product: [{ required: true, message: '请输入生产地', trigger: 'change' }],
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

      hasImgSrc(val) {
        this.temp.images = val;
        console.log( this.temp)
      },
      open(){
        this.dialogStatus = this.paraData.operatorType
        this.getCity();
        if(this.paraData.operatorType != 'create'){
          this.getView();
        }
      },
      close(){
        this.dialogStatus='';
        this.paraLoading=false;
        this.cityList=[];
        this.temp= {
          product:'',
          city_id:'',
          name:'',
          version: '',
          facility_no:'',
          imei:'',
          start_time:'',
          images:'',
          remark:''
        };
      },
      getCity(){
        cityList({page:1,pageSize:9999,}).then(res=>{
          this.cityList = res.data.data;
        });
      },
      getView(){
        facilityDetail({id:this.paraData.id}).then(res=>{
          const { id,product, city_id,name, version,facility_no,imei,start_time,images,remark} = res.data
          this.temp = { id,product, city_id,name, version,facility_no,imei,start_time,images,remark}
        });
      },


      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            console.log( this.temp)
            addFacility(this.temp).then((res) => {
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
            editFacility(this.temp).then((res) => {
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
