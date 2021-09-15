<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="6vh"
    title="事件列表"
    class="dialogContainer"
    @open="open"
  >
    <el-table v-loading="listLoading" :data="list" :height="tableHeight"
              element-loading-text="拼命加载中" fit ref="tableList">
      <el-table-column type="selection" width="80" align="center"></el-table-column>
      <el-table-column label="事件编号" align="center" prop="number_no"></el-table-column>
      <el-table-column label="违规类型" align="center" prop="category_big_name"></el-table-column>
      <el-table-column label="巡查来源" align="center" prop="community_id_name"></el-table-column>
      <el-table-column label="设备名称" align="center" prop="facility_name"></el-table-column>
      <el-table-column label="报警点位" align="center" prop="address"></el-table-column>
      <el-table-column label="上报时间" align="center" prop="collect_time">
        <template slot-scope="scope">
          <span>{{$moment(scope.row.collect_time).format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="事件状态" align="center" prop="">
        <template slot-scope="scope">
          <span>{{scope.row.status | filtersStatus}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize"
                @pagination="getList" class="text-right"/>
  </myDialog>
</template>

<script>
  import {collectList, } from '@/api/monitor'
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
      caseData: {
        required: true,
        type: Object,
        default: {
          id: "",
        }
      }
    },
    data() {
      return {
        tableHeight:200,
        total:0,
        list: [],
        listLoading: false,
        listQuery:{
          facility_id:'',
          page:1,
          pageSize:10,
        },
        seeking:true,
        textMap: '',
        videoOptions: {
          controls:true,
          src:
            "xxxxxxx.mp4", // url地址
        },
        player: null,
        playTime:'',
        seekTime:'',
        current:'',
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

    methods: {
      open(){
        this.textMap = '设备来源：'+this.caseData.source+' 位置信息：'+this.caseData.address;
        this.$nextTick(function() {
          // this.$refs.filter-container.offsetHeight
          let height = window.innerHeight - this.$refs.tableList.$el.offsetTop - 190;
          if(height>100){
            this.tableHeight = height
          }else{
            this.tableHeight = 100
          }
          // 监听窗口大小变化
          const self = this;
          window.onresize = function() {
            let height = window.innerHeight - self.$refs.tableList.$el.offsetTop - 190;
            if(height>100){
              self.tableHeight = height
            }else{
              self.tableHeight = 100
            }
          };
        });
        this.listQuery.facility_id = this.caseData.id;
        this.getList();
      },
      close(){},
      getList() {
        collectList(this.listQuery).then(res => {
          this.list = res.data.data
          this.total = res.data.total
        });
      },
      initVideo() {
        //原生初始化视频方法
        let myVideo = this.$refs.video;
        //ontimeupdate
        myVideo.ontimeupdate = function () {
          myFunction()
        };
        let _this = this;

        function myFunction() {
          let playTime = myVideo.currentTime
          setTimeout(function () {
            localStorage.setItem("cacheTime", playTime)
          }, 500)
          let time = localStorage.getItem("cacheTime")
          // 当前播放位置发生变化时触发。
          if (playTime - Number(time) > 2) {
            myVideo.currentTime = Number(time)
          } else {
          }
        };
      },

        // 播放回调
        onPlayerPlay(player) {
          // this.globalSetting = true
          console.log("player play!", player);
          // document.getElementsByClassName("vjs-control-bar").style.display = "block";
          // document.getElementsByClassName("vjs-control-bar").style.display = "block";
        },

        // 暂停回调
        onPlayerPause(player) {
          // this.globalSetting.controls = false;
          // console.log("player pause!", player);
          // var video = document.getElementById("video");
          // video.controls=false;
          // document.getElementsByClassName("vjs-control-bar").style.display = "none";
        },
    }
  }
</script>
<style lang="scss" scoped>
  .video_cont{
    width: 100%;
    height: 560px;
  }
</style>
