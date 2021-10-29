<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="15vh"
    title="设备详情"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :model="formData" label-width="120px">
      <el-form-item label="设备名称" prop="name">{{formData.name}}</el-form-item>
      <el-form-item label="巡查来源" prop="name">{{formData.depart_id | filtersDepart}}</el-form-item>
      <el-form-item label="所在位置" prop="name">{{formData.install_place}}</el-form-item>
      <el-form-item label="视频地址" prop="name">{{formData.videoUrl}}</el-form-item>
      <el-form-item label="用途" prop="name">AI智能采集</el-form-item>
      <el-form-item label="来源" prop="name">公安</el-form-item>
    </el-form>


  </myDialog>
</template>

<script>
  import {collectDetail, getNowurl} from '@/api/monitor'
  import draggable from 'vuedraggable'
  export default {
    name: 'equipmentView',
    components: {
      draggable,
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
        formData:{
          name:'',
          depart_id:'',
          install_place:'',
          videoUrl:''
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
    filters: {
      filtersStatus: function (value) {
        // 1启用 2、禁用
        let StatusArr = {1: '启用', 2: '禁用'}
        return StatusArr[value]
      },
      filtersDepart: function (value) {
        let StatusArr = {1: '浦沿中队', 2: '长河中队',3: '西兴中队'};
        return StatusArr[value]
      },
    },
    methods: {
      open(){
        const {name,depart_id,install_place} = this.viewData.option;
        this.formData = {name,depart_id,install_place,videoUrl:''}
        this.getView();
      },
      close(){
        this.formData={
          facility_name:'',
          community_id_name:'',
          address:'',
        };
      },
      getView(){
        getNowurl({camera_index_code:this.viewData.option.index_code,protocol:'hls'}).then(res=>{
          // this.showVideoDialog = true;
          // this.playVideo(res.data.data.url);
          this.formData.videoUrl = res.data.data.url;
        });
      },

    }
  }
</script>
