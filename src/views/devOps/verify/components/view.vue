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
          <li >
            <div class="img_list_top clr_white">
              <img class="img_list_img" :src="formData.images">
              <span class="block f15 type_tag">{{formData.category_big_name}}</span>
              <p class="f15 time">{{formData.collect_time}}</p>
            </div>
          </li>
          <!--<li v-for="(item,index) in imgList" :key="index">-->
          <!--<div class="img_list_top clr_white">-->
          <!--<img class="img_list_img" :src="item.image">-->
          <!--<span class="block f15 type_tag">{{item.type | filtersType}}</span>-->
          <!--<p class="f15 time">{{item.time}}</p>-->
          <!--</div>-->
          <!--</li>-->
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
              <el-form-item label="问题类型：" prop="city_id">{{formData.category_big_name}}</el-form-item>
              <el-form-item label="上报时间：" prop="city_id">{{$moment(formData.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</el-form-item>
              <el-form-item label="来源设备：" prop="city_id">{{formData.facility_name}}</el-form-item>
            </el-form>
            <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
              <el-form-item label="审核意见：" prop="status">
                <el-radio-group v-model="temp.is_audited" :disabled="formData.status != 1">
                  <el-radio :label="1">通过</el-radio>
                  <el-radio :label="2">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="违规类型：" prop="category_small">
                <!--               <el-select v-model="temp.category_big" placeholder="选择辖区">-->
                <!--                 <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>-->
                <!--               </el-select>-->

                <el-cascader ref="cascaderPublish"
                             v-model="temp.category_small"
                             :options="categoryList"
                             :show-all-levels="false"
                             filterable
                             :props="props"
                             placeholder="请选择"></el-cascader>
              </el-form-item>
              <el-form-item label="报警点位：">
                {{formData.address}}
                <!--               <el-input v-model.trim="temp.product" placeholder="请输入报警点位" autocomplete="off" suffix-icon="el-icon-search" clearable/>-->
              </el-form-item>
              <el-form-item label="中队：" prop="city_id">
                {{formData.depart_name}}
                <!--<el-select v-model="temp.city_id" placeholder="选择中队" :disabled="true">-->
                <!--<el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>-->
                <!--</el-select>-->
              </el-form-item>
              <!--<el-form-item label="网格：" prop="city_id">-->
              <!--<el-select v-model="temp.city_id" placeholder="选择网格" :disabled="true">-->
              <!--<el-option v-for="option in cityList" :label="option.province+option.city+option.area" :value="option.id" :key="option.id"></el-option>-->
              <!--</el-select>-->
              <!--</el-form-item>-->
              <el-form-item label="备注：" prop="remark">
                <el-input v-model.trim="temp.remark" placeholder="请输入备注" type="textarea" autocomplete="off" :disabled="formData.status != 1" clearable/>
              </el-form-item>
              <el-form-item label="事件等级：" prop="city_id">
                <el-radio-group v-model="temp.is_important" :disabled="formData.status != 1">
                  <el-radio :label="1">一般案件</el-radio>
                  <el-radio :label="2">重大案件</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="" prop="checked">
                <el-checkbox v-model="checked" :disabled="formData.status != 1">事件去重</el-checkbox>
                <el-button v-waves type="primary" class="ml_20" @click="handleRepeat">重复事件（{{formData.list.length}}）</el-button>
              </el-form-item>
            </el-form>
            <div class="text-center mt_20 mb_20">
              <el-button type="primary" v-if="this.formData.status == 1" @click="onSubmit" :loading="paraLoading">审核</el-button>
              <el-button type="primary" plain @click="getCase(0)">上一条</el-button>
              <el-button type="primary" plain @click="getCase(1)">下一条</el-button>
            </div>
          </div>
        </div>
        <div class="" style="width: 28%;margin-left: 2%">
          <p class="f20 bold mt_20 mb_10">位置信息</p>
          <div id='mapDiv' class="mapDiv" style=" height: 500px"></div>
        </div>
      </div>
    </div>

    <repeatView :showDialog.sync="showViewDialog" :repeatData="repeatData"></repeatView>
    <videoView :showDialog.sync="showVideoDialog" :videoData="videoData"></videoView>

  </div>
</template>

<script>
  import {collectDetail,collectEdit,categoryList,nextDetailCollect} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {userDetail} from "@/api/user"; // waves directive
  import repeatView from './repeatView'
  import videoView from './videotView'
  import point01 from "@/assets/image/point01.png";
  import point02 from "@/assets/image/point02.png";
  import point03 from "@/assets/image/point03.png";
  import point04 from "@/assets/image/point04.png";
  import point05 from "@/assets/image/point05.png";
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      SingleImage,
      repeatView,
      videoView
    },
    data() {
      return {
        props: {
          // checkStrictly: true,
          expandTrigger: "hover",
          value: "id",
          label: "name",
          children: "parent_list",
          disabled: this.disabledFn,
        },
        checked:false,
        repeatData:{},
        videoData:{},
        map: '', // 对象
        zoom: 12, // 地图的初始化级别，及放大比例
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
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
        formData:{
          // category_big_name、collect_time、community_id_name、address
          category_big_name:'',
          collect_time:'',
          community_id_name:'',
          address:'',
          latitude:'',
          longitude:'',
          facility_name:'',
          status:'',
          depart_name:'',
          // install_place:'',
          // pic_url:'',
          images:'',
          list:[]
        },
        tabIndex:0,
        paraLoading:false,
        temp: {
          id:'',
          is_audited:1,
          category_small:[],
          remark: '',
          is_important:1,
          ids:''
        },
        rules: {
          // name: [{ required: true, message: '请输入设备名称', trigger: 'change' }],
          // version: [{ required: true, message: '请输入设备型号', trigger: 'change' }],
          // facility_no: [{ required: true, message: '请输入设备编号', trigger: 'change' }],
          // imei: [{ required: true, message: '请输入设备IMEI', trigger: 'change' }],
          // start_time: [{ required: true, message: '请选择安装日期', trigger: 'change' }],
          // images: [{ required: true, message: '请上传安装照片', trigger: 'change' }],
          // product: [{ required: true, message: '请输入生产地', trigger: 'change' }],
        },
        categoryList:[]
      }
    },

    filters: {
      filtersType: function (value) {
        let StatusArr = {0: '店外经营', 1: '违规撑伞', 2: '流动摊点', 3: '沿街晾晒'}
        return StatusArr[value]
      },
    },
    mounted() {
      this.onLoad()
      this.getView();
      this.getCategory();
    },
    methods: {
      disabledFn () {
        if (this.formData.status == 1) {
          return true;
        } else {
          return false;
        }
      },
      // changeCategory(val){
      //   console.log(val)
      // },
      getCase(val){
        // type 1 升序 0 降序
        nextDetailCollect({id:this.formData.id,type:val,}).then(res=>{
          const { id,category_big_name,status, collect_time,depart_name,community_id_name,address, latitude,longitude,images,list} = res.data
          this.formData = { id,category_big_name,status, depart_name,collect_time,community_id_name,address, latitude,longitude,images,list}
          this.mapPoint();
        });
      },
      getCategory(){
        // type 1 升序 0 降序
        categoryList({page:1,pageSize:99999}).then(res=>{
          this.categoryList = res.data.data

        });
      },
      getNext(){},
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // // 普通标注
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
      },
      mapPoint(){
        //创建图片对象
        this.map.clearOverLays();
        let point = new T.LngLat(this.formData.longitude, this.formData.latitude);
        let marker =  new T.Marker(point);
        this.map.addOverLay(marker);
      },
      clickVideo(){
        this.showVideoDialog = true
      },
      handleRepeat(row){
        this.showViewDialog = true
        this.repeatData = {
          list:this.formData.list
        }
      },

      getView(){
        collectDetail({id:this.$route.query.id}).then(res=>{
          // const { intelligent_type_name, create_time,camera_name, latitude,longitude,install_place,pic_url,list} = res.data
          // this.formData = { intelligent_type_name, create_time,camera_name, latitude,longitude,install_place,pic_url,list}
          // this.mapPoint();
          const { id, category_big_name,status,collect_time,community_id_name,address,facility_name, latitude,longitude,images,list} = res.data
          this.formData = { id, category_big_name,status, collect_time,community_id_name,address,facility_name, latitude,longitude,images,list}
          this.mapPoint();
        });
      },

      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            console.log( this.temp);
            this.temp.id = this.formData.id;
            // let name =  this.categoryList.filter(item=>{
            //   if(item.id == this.temp.category_big){
            //     return item;
            //   }
            // });
            // console.log(name)
            // this.temp.category_big_name = name[0].name;
            console.log(this.temp)
            let temp = JSON.parse(JSON.stringify(this.temp))
            let form;
            temp.category_small = temp.category_small[temp.category_small.length - 1];
            if(this.checked == true){
              if(this.formData.list.length > 0){
                temp.ids = this.formData.list.join(',')
              }
              const {id,status,category_small,remark,is_important,ids} = temp;
              form = {id,status,category_small,remark,is_important,ids}
            }else{
              const {id,status,category_small,remark,is_important} = temp;
              form = {id,status,category_small,remark,is_important}
            }
            collectEdit(form).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
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
