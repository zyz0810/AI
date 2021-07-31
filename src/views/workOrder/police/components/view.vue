<template>
  <div class="app-container">

    <div class="warning_tab f16 bold">
      <span :class="['inlineBlock', tabIndex == 0?'active clr_white':'']" @click="tabIndex = 0">现场图片</span>
      <span :class="['inlineBlock', tabIndex == 1?'active clr_white':'']" @click="tabIndex = 1">视频回放</span>
      <span :class="['inlineBlock', tabIndex == 2?'active clr_white':'']" @click="clickVideo">查看监控</span>
    </div>
    <div class="cont">
      <div class="mt_20">
        <ul class="img_list flex" v-show="tabIndex == 0">
          <li v-for="(item,index) in imgList" :key="index">
            <div class="img_list_top clr_white">
              <img class="img_list_img" :src="item.image">
              <span class="block f15 type_tag">{{item.type | filtersType}}</span>
              <p class="f15 time">{{item.time}}</p>
            </div>
          </li>
        </ul>
        <ul class="img_list flex video_list" v-show="tabIndex == 1">
          <li v-for="(item,index) in videoList" :key="index">
            <div class="img_list_top clr_white">
              <img class="img_list_img" :src="item.image">
              <p class="f15 name">
                <span>设备名称：ST1241</span>
                <span>位置信息：滨和路152号</span>
              </p>
              <p class="f15 time">2020-12-18 21:12:09</p>
            </div>
          </li>
        </ul>
      </div>
     <div class="flex">
       <div style="width: 70%;">
         <p class="f20 bold mt_20 mb_10">人工审核信息</p>
         <div class="bg_white p20">
           <el-form ref="dataForm" :inline="true" :rules="rules" :model="temp" label-width="120px">
             <el-form-item label="问题类型" prop="city_id">乱堆物堆料</el-form-item>
             <el-form-item label="上报时间" prop="city_id">2021-05-15 12:12:56</el-form-item>
             <el-form-item label="来源设备" prop="city_id">ST1234415</el-form-item>
           </el-form>
           <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
             <el-form-item label="审核意见" prop="city_id">
               <el-radio-group v-model="temp.radio">
                 <el-radio :label="3">通过</el-radio>
                 <el-radio :label="6">不通过</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="违规类型" prop="city_id">
               <el-select v-model="temp.city_id" placeholder="选择辖区">
                 <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
               </el-select>
             </el-form-item>


             <el-form-item label="报警点位" prop="product">
               <el-input v-model.trim="temp.product" placeholder="请输入报警点位" autocomplete="off" suffix-icon="el-icon-search" clearable/>
             </el-form-item>
             <el-form-item label="中队" prop="city_id">
               <el-select v-model="temp.city_id" placeholder="选择中队">
                 <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="网格" prop="city_id">
               <el-select v-model="temp.city_id" placeholder="选择网格">
                 <el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="备注" prop="name">
               <el-input v-model.trim="temp.name" placeholder="请输入备注" type="textarea" autocomplete="off" clearable/>
             </el-form-item>
             <el-form-item label="事件等级" prop="city_id">
               <el-radio-group v-model="temp.radio">
                 <el-radio :label="3">通过</el-radio>
                 <el-radio :label="6">不通过</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="" prop="city_id">
               <el-checkbox v-model="checked">事件去重</el-checkbox>
               <el-button v-waves type="primary" class="ml_20" @click="handleRepeat">重复事件（2）</el-button>
             </el-form-item>
           </el-form>
           <div class="text-center mt_20 mb_20">
             <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="paraLoading">审核</el-button>
             <el-button type="primary" plain>上一条</el-button>
             <el-button type="primary" plain>下一条</el-button>
           </div>
         </div>
       </div>
       <div class="" style="width: 28%;margin-left: 2%">
         <p class="f20 bold mt_20 mb_10">位置信息</p>
         <div id='mapDiv' class="mapDiv" style=" height: 500px"></div>
       </div>
     </div>
    </div>

    <repeatView :showDialog.sync="showViewDialog" :viewData="viewData"></repeatView>
    <videotView :showDialog.sync="showVideoDialog" :viewData="viewData"></videotView>

  </div>
</template>

<script>
  import {facilityDetail,addFacility,editFacility,} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {cityList} from "@/api/jurisdiction";
  import {userDetail} from "@/api/user"; // waves directive
  import repeatView from './repeatView'
  import videotView from './videotView'
  import point01 from "@/assets/image/point01.png";
  import point02 from "@/assets/image/point02.png";
  import point03 from "@/assets/image/point03.png";
  import point04 from "@/assets/image/point04.png";
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      repeatView,
      videotView
    },
    props: {
      showDialog: {
        required: false,
        type: Boolean,
        default: false
      },
      paraData: {
        required: false,
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
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        viewData:{},
        showVideoDialog:false,
        showViewDialog:false,
        videoList: [{
          num:'AJ5551521133222',
          image:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg',
          type:1,
          time:'2021-8-9 23:22:01',
          address:'文一路300号',
          source:1,
          name:'ST123456',
          status:1
        }],
        imgList: [{
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
      },],
        tabIndex:0,
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
    mounted() {
      this.onLoad()
    },
    methods: {
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
        //创建标注工具对象
        let markerTool = new T.MarkTool(this.map, {follow: true});

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
      clickVideo(){
        this.showVideoDialog = true
      },
      handleRepeat(row){
        this.showViewDialog = true
        this.viewData = {
          id:row.id
        }
      },
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
<style lang="scss" scoped>
  .cont{
    /*height: calc(100vh - 86px);*/
    height: 750px;
    overflow: auto;
  }
  .warning_tab{
    span{
      padding: 10px 15px;
    }
    .active{
      border-radius: 5px;
      background: rgba(64,158,255,1);
    }
  }

</style>
