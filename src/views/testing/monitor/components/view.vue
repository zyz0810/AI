<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="事件列表"
    class="dialogContainer"
    @open="open"
  >
    <el-table v-loading="listLoading" :data="list" :height="tableHeight"
              element-loading-text="拼命加载中" fit ref="tableList">

      <el-table-column label="事件编号" align="center" prop="number_no"></el-table-column>
      <el-table-column label="违规类型" align="center" prop="intelligent_type_name">
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{scope.row.type | filtersType}}</span>-->
        <!--          </template>-->
      </el-table-column>
      <el-table-column label="巡查来源" align="center" prop="">
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{scope.row.source | filtersSource}}</span>-->
        <!--          </template>-->
      </el-table-column>
      <el-table-column label="设备名称" align="center" prop="camera_name"></el-table-column>
      <el-table-column label="报警点位" align="center" prop="install_place"></el-table-column>
      <el-table-column label="上报时间" align="center" prop="create_time"></el-table-column>
      <el-table-column label="事件状态" align="center" prop="">
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{scope.row.status | filtersStatus}}</span>-->
        <!--          </template>-->
      </el-table-column>
    </el-table>
  </myDialog>
</template>

<script>
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
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
          source: "",
          address: "",
          video: ""
        }
      }
    },
    data() {
      return {
        tableHeight:200,
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
        listLoading: false,
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
      filtersStatus: function(value) {
        let StatusArr = {0:'禁用', 1:'启用'}
        return StatusArr[value]
      }
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
      },
      close(){},
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
