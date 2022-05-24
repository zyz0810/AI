<template>
  <div class="app-container">

    <div class="warning_tab f16 bold">
      <span :class="['inlineBlock', tabIndex == 0?'active clr_white':'']" @click="tabIndex = 0">现场图片</span>
<!--      <span :class="['inlineBlock', tabIndex == 1?'active clr_white':'']" @click="tabIndex = 1">视频回放</span>-->
      <span :class="['inlineBlock', tabIndex == 2?'active clr_white':'']" @click="clickVideo(1)">查看监控</span>
    </div>
    <div class="cont">
      <div class="mt_20">
        <ul class="img_list flex" v-show="tabIndex == 0">
          <li style="width: auto;">
            <div class="img_list_top clr_white">
              <img class="img_list_img" :src="formData.alarm_original_pic" style="width: auto; cursor: pointer;" @click="handleImg(formData.alarm_original_pic)">
              <span class="block f15 type_tag">{{formData.category_big_name}}</span>
              <p class="f15 time">{{$moment(formData.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
            </div>
          </li>
        </ul>
        <!--<ul class="img_list flex video_list" v-show="tabIndex == 1">-->
          <!--<li v-for="(item,index) in videoList" :key="index">-->
            <!--<div class="img_list_top clr_white">-->
              <!--<img class="img_list_img" :src="item.image">-->
              <!--<p class="f15 name">-->
                <!--<span>设备名称：ST1241</span>-->
                <!--<span>位置信息：滨和路152号</span>-->
              <!--</p>-->
              <!--<p class="f15 time">2020-12-18 21:12:09</p>-->
            <!--</div>-->
          <!--</li>-->
        <!--</ul>-->
        <div v-show="tabIndex == 1" style="height: 20vh;">
          <ul class="img_list flex video_list" v-if="historyVideo != ''">
            <li @click="clickVideo(2)">
              <div class="img_list_top clr_white">
                <img class="img_list_img" src="./../../../../assets/image/player_bg.png">
                <img class="start_video" src="./../../../../assets/image/player_icon.png">
              </div>
            </li>
          </ul>
         <span v-else>暂无视频</span>
        </div>
      </div>
     <div class="flex">
       <div style="width: 70%;">
         <p class="f20 bold mt_20 mb_10">人工审核信息</p>
         <div class="bg_white p20">
           <el-form :inline="true" :rules="rules" :model="temp" label-width="120px">
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
             <el-form-item label="违规类型：" prop="category_big">
<!--               <el-select v-model="temp.category_big" placeholder="选择辖区">-->
<!--                 <el-option v-for="item in categoryList" :label="item.name" :value="item.id" :key="item.id"></el-option>-->
<!--               </el-select>-->

               <el-cascader ref="cascaderPublish"
                            v-model="temp.categoryArr"
                            :options="categoryList"
                            :show-all-levels="false"
                            filterable
                            :props="props"
                            @change="changeCategory"
                            placeholder="请选择"></el-cascader>
             </el-form-item>
             <el-form-item label="报警点位：">
               {{formData.address}}
<!--               <el-input v-model.trim="temp.product" placeholder="请输入报警点位" autocomplete="off" suffix-icon="el-icon-search" clearable/>-->
             </el-form-item>
             <el-form-item label="中队：">
               {{formData.depart_id | filtersDepart}}
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
             <el-form-item label="事件等级：" prop="is_important">
               <el-radio-group v-model="temp.is_important" :disabled="formData.status != 1">
                 <el-radio :label="1">一般案件</el-radio>
                 <el-radio :label="2">重大案件</el-radio>
               </el-radio-group>
             </el-form-item>
             <el-form-item label="案件去向：" prop="platform">
               <el-select v-model="temp.platform" placeholder="请选择" :disabled="formData.status != 1">
<!--                 <el-option label="基层治理四平台" :value="1"></el-option>-->
<!--                 “指挥平台”“一网统管”-->
                 <el-option label="请选择" :value="0"></el-option>
                 <el-option label="指挥平台" :value="1"></el-option>
                 <el-option label="一网统管" :value="2"></el-option>
               </el-select>
             </el-form-item>
             <el-form-item label="" prop="checked">
               <el-checkbox v-model="checked" :disabled="formData.status != 1">事件去重</el-checkbox>
               <el-button v-waves type="primary" class="ml_20" @click="handleRepeat">重复事件（{{formData.list.length}}）</el-button>
             </el-form-item>
           </el-form>
           <div class="text-center mt_20 mb_20">
             <el-button type="primary" v-if="formData.status == 1" @click="onSubmit" :loading="paraLoading">审核</el-button>
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
<!--    <videoView :showDialog.sync="showVideoDialog" :caseData="videoData"></videoView>-->
    <div v-show="showVideoDialog" class="dashboard-video-player-box">
      <div id="dashboardVideoPlayer" class="dashboard-video-player">
        <!--<video id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls data-setup="{}">-->
        <!--<source id="source" src="rtsp://10.32.54.38:554/openUrl/ePBOw6I" autoplay type="rtsp/flv">-->
        <!--</video>-->
      </div>
    </div>
    <my-dialog :visible.sync="dialogVisible"
               title="查看图片"
               width="80%"
               :append-to-body="true">
      <img width="100%"
           :src="dialogImageUrl"
           alt />
    </my-dialog>
  </div>
</template>

<script>
  import {collectDetail,collectEdit,categoryList,nextDetailCollect,getNowurl, getHistoryUrl} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import SingleImage from "@/components/Upload/SingleImage.vue";
  import {userDetail} from "@/api/user"; // waves directive
  import repeatView from './repeatView'
  import videoView from './../../../testing/monitor/components/videoView'
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
        historyVideo:'',
        formData:{
          // category_big_name、collect_time、community_id_name、address
          category_big_name:'',
          collect_time:'',
          finished_time:'',
          community_id_name:'',
          address:'',
          latitude:'',
          longitude:'',
          facility_name:'',
          status:'',
          depart_id:'',
          index_code:'',
          // install_place:'',
          // alarm_original_pic:'',
          images:'',
          list:[],
          alarm_original_pic:'',
        },
        tabIndex:0,
        paraLoading:false,
        temp: {
          id:'',
          is_audited:1,
          categoryArr:[],
          category_big:'',
          category_small:'',
          remark: '',
          is_important:1,
          ids:'',
          platform:0,
        },
        rules: {
          category_big: [{ required: true, message: '请选择类别', trigger: 'change' }],
        },
        categoryList:[],
        playVideoUri:'',
        player: null,
        dialogImageUrl: "",
        dialogVisible: false,
      }
    },

    filters: {
      filtersDepart: function (value) {
        let StatusArr = {1: '浦沿中队', 2: '长河中队',3: '西兴中队'};
        return StatusArr[value]
      },
    },
    mounted() {
      // this.formData.id = this.$route.query.id;
      this.onLoad();
      this.getView();
      this.getCategory();
      window.closeVideoDialog = () => {
        this.handleVideoClose()
      }

      // this.$once('hook:beforeDestroy', () => {
      //   this.player.dispose();
      // })
      this.initPlayer();
    },
    methods: {
      handleImg(url){
        this.dialogImageUrl = url;
        this.dialogVisible = true;
      },
      handleVideoClose() {
        this.player.dispose()
        $('#myVideo').remove()
        $('#dashboardVideoPlayer').html('')
        this.player = null
        this.showVideoDialog = false
        this.playVideoUri = ''
      },
      initPlayer() {
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.handleCloseKeyDown(e) // 事件名
            }
          })
        })
      },
      handleCloseKeyDown(e) {
        if (this.dialogVisible && e.keyCode === 27) {
          this.player.dispose()
          $('#myVideo').remove()
          $('#dashboardVideoPlayer').html('')
          this.player = null
          this.showVideoDialog = false
          this.playVideoUri = ''
        }
      },
      playVideo(uri) {
        this.playVideoUri = uri;
        // this.dialogVisible = true
        $('#dashboardVideoPlayer').append(
          `<div style="position: relative;width: 100%;height: 100%;">
              <i class="el-icon-error"
                 onclick="closeVideoDialog()"
                 style="position: absolute;
                 right: 10px;
                 top: 10px;
                 z-index: 999;
                 color: #fff;
                 cursor: pointer;
                 font-size: 28px;
              "></i>
              <video id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" style="width: 100%; height: 100%;" data-setup="{}">
                <source id="source" src="${this.playVideoUri}" type="application/x-mpegURL">
            </video></div>`
        )
        window.setTimeout(() => {
          this.player = videojs('myVideo', {
            muted: true,
            controls: true,
            preload: 'auto'
          })
          // <!--<source id="source" src="${this.playVideoUri}" type="application/x-mpegURL">-->
          // <!--rtsp://10.32.54.38:554/openUrl/ePBOw6I-->
          this.player.play()
        }, 1000)

        /* this.player.src({
          src: this.videos[0].url,
          type: 'application/x-mpegURL',
          withCredentials: false
        })*/

        // this.player.play()
      },
      changeCategory(val){
        this.temp.category_big = val[0];
        this.temp.category_small = val[1];
      },
      disabledFn () {
        if (this.formData.status == 1) {
          return true;
        } else {
          return false;
        }
      },
      getCase(val){
        // type 1 升序 0 降序
        nextDetailCollect({id:this.formData.id,type:val,}).then(res=>{
          const { id,category_big_name,status,index_code,facility_name, alarm_original_pic,collect_time,finished_time,depart_id,community_id_name,address, latitude,longitude,images,list,remark,platform} = res.data;
          let categoryArr = [Number(res.data.category_big),Number(res.data.category_small)];
          let is_important;
          if(res.data.is_important == null){
            is_important = 1
          }else{
            is_important = res.data.is_important
          }
          let is_audited;
          if(res.data.is_audited == null || res.data.is_audited == 0){
            is_audited = 1
          }else{
            is_audited = res.data.is_audited
          }

          // let query = this.$route.query;
          // let path = this.$route.path;
          // this.$route.replace({ path, query: {id:id,status:status}});


          let query = this.$router.history.current.query
          let path = this.$router.history.current.path
          this.$router.replace({ path, query: {id:id,status:status} });
          this.formData = { id,category_big_name,status,index_code,facility_name, depart_id,alarm_original_pic,collect_time,finished_time,community_id_name,address, latitude,longitude,images,list,is_audited,remark,is_important,categoryArr};
          this.temp = {is_audited,remark,is_important,category_big:res.data.category_big,category_small:res.data.category_small,categoryArr,platform};
          this.mapPoint();
        });
        this.$nextTick(function () {
          this.$refs['dataForm'].clearValidate();
        });
      },
      getCategory(){
        // type 1 升序 0 降序
        categoryList({page:1,pageSize:99999,class:1}).then(res=>{
          this.categoryList = res.data.data

        });
      },
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
      clickVideo(type){
        if(type == 1){
          this.getNow();
        }else if(type == 2){
          this.showVideoDialog = true
          this.playVideo(this.historyVideo);
        }
        // this.showVideoDialog = true
        // this.getData();
        // this.getHistory();
        // this.showVideoDialog = true
        // this.videoData={
        //   source:this.formData.org_name,
        //   code:this.formData.index_code,
        //   address:this.formData.name,
        //   video:'https://vd3.bdstatic.com/mda-mi6yu6w39518uykg/cae_h264/1631056499817188563/mda-mi6yu6w39518uykg.mp4?v_from_s=hkapp-haokan-tucheng&auth_key=1631080314-0-0-bafac110cf549f9655d005c67eb8dbe4&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000186_2'
        // }
        // this.playVideo('rtsp://10.32.54.38:554/openUrl/ePBOw6I');
        // this.playVideo();
      },

      getNow(){
        getNowurl({camera_index_code:this.formData.index_code,protocol:'hls'}).then(res=>{
          this.showVideoDialog = true;
          this.playVideo(res.data.data.url);
        });
      },
      getHistory(){
        getHistoryUrl({
          camera_index_code:this.formData.index_code,
          start_time:this.$moment(this.formData.collect_time).format('YYYY-MM-DD HH:mm:ss'),
          end_time:this.$moment(this.formData.finished_time).format('YYYY-MM-DD HH:mm:ss'),}).then(res=>{
          this.historyVideo = res.data.data.url;
        });
      },


      handleRepeat(row){
        this.showViewDialog = true
        this.repeatData = {
          list:this.formData.list
        }
      },

      getView(){
        collectDetail({id:this.$route.query.id}).then(res=>{
        // collectDetail({id:this.formData.id}).then(res=>{
          // const { intelligent_type_name, create_time,camera_name, latitude,longitude,install_place,alarm_original_pic,list} = res.data
          // this.formData = { intelligent_type_name, create_time,camera_name, latitude,longitude,install_place,alarm_original_pic,list}
          // this.mapPoint();
          const { id,category_big_name,status,index_code,facility_name, collect_time,finished_time,alarm_original_pic,depart_id,community_id_name,address, latitude,longitude,images,list,remark,platform} = res.data;
          let categoryArr = [Number(res.data.category_big),Number(res.data.category_small)];
          let is_important;
          if(res.data.is_important == null){
            is_important = 1
          }else{
            is_important = res.data.is_important
          }
          let is_audited;
          if(res.data.is_audited == null || res.data.is_audited == 0){
            is_audited = 1
          }else{
            is_audited = res.data.is_audited
          }
          this.formData = { id,category_big_name,status,index_code,facility_name, depart_id,alarm_original_pic,collect_time,finished_time,community_id_name,address, latitude,longitude,images,list,};
          this.temp = {is_audited,remark,is_important,category_big:res.data.category_big,category_small:res.data.category_small,categoryArr,platform};
          this.mapPoint();
          // this.getHistory();
        });
      },

      onSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            this.temp.id = this.formData.id;
            // let name =  this.categoryList.filter(item=>{
            //   if(item.id == this.temp.category_big){
            //     return item;
            //   }
            // });
            // this.temp.category_big_name = name[0].name;
            let temp = JSON.parse(JSON.stringify(this.temp))
            let form;
            // temp.category_big = temp.category_small[temp.category_small.length - 1]
            // temp.category_small = temp.category_small[temp.category_small.length - 1];
            if(this.checked == true){
              if(this.formData.list.length > 0){
                temp.ids = this.formData.list.join(',')
              }
              const {id,status,category_big,category_small,remark,is_important,ids,is_audited,platform} = temp;
              form = {id:[id],status,category_big,category_small,remark,is_important,ids,is_audited,platform}
            }else{
              const {id,status,category_big,category_small,remark,is_important,is_audited,platform} = temp;
              form = {id:[id],status,category_big,category_small,remark,is_important,is_audited,platform}
            }
            collectEdit(form).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.getView();
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
  .start_video{
    position: absolute;
    left: 135px;
    top: 50px;
    z-index: 99;
    width: 71px;
    height: 71px;
  }
  .dashboard-video-player {
    position: absolute;
    width: 900px;
    height: 600px;
    background: #fff;
    top: 50%;
    left: 50%;
    z-index:999;
    margin-left: -450px;
    margin-top: -300px;

    .video-js {
      height: 100%;
      width: 100%;
    }
  }
  .dashboard-video-player-box {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(50, 50, 50, 0.2);
    z-index: 9999;

    .el-icon-error {
      position: absolute;
      right: 26.7%;
      top: 18.5%;
      font-size: 32px;
      color: #ccc;
      cursor: pointer;
      z-index: 999;

      &:hover {
        color: #f0f0f0;
        font-size: 34px;
      }
    }

    .dashboard-video-player {
      position: absolute;
      width: 900px;
      height: 600px;
      background: #fff;
      top: 50%;
      left: 50%;
      margin-left: -450px;
      margin-top: -300px;
      z-index:999;
      .video-js {
        height: 100%;
        width: 100%;
      }
    }
  }
  .cont{
    /*height: calc(100vh - 86px);*/
    height: 750px;
    overflow: auto;
  }
  .navHidden{
    .sidebar-container{
      display: none;
    }
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
