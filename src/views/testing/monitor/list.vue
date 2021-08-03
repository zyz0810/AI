<template>
  <div class="app-container">
    <div class="flex" style=" align-items:stretch;">
      <el-tabs type="card" v-model="activeName" style="width: 80%; height: 787px;margin-right: 10px;">
        <el-tab-pane label="地图展示" name="first">
          <div id='mapDiv' class="mapDiv"></div>
          <div class="map_info f14 text-center">
            <p class="clr_white">图层管理</p>
            <p><el-switch v-model="videoSwitch" active-color="#13ce66" class="mr_10"></el-switch>视频点位</p>
            <p><el-switch v-model="videoSwitch2" active-color="#13ce66" class="mr_10"></el-switch>事件点位</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="最新事件" name="first">
          <ul class="img_list w100 bg_white">
            <li v-for="(item,index) in list" :key="index" class="mb_20">
              <div class="img_list_top clr_white">
                <img class="img_list_img" :src="item.image">
                <span class="block f15 type_tag">{{item.type | filtersType}}</span>
                <p class="f15 time">{{item.time}}</p>
              </div>
              <div class="weui-cell f15">
                <div class="weui-cell__bd">
                  <p>报警点位：{{item.address}}</p>
                </div>
              </div>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>

    </div>

  </div>
</template>

<script>
  import echarts from 'echarts'
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import point01 from '@/assets/image/point01.png' // 引入刚才的map.js 注意路径
  import point02 from '@/assets/image/point02.png' // 引入刚才的map.js 注意路径
  import point03 from '@/assets/image/point03.png' // 引入刚才的map.js 注意路径
  import point04 from '@/assets/image/point04.png' // 引入刚才的map.js 注意路径
  import point05 from '@/assets/image/point05.png' // 引入刚才的map.js 注意路径
  import LineChart from '@/components/Charts/LineChart'
  import map from '@/components/Map/map' // 引入刚才的map.js 注意路径
  export default {
    name: 'parameterList',
    directives: {waves},
    mixins: [map],
    components: {
      draggable,
      Pagination,
      paraView,
      LineChart
    },
    data() {
      return {
        activeName:'first',
        videoSwitch:true,
        videoSwitch2:false,
        list: [{
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
        },],
        showSearchDialog:false,
        showCompanyDialog:false,
        total:1,
        companyList: [{
          name:'列表1',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:1
        },{
          name:'列表2',
          address:'杭州市',
          time:1298963414,
          num:1,
          status:2
        }],
        companyListLoading: false,
        listQuery: {
          name: '',
          status: undefined,
          page: 1,
          limit: 10
        },
        temp:{
          area:'',
          name:''
        },
        zoom:12,
        centerLatitude:'30.20835',//中心纬度
        centerLongitude:'120.21194',//中心经度
        activeId:'',
        listLoading: false,
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
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
      companyShow(){

      },
      handleFilter(){

      },
      onLoad() {
        let T = window.T
        this.map = new T.Map('mapDiv')
        this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
        // 添加地图类型控件
        // this.addCtrl()
        // // 普通标注
        let site = [
          { lng: 117.283042, lat: 31.86119 },
          { lng: 116.41238, lat: 40.07689 },
          { lng: 116.34143, lat: 40.03403 },
        ]
        // this.markerPoint(site)
        //创建图片对象
        var icon01 = new T.Icon({
          iconUrl: point05,
          iconSize: new T.Point(30, 51),
          iconAnchor: new T.Point(34, 59)
        });
        // var icon02 = new T.Icon({
        //   iconUrl: point02,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        // var icon03 = new T.Icon({
        //   iconUrl: point03,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        // var icon04 = new T.Icon({
        //   iconUrl: point04,
        //   iconSize: new T.Point(66, 59),
        //   iconAnchor: new T.Point(34, 59)
        // });
        //创建信息窗口对象
        // let marker = new T.Marker(new T.LngLat(117.283042, 31.86119));// 创建标注
        // let marker = new T.Marker(new T.LngLat(this.centerLongitude, this.centerLatitude), {icon: icon});// 创建标注
        // this.map.addOverLay(marker);
        var infoWin1 = new T.InfoWindow();
        let sContent =
          '<ul class="img_list w100"><li> <div class="img_list_top clr_white">' +
          '<img class="img_list_img" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg">' +
          '<span class="block f15 type_tag">暴露垃圾</span>' +
          ' <p class="f15 time">2021-05-05 21:10:50</p>' +
          '</div>' +
          '<div class="weui-cell f15">' +
          '<div class="weui-cell__bd"> <p>报警点位：</p><p>滨江区195号</p></div>' +
          '<div class="weui-cell__ft"> <span class="block ml_20 baseColor bold state_type">未审核</span> </div>' +
          '</div>' +
          '</li>' +
          '</ul>';
        infoWin1.setContent(sContent);
        // 随机向地图添加25个标注
        let bounds = this.map.getBounds();
        let sw = bounds.getSouthWest();
        let ne = bounds.getNorthEast();
        let lngSpan = Math.abs(sw.lng - ne.lng);
        let latSpan = Math.abs(ne.lat - sw.lat);
        var markers = []
        for (let i = 0; i < 12; i++) {
          // var marker

            let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            console.log(point)
            markers[i]  = drawTMaker(point, icon01,this);
            // marker = new T.Marker(point, {icon: icon01});// 创建标注
            // this.map.addOverLay(marker);

        }

//往地图上添加一个marker。传入参数坐标信息lnglat。传入参数图标信息。
        function drawTMaker(lnglat,icon,that){
          var marker =  new T.Marker(lnglat, {icon: icon});
          that.map.addOverLay(marker);
          marker.addEventListener("click", function (m) {
            console.log(m)
            marker.openInfoWindow(infoWin1);
            that.showSearchDialog = true;
          });// 将标注添加到地图中
          return marker;
        }





        // this.map.setStyle('indigo');
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';

      },
      handleTab(val){
        this.activeId = val;
      }

    }
  }
</script>
<style lang="scss" scoped>
  @import './../../../styles/variables.scss';
  .app-container{
    height: calc(100vh - 110px);
    padding: 0 20px 20px;
    overflow: auto;
    background: #fff;
    box-sizing: border-box;
  }
  /deep/.tdt-infowindow-content p{
    margin: 0;
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
