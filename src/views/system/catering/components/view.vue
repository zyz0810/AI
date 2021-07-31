<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="5vh"
    title="餐企信息"
    class="dialogContainer"
    @open="open"
  >

    <el-tabs v-model="activeName" class="catering_tab" @tab-click="handleClick">
      <el-tab-pane label="餐企信息" name="first">
        <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px">
          <el-form-item label="设备名称" prop="facility_id">
            <!--        <el-input v-model.trim="temp.name" placeholder="请输入所属分组" autocomplete="off" clearable/>-->
            <el-select v-model="temp.facility_id" multiple  placeholder="选择设备" @change="$forceUpdate()">
              <el-option v-for="option in facilityList" :label="option.name" :value="option.id" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="餐企名称" prop="company">
            <el-input v-model.trim="temp.company" placeholder="请输入餐企名称" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="餐企简称" prop="simple_name">
            <el-input v-model.trim="temp.simple_name" placeholder="请输入餐企简称" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="信用代码" prop="credit_code">
            <el-input v-model.trim="temp.credit_code" placeholder="请输入信用代码" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="组织机构代码" prop="organization_code">
            <el-input v-model.trim="temp.organization_code" placeholder="请输入组织机构代码" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="企业状态" prop="status">
            <el-select v-model="temp.status">
              <el-option v-for="item in companyStatus" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业编码" prop="company_code">
            <el-input v-model.trim="temp.company_code" placeholder="请输入企业编码" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="负责人" prop="principal">
            <el-input v-model.trim="temp.principal" placeholder="请输入负责人" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model.trim="temp.mobile" placeholder="请输入手机号码" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="餐企电话" prop="tel">
            <el-input v-model.trim="temp.tel" placeholder="请输入餐企电话" autocomplete="off" clearable/>
          </el-form-item>



          <el-form-item label="餐企类型" prop="company_type">
            <el-select v-model="temp.company_type">
              <el-option v-for="option in companyList" :label="option.name" :value="option.id" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜系" prop="cook_type">
            <el-select v-model="temp.cook_type">
              <el-option v-for="option in cookList" :label="option.name" :value="option.id" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业面积" prop="area">
            <el-input v-model.trim="temp.area" placeholder="请输入营业面积" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="灶头数量" prop="kitchen_range_num">
            <el-input v-model.trim="temp.kitchen_range_num" placeholder="请输入灶头数量" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="排口数量" prop="outlet_num">
            <el-input v-model.trim="temp.outlet_num" placeholder="请输入排口数量" autocomplete="off" clearable/>
          </el-form-item>
          <el-form-item label="餐企规模" prop="scale_type">
            <el-select v-model="temp.scale_type">
              <el-option v-for="option in scaleList" :label="option.name" :value="option.id" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属辖区" prop="city_id">
            <el-select v-model="temp.city_id">
              <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
            </el-select>
          </el-form-item>
          <!--      <el-form-item label="所属分组" prop="street">-->
          <!--        <el-select v-model="temp.street">-->
          <!--          <el-option label="启用" value="1"></el-option>-->
          <!--          <el-option label="禁用" value="0"></el-option>-->
          <!--        </el-select>-->
          <!--      </el-form-item>-->
        </el-form>
        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model.trim="temp.address" placeholder="请输入详细地址" autocomplete="off" clearable/>
            <div id='mapDiv' class="mapDiv mt_10" style="width: 100%;height: 200px"></div>
          </el-form-item>
          <el-form-item label="门面照片" prop="images">
            <SingleImage :tempUrl="temp.images" v-on:imgSrc="hasImgSrc"></SingleImage>
          </el-form-item>
          <el-form-item label="营业执照" prop="license">
            <SingleImage :tempUrl="temp.license" v-on:imgSrc="hasImgSrc1"></SingleImage>
          </el-form-item>
          <el-form-item label="备  注" prop="remark">
            <el-input type="textarea" v-model.trim="temp.remark" placeholder="备注：1000字以内" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
