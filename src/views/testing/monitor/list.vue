<template>
  <div class="app-container">
    <div class="flex" style=" align-items:stretch;">
      <el-tabs type="card" v-model="activeName" style="flex:1;height: 787px;margin-right: 10px;">
        <el-tab-pane label="地图展示" name="first">
          <div id='mapDiv' class="mapDiv"></div>
<!--          <div class="map_info f14 text-center">-->
<!--            <p class="clr_white">图层管理</p>-->
<!--            <p><el-switch v-model="videoSwitch" active-color="#13ce66" class="mr_10" @change="handelPoint"></el-switch>视频点位</p>-->
<!--            <p><el-switch v-model="videoSwitch2" active-color="#13ce66" class="mr_10" @change="handelCase"></el-switch>事件点位</p>-->
<!--          </div>-->
        </el-tab-pane>
      </el-tabs>
      <el-tabs type="card" v-model="activeName" style="width: 360px;">
        <el-tab-pane label="最新事件" name="first">
          <ul class="img_list w100 bg_white">
            <li v-for="(item,index) in list" :key="index" class="mb_20" @click="handleView(item)">
              <div class="img_list_top clr_white">
                <img class="img_list_img" :src="item.alarm_original_pic">
                <span class="block f14 type_tag">{{item.category_big_name}}</span>
                <!--//事件状态-->
                <p class="f14 time">{{$moment(item.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</p>
              </div>
              <div class="weui-cell f14">
                <div class="weui-cell__bd">
                  <p>报警点位：</p>
                  <p>{{item.address}}</p>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <caseView :showDialog.sync="showViewDialog" :caseData="caseData"></caseView>
    <!--<videoView :showDialog.sync="showVideoDialog" :caseData="videoData"></videoView>-->
    <div v-show="showVideoDialog" class="dashboard-video-player-box">
      <div id="dashboardVideoPlayer" class="dashboard-video-player">
        <!--<video id="myVideo" class="video-js vjs-default-skin vjs-big-play-centered" controls data-setup="{}">-->
        <!--<source id="source" src="rtsp://10.32.54.38:554/openUrl/ePBOw6I" autoplay type="rtsp/flv">-->
        <!--</video>-->
      </div>
    </div>

  </div>
</template>

<script>
  import wgs84_to_gcj02 from "@/utils/gcj02towgs84";
  import dragDialog from '@/directive/el-drag-dialog'
  import echarts from 'echarts'
  import {pointList, collectList, getNowurl, getHistoryUrl} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import caseView from "./components/view";
  import videoView from "./components/videoView";
  import point01 from '@/assets/image/point01.png' // 引入刚才的map.js 注意路径
  import point02 from '@/assets/image/point02.png' // 引入刚才的map.js 注意路径
  import point03 from '@/assets/image/point03.png' // 引入刚才的map.js 注意路径
  import point04 from '@/assets/image/point04.png' // 引入刚才的map.js 注意路径
  import point05 from '@/assets/image/point05.png' // 引入刚才的map.js 注意路径
  import LineChart from '@/components/Charts/LineChart'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  export default {
    name: 'parameterList',
    directives: {waves,dragDialog,
      dragDiv: function(el) {
        let dragBox = el; //获取当前元素
        // let dragBox = el.querySelector('.my_drag')
        dragBox.onmousedown = e => {
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft;
          let disY = e.clientY - dragBox.offsetTop;
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            //移动当前元素
            dragBox.style.left = left + "px";
            dragBox.style.top = top + "px";
          };
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null;
          };
        };
      }},
    mixins: [map],
    components: {
      draggable,
      Pagination,
      caseView,
      LineChart,
      videoView
    },
    data() {
      return {
        offectNum:1,
        caseData:{},
        videoData:{},
        pointList:[],
        caseList:[],
        activeName:'first',
        videoSwitch:true,
        videoSwitch2:false,
        list: [],
        showViewDialog:false,
        showVideoDialog:false,
        total:0,
        listQuery: {
          Status:1,
          start_time:'',
          end_time:'',
          page: 1,
          pageSize: 10
        },
        zoom:13,
        centerLatitude:'30.178653',//中心纬度
        centerLongitude:'120.19519',//中心经度
        activeId:'',
        playVideoUri:'',
        player: null
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    filters: {
      filtersStatus: function (value) {
        let StatusArr = {1: '未审核', 2: '已审核'};
        return StatusArr[value]
      },
      filtersAudited: function (value) {
        let StatusArr = {1: '立案', 2: '暂不立案',3: '在学习', 4: '结案'};
        return StatusArr[value]
      },
      filtersImportant: function (value) {
        let StatusArr = {1: '一般案件', 2: '重大案件'};
        return StatusArr[value]
      },
    },
    mounted() {
      this.onLoad();
      this.getPoint();
      this.getNew();
      window.handleCase = this.handleCase;
      window.handleVideo = this.handleVideo;
      window.closeVideoDialog = this.handleVideoClose;
      // this.$once('hook:beforeDestroy', () => {
      //   this.player.dispose();
      // })
      this.initPlayer()
    },
    methods: {
      handleVideoClose(id) {
        // this.player.dispose()
        $('#myVideo'+id).remove()
        $('#myVideoContent'+id).remove()
        console.log('#myVideo'+id)
        console.log('#myVideoContent'+id)
        console.log($('#dashboardVideoPlayer').children().length)
        if($('#dashboardVideoPlayer').children().length < 1){
          this.player.dispose()
          $('#dashboardVideoPlayer').html('')
          this.player = null
          this.showVideoDialog = false
          this.playVideoUri = ''
        }
        // $('#dashboardVideoPlayer').html('')
        // this.player = null
        // this.showVideoDialog = false
        // this.playVideoUri = ''
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
          // $('#myVideo').remove()
          // $('#dashboardVideoPlayer').html('')
          $('#myVideo'+id).remove()
          $('#myVideoContent'+id).remove()

          if($('#dashboardVideoPlayer').children().length < 1){
            this.player.dispose()
            $('#dashboardVideoPlayer').html('')
            this.player = null
            this.showVideoDialog = false
            this.playVideoUri = ''
          }
          // this.player = null
          // this.showVideoDialog = false
          // this.playVideoUri = ''
        }
      },

      playVideo(uri,txt) {

        // let videoPlayer = $("#myVideo").get(0);
        // if (typeof (videoPlayer) != "undefined") {
        //   let myPlayer = videojs('myVideo');
        //   myPlayer.dispose();
        // }

        this.playVideoUri = uri;
        // this.dialogVisible = true
        let id = "myVideo"+txt.id;
        let divId = "myVideoContent"+txt.id;

        $('#dashboardVideoPlayer').append(
          `<div id="`+ divId +`" style="position: fixed;width: 450px;height: 300px; padding-top: 20px;left:`+ Number(20)*this.offectNum +`px;top:`+ Number(20)*this.offectNum +`px;" class="my_drag">
              <i class="el-icon-error"
                 onclick="closeVideoDialog(`+ txt.id +`)"
                 style="position: absolute;
                 right: 10px;
                 top: 10px;
                 z-index: 999;
                 color: #fff;
                 cursor: pointer;
                 font-size: 28px;
              "></i>
              <video id="`+ id +`" class="video-js vjs-default-skin vjs-big-play-centered" style="width: 100%; height: 100%;" data-setup="{}">
     <source id="source" src="${this.playVideoUri}" type="application/x-mpegURL">
            </video></div>`
          )
        this.offectNum++;
        $('#'+divId).mousedown(function (e) {
          console.log(e)
          console.log('狂口高：'+e.clientY)
          let dragBox =  $('#'+divId)[0];
          console.log(' 元素')
          console.log('元素高：'+dragBox.offsetTop)
          //算出鼠标相对元素的位置
          let disX = e.clientX - dragBox.offsetLeft;
          let disY = e.clientY - dragBox.offsetTop;
          document.onmousemove = e => {
            //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            let left = e.clientX - disX;
            let top = e.clientY - disY;
            //移动当前元素
            dragBox.style.left = left + "px";
            dragBox.style.top = top + "px";
          };
          document.onmouseup = e => {
            //鼠标弹起来的时候不再移动
            document.onmousemove = null;
            //预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null;
          };
        })
        window.setTimeout(() => {
          this.player = videojs(id, {
            muted: true,
            controls: true,
            preload: 'auto',
          })
          // <source id="source" src="${this.playVideoUri}" type="video/mp4">
          // <source id="source" src="${this.playVideoUri}" type="rtsp/flv">
          //   <source id="source" src="${this.playVideoUri}" type="application/x-mpegURL">
            // <!--rtsp://10.32.54.38:554/openUrl/ePBOw6I-->
          this.player.play()
          console.log('获取视频')
          console.log(this.player)

        }, 1000)




        /* this.player.src({
          src: this.videos[0].url,
          type: 'application/x-mpegURL',
          withCredentials: false
        })*/

        // this.player.play()
      },


      handleView(row){
        this.$router.push({path:'/workOrder/policeView',query: {id:row.id,status:row.status}})
      },
      getNew(){
        collectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      handelPoint(val){
        // caseList
        // ：active-value得为true
        // ：inactive-value得为false
        // console.log(val)
        // let flag = row.enabled; //保存点击之后v-modeld的值(true，false)
        // row.enabled = !row.enabled; //保持switch点击前的状态
        // let paras = {
        //   id: row.id,
        //   enabled: flag,
        // };
        if(val == true){
          this.getPoint();
        }else{
          this.pointList = [];
          this.mapPoint('point')
        }

      },
      handelCase(val){
        if(val == true){
          this.getCase();
        }else{
          this.caseList = [];
          this.mapPoint('case')
        }

        // caseList
        // ：active-value得为true
        // ：inactive-value得为false
        // console.log(val)
        // let flag = row.enabled; //保存点击之后v-modeld的值(true，false)
        // row.enabled = !row.enabled; //保持switch点击前的状态
        // let paras = {
        //   id: row.id,
        //   enabled: flag,
        // };

      },
      getNow(txt){
        // 33010851001310004486
        // txt.index_code
        console.log(txt.index_code)
        // this.showVideoDialog = true;
        // this.playVideo('https://vd3.bdstatic.com/mda-mi6yu6w39518uykg/cae_h264/1631056499817188563/mda-mi6yu6w39518uykg.mp4',txt);
        getNowurl({camera_index_code:txt.index_code,protocol:'hls'}).then(res=>{
          this.showVideoDialog = true;
          this.playVideo(res.data.data.url,txt);
        });
      },
      getHistory(txt){
        getHistoryUrl({
          camera_index_code:txt.index_code,
          start_time:this.$moment(txt.collect_time).format('YYYY-MM-DD HH:mm:ss'),
          end_time:this.$moment(txt.finished_time).format('YYYY-MM-DD HH:mm:ss')}).then(res=>{
          this.showVideoDialog = true;
          this.playVideo(res.data.data.url);
        });
      },
      getPoint(){
        pointList({type:'allList',class:1,status:1}).then(res=>{
          this.pointList = res.data;
          this.mapPoint('point')
        });
      },
      getCase(){
        pointList({type:'allList'}).then(res=>{
          this.caseList = res.data;
          this.mapPoint('case')
        });
      },
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // 添加地图类型控件
        // this.addCtrl()
        // this.map.setStyle('indigo');
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';

        var countries = [];
        var countriesOverlay = new T.D3Overlay(init,redraw);

        let that = this;
        d3.json("https://geo.datav.aliyun.com/areas_v3/bound/330108.json", function (data) {
          console.log( data.features)
          // countries = data.features;
          let a = data.features;
          let brr = a[0].geometry.coordinates[0][0].map(item=>{
            return wgs84_to_gcj02(item[0],item[1])
          })
          a[0].geometry.coordinates[0][0] = brr
          countries = a;
          that.map.addOverLay(countriesOverlay)
          countriesOverlay.bringToBack();
          countriesOverlay.bringToBack();
        });

        function init(sel, transform) {
          let upd = sel.selectAll('path.geojson').data(countries);
          upd.enter()
            .append('path')
            .attr("class", "geojson")
            .attr('stroke', '#0c14b8')
            .attr('stroke-width', function (d) {
              return 2
            })
            .attr('fill', function (d, i) {
              return d3.hsl(Math.random() * 360, 0.9, 0.5)
            })
            .attr('fill-opacity', '0')
        }

        function redraw(sel, transform) {
          sel.selectAll('path.geojson').each(
            function (d, i) {
              d3.select(this).attr('d', transform.pathFromGeojson)
                .on("mouseover",function(){
                  console.log('这是点击了',);
                })
            }
          )

        }

      },
      mapPoint(type){
        //创建图片对象
        // this.map.clearOverLays();
        var icon01 = new T.Icon({
          iconUrl: point05,
          iconSize: new T.Point(32, 38),
          // iconAnchor: new T.Point(34, 59)
        });
        var icon02 = new T.Icon({
          iconUrl: point02,
          iconSize: new T.Point(66, 59),
          // iconAnchor: new T.Point(34, 59)
        });
        let markers = []

        if(type == 'point'){
          // if(this.pointList.length>0){
          for (let i = 0; i < this.pointList.length; i++) {
            // var marker
            let point = new T.LngLat(this.pointList[i].longitude, this.pointList[i].latitude);
            markers[i]  = drawTMaker(point, icon01,this,this.pointList[i]);
          }
          // }

          //往地图上添加一个marker。传入参数坐标信息lnglat。传入参数图标信息。
          function drawTMaker(lnglat,icon,that,txt){
            var marker =  new T.Marker(lnglat, {icon: icon});
            that.map.addOverLay(marker);
            marker.addEventListener("click", function (m) {
              console.log(m)
              let infoWin1 = new T.InfoWindow();
              console.log(txt)
              let aa = JSON.stringify(txt).replace(/"/g, '&quot;')
              let sContent =
                '<div class="point_info">' +
                '<p class="clr_white bg_blue">' + txt.create_time + '</p>' +
                '<div class="flex baseColor">'+
                '<div class="flex-item" onClick="handleVideo(1,' + aa + ')"><i class="el-icon-video-camera-solid f20"></i>实时视频</div>' +
                // '<div class="flex-item" onClick="handleVideo(2,'+aa+')"><i class="el-icon-video-camera f20"></i>历史视频</div>' +
                '</div>' +
                '<p class="f12 time">监控名称：' + txt.name + '</p>' +
                '<p class="f12 time">所属区域：' + txt.depart_name + '</p>' +
                '<p class="f12 time">来源区域：' + txt.community_name + '</p>' +
                '<p class="f12 time">所在地址：' + txt.install_place + '</p>' +
                '<p class="f12 time text-right baseColor" onClick="handleCase('+txt.id+')">事件列表</p>' +
                '</div>';
              infoWin1.setContent(sContent);
              marker.openInfoWindow(infoWin1);

            });// 将标注添加到地图中
            return marker;
          }
        }else if(type == 'case'){
          // if(this.pointList.length>0){
          for (let i = 0; i < this.caseList.length; i++) {
            // var marker
            let point = new T.LngLat(this.caseList[i].longitude, this.pointList[i].latitude);
            markers[i]  = drawTMakerCase(point, icon02,this,this.caseList[i]);
          }
          // }

          //往地图上添加一个marker。传入参数坐标信息lnglat。传入参数图标信息。
          function drawTMakerCase(lnglat,icon,that,txt){
            var marker =  new T.Marker(lnglat, {icon: icon});
            that.map.addOverLay(marker);
            marker.addEventListener("click", function (m) {
              that.showViewDialog = true;
              that.videoData={
                source:txt.org_name,
                address:txt.name,
                video:'https://vd3.bdstatic.com/mda-mi6yu6w39518uykg/cae_h264/1631056499817188563/mda-mi6yu6w39518uykg.mp4?v_from_s=hkapp-haokan-tucheng&auth_key=1631080314-0-0-bafac110cf549f9655d005c67eb8dbe4&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000186_2'
              }
            });// 将标注添加到地图中
            return marker;
          }
        }
      },

      handleCase(txt){
        this.showViewDialog = true;
        this.caseData = {id:txt}
      },
      handleVideo(type,txt){
        if(type == 1){
          this.getNow(txt);
        }else if(type == 2){
          this.getHistory(txt);
        }

        // this.getHistory(txt);
        // this.showVideoDialog = true
        // this.playVideo('rtsp://10.32.54.38:554/openUrl/C8qDr2M');
        // this.playVideo('https://vd3.bdstatic.com/mda-mi6yu6w39518uykg/cae_h264/1631056499817188563/mda-mi6yu6w39518uykg.mp4?v_from_s=hkapp-haokan-tucheng&auth_key=1631080314-0-0-bafac110cf549f9655d005c67eb8dbe4&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000186_2');
        // this.playVideo();
        // this.videoData={
        //   source:txt.org_name,
        //   code:txt.index_code,
        //   address:txt.name,
        //   video:'https://vd3.bdstatic.com/mda-mi6yu6w39518uykg/cae_h264/1631056499817188563/mda-mi6yu6w39518uykg.mp4?v_from_s=hkapp-haokan-tucheng&auth_key=1631080314-0-0-bafac110cf549f9655d005c67eb8dbe4&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=3000186_2'
        // }
      },
      handleTab(val){
        this.activeId = val;
      }

    }
  }
</script>
<style lang="scss" scoped>
  @import './../../../styles/variables.scss';

  .dashboard-video-player-box {
    position: fixed;
    /*width: 100vw;*/
    /*height: 100vh;*/
    /*width: 450px;*/
    /*height: 320px;*/
    top: 20px;
    left: 20px;
    background-color: rgba(50, 50, 50, 0.8);
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
      /*position: absolute;*/
      /*width: 900px;*/
      /*height: 600px;*/
      /*width: 450px;*/
      /*height: 300px;*/
      /*background: #fff;*/
      /*<!--top: 50%;-->*/
      /*<!--left: 50%;-->*/
      /*margin-left: -450px;*/
      /*margin-top: -300px;*/
      /*top: 0;*/
      /*left: 0;*/
      /*z-index:999;*/
      .video-js {
        height: 100%;
        width: 100%;
      }
    }
  }
  .app-container{
    height: calc(100vh - 110px);
    padding: 0 20px 20px;
    overflow: auto;
    background: #fff;
    box-sizing: border-box;
  }
  /deep/.tdt-infowindow-content-wrapper{
    padding: 0;
    .tdt-infowindow-content {
      margin: 0;
      .point_info{
        &>p,&>div{
          margin: 0;
          padding: 0 10px;
          line-height: 2;
        }
      }

    }
  }

  /*/deep/.el-tab-pane{*/
  /*  width: 500px;*/
  /*}*/
  .mapDiv {
    width: 100%;
    height: 716px;
  }
  .map_info{
    width: 170px;
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 2000;
    border: 1px solid #0a76a4;
    border-radius: 10px;
    line-height: 3;
    background: #fff;
    p{
      &:nth-child(1){
        background: #0a76a4;
        border-bottom: 1px solid #0a76a4;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      &:nth-child(2){
        border-bottom: 1px solid #0a76a4;
      }
    }

  }
  .img_list{
    padding: 20px;
    li{
      margin: 0 0 20px;
    }
  }

  /deep/.el-tabs--border-card{
    border: none;
    box-shadow: none;
  }
  /deep/.el-tabs--border-card>.el-tabs__header{
    background-color: #fff !important;
    border: none;
  }

  /deep/.el-tabs--card>.el-tabs__header .el-tabs__nav{
    /*border: 1px solid #DCDFE6;*/
    /*border-bottom: 1px solid #f3f3f3;*/
    /*border-bottom: 1px solid red;*/
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  /deep/.el-tabs__content{
    height: 764px;
    padding: 20px;
    overflow: auto;
    background-color: rgb(243,243,243);
    border: 1px solid #DCDFE6;
    border-top: none;
   -webkit-box-shadow: 0 2px 4px 0 rgb(243,243,243);
   box-shadow: 0 2px 4px 0 rgb(243,243,243);
}
  /deep/.el-tabs__header{
    margin: 0;
  }
  /deep/.el-tabs--card>.el-tabs__header .el-tabs__item.is-active{
    color: #000;
    /*border-top: 2px solid #DCDFE6;*/
    /*border-left: 2px solid #DCDFE6;*/
    border-bottom: 1px solid #f3f3f3;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: rgb(243,243,243);
  }

</style>
