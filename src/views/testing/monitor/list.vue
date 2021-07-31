<template>
  <div class="app-container">
    <div class="flex">
      <div id='mapDiv' class="mapDiv" style="width: 80%; height: 802px;margin-right: 20px;"></div>
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
    </div>
    <div class="map_info">
      <p class="clr_white">图层管理</p>
      <p>视频点位</p>
      <p>事件点位</p>
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
          iconUrl: point01,
          iconSize: new T.Point(66, 59),
          iconAnchor: new T.Point(34, 59)
        });
        var icon02 = new T.Icon({
          iconUrl: point02,
          iconSize: new T.Point(66, 59),
          iconAnchor: new T.Point(34, 59)
        });
        var icon03 = new T.Icon({
          iconUrl: point03,
          iconSize: new T.Point(66, 59),
          iconAnchor: new T.Point(34, 59)
        });
        var icon04 = new T.Icon({
          iconUrl: point04,
          iconSize: new T.Point(66, 59),
          iconAnchor: new T.Point(34, 59)
        });
        //创建信息窗口对象
        // let marker = new T.Marker(new T.LngLat(117.283042, 31.86119));// 创建标注
        // let marker = new T.Marker(new T.LngLat(this.centerLongitude, this.centerLatitude), {icon: icon});// 创建标注
        // this.map.addOverLay(marker);
        var infoWin1 = new T.InfoWindow();
        let sContent =
          '<div class="f14 baseColor text-center">' +
          '<p ref="enterpriseName" class="bold">新时器烤肉</p>' +
          '<p ref="enterpriseName">监测状态：<span class="red01">超标</span></p>' +
          '</div>';
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
          if(i < 3){
            let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            console.log(point)
            markers[i]  = drawTMaker(point, icon01,this);
            // marker = new T.Marker(point, {icon: icon01});// 创建标注
            // this.map.addOverLay(marker);
          }else if(i < 6){
            let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            markers[i]  = drawTMaker(point, icon02,this);
            //  marker = new T.Marker(point, {icon: icon02});// 创建标注
            // this.map.addOverLay(marker);
          }else if(i < 9){
            let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            markers[i]  = drawTMaker(point, icon03,this);
            //  marker = new T.Marker(point, {icon: icon03});// 创建标注
            // this.map.addOverLay(marker);
          }else {
            let point = new T.LngLat(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7));
            markers[i]  = drawTMaker(point,  icon04,this);
            //  marker = new T.Marker(point, {icon: icon04});// 创建标注
            // this.map.addOverLay(marker);
          }
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
    height: calc(100vh - 135px);
    overflow: auto;
    box-sizing: border-box;
  }
  .mapDiv {
    height: 100%;
  }
  .map_info{
    width: 170px;
    position: fixed;
    bottom: 150px;
    right: 30%;
    z-index: 2000;
  }


</style>