<!--      <el-tab-pane label="绑定设备" name="second">-->
<!--        <el-form ref="dataForm" :rules="rules" :inline="true" :model="temp" label-width="120px">-->
<!--          <el-form-item label="设备名称" prop="company">-->
<!--            <el-input v-model.trim="temp.company" placeholder="请输入餐企名称" autocomplete="off" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="设备型号" prop="simple_name">-->
<!--            <el-input v-model.trim="temp.simple_name" placeholder="请输入餐企简称" autocomplete="off" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="设备编号" prop="credit_code">-->
<!--            <el-input v-model.trim="temp.credit_code" placeholder="请输入信用代码" autocomplete="off" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="设备IMEI" prop="organization_code">-->
<!--            <el-input v-model.trim="temp.organization_code" placeholder="请输入组织机构代码" autocomplete="off" clearable/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="安装日期" prop="start_time">-->
<!--            <el-date-picker v-model="temp.start_time" type="datetime" placeholder="请选择时间" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>-->
<!--          </el-form-item>-->

<!--        </el-form>-->
<!--        <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">-->

<!--          <el-form-item label="安装照片" prop="name">-->
<!--            <SingleImage :tempUrl="temp.imageUrl" v-on:imgSrc="hasImgSrc"></SingleImage>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备  注" prop="remark">-->
<!--            <el-input type="textarea" v-model.trim="temp.remark" placeholder="备注：1000字以内" clearable></el-input>-->
<!--          </el-form-item>-->

<!--        </el-form>-->
<!--      </el-tab-pane>-->

    </el-tabs>



    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">确 定</el-button>
      <el-button @click="showViewDialog = false">取 消</el-button>
    </div>


  </myDialog>
</template>

<script>
  import {companyDetail,addCompany,editCompany} from '@/api/catering'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {facilityList} from "@/api/monitor";
  import {dicList} from "@/api/dictionary";
  import {cityList} from "@/api/jurisdiction"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    mixins: [map],
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
        activeName:'first',
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        paraLoading:false,
        updateId:undefined,
        dialogFormVisible: false,
        companyStatus:[{
          id:1,
          name:'正常'
        },{
          id:2,
          name:'禁用'
        }],
        temp: {
          facility_id:'',
          company:'',
          simple_name:'',
          organization_code:'',
          status:1,
          company_code:'',
          principal:'',
          mobile:'',
          tel:'',
          company_type:'',
          cook_type:'',
          area:'',
          kitchen_range_num:'',
          outlet_num:'',
          scale_type:'',
          city_id:'',
          street:'',
          address:'',
          images:'',
          license:'',
          remark:'',
          log:'',
          lat:'',
        },
        companyList:[],
        cookList:[],
        scaleList:[],
        facilityList:[],
        cityList:[],
        dialogStatus: '',
        rules: {
          company: [{ required: true, message: '请输入名称', trigger: 'change' }],
          simple_name: [{ required: true, message: '请输入企业简称', trigger: 'change' }],
          credit_code: [{ required: true, message: '请输入信用代码', trigger: 'change' }],
          status: [{ required: true, message: '请选择企业状态', trigger: 'change' }],
          company_code: [{ required: true, message: '请输入企业编码', trigger: 'change' }],
          company_type: [{ required: true, message: '请选择餐企类型', trigger: 'change' }],
          cook_type: [{ required: true, message: '请选择菜系', trigger: 'change' }],
          kitchen_range_num: [{ required: true, message: '请输入灶头数量', trigger: 'change' }],
          outlet_num: [{ required: true, message: '请输入排口数量', trigger: 'change' }],
          scale_type: [{ required: true, message: '请选择餐企规模', trigger: 'change' }],
          city_id: [{ required: true, message: '请选择辖区', trigger: 'change' }],
          address: [{ required: true, message: '请选择详细地址', trigger: 'change' }],
          images: [{ required: true, message: '请上传门店照片', trigger: 'change' }],
          license: [{ required: true, message: '请上传营业执照', trigger: 'change' }],
        },
      }
    },
    computed: {
      isCanView() {
        return this.viewData.operatorType == "view";
      },
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
      getCity(){
        cityList({page:1,pageSize:9999,}).then(res=>{
          this.cityList = res.data.data;
        });
      },
      getFacility(){
        facilityList({ page: 1, pageSize: 99999}).then(res => {
          this.facilityList = res.data.data
        });
      },
      getCompanyType(){
        dicList({ parent_id: 16,
          page: 1,
          pageSize: 9999,}).then(res => {
          this.companyList = res.data.data
        });
      },
      getCookType(){
        dicList({ parent_id: 1,
          page: 1,
          pageSize: 9999,}).then(res => {
          this.cookList = res.data.data
        });
      },
      getScaleType(){
        dicList({ parent_id: 2,
          page: 1,
          pageSize: 9999,}).then(res => {
          this.scaleList = res.data.data
        });
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        let markerTool = new T.MarkTool(this.map, {follow: true});

        // endeditMarker();
        // markerTool.open();


        // this.map.addEventListener("click",MapClick);
        // function MapClick(e)
        // {
        //   console.log('11111111')
        //   alert(e.lnglat.getLng()+","+e.lnglat.getLat());
        // }
        function endeditMarker() {
          let markers = markerTool.getMarkers()
          for (let i = 0; i < markers.length; i++) {
            markers[i].disableDragging();
          }
        }
        var cp = new T.CoordinatePickup(this.map, {callback: this.getLngLat})
        cp.addEvent();
        function editMarker() {
          let markers = markerTool.getMarkers()
          console.log(markers)
          for (let i = 0; i < markers.length; i++) {
            markers[i].enableDragging();
          }

        }


        // endeditMarker();
        editMarker();
        markerTool.open();

      },
      getLngLat(lnglat) {
        this.temp.address  = lnglat.lng.toFixed(6) + "," + lnglat.lat.toFixed(6);
        this.temp.log = lnglat.lng.toFixed(6)
        this.temp.lat = lnglat.lat.toFixed(6)
      },
      //绘制标注(点)
      drawMarker(){
        var markerTool = new T.MarkTool(this.map, {follow: true});
        this.map.clearOverLays();
        markerTool.open();
        //绑定mouseup事件 在用户每完成一次标注时触发事件。
        markerTool.addEventListener("mouseup",this.getPoints1);
      },
      getPoints1(e){
        var points = e.currentLnglat;
        //标注点的坐标
        console.log(points);
      },
      //使得标注可以拖拽
      endeditMarker() {
        let markerTool = new T.MarkTool(map, {follow: true});
        var markers = markerTool.getMarkers()
        for (var i = 0; i < markers.length; i++) {
          markers[i].disableDragging();
        }
        markerTool.open();
      },
      hasImgSrc(val) {
        this.temp.images = val;
      },
      hasImgSrc1(val) {
        this.temp.license = val;
      },

      open(){
        this.getCity();
        this.getCompanyType();
        this.getCookType();
        this.getScaleType();
        this.getFacility();
        this.dialogStatus = this.viewData.operatorType
        if(this.viewData.operatorType != 'create'){
          this.getView();
        }

        this.$nextTick(function() {
          this.onLoad();
          // this.drawMarker();
        })

      },
      close(){},
      getView(){
        companyDetail({id:this.viewData.id}).then(res=>{
          const {id,company, simple_name, organization_code, status, company_code, principal, mobile, tel, company_type, cook_type, area,
            kitchen_range_num, outlet_num, scale_type, city, street, address, images, remark} = res.data;
          this.temp = {id,company, simple_name, organization_code, status, company_code, principal, mobile, tel, company_type, cook_type, area,
            kitchen_range_num, outlet_num, scale_type, city, street, address, images, remark};
        });
      },



      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addCompany(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
                this.dialogFormVisible = false;
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
            editCompany(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList');
                this.dialogFormVisible = false;
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
<style lang="scss">
  @import './../../../../styles/variables.scss';
  .catering_tab{
    .el-tabs__content{
      height: 65vh;
      overflow: auto;
    }

    .el-tabs__item{
      color: $baseColor;
      &.is-active{
        color: $txtColor;
      }

    }
    .el-tabs__active-bar{
      background-color: $txtColor;
    }
    .el-tabs__nav-wrap::after{
      height: 1px;
      background-color: $baseColor;
    }
  }
</style>
