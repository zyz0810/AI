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
      <el-form-item label="设备名称" prop="name">{{formData.facility_name}}</el-form-item>
      <el-form-item label="巡查来源" prop="name">{{formData.community_id_name}}</el-form-item>
      <el-form-item label="所在位置" prop="name">{{formData.address}}</el-form-item>
      <el-form-item label="用途" prop="name">AI智能采集</el-form-item>
      <el-form-item label="来源" prop="name">公安</el-form-item>
    </el-form>


  </myDialog>
</template>

<script>
  import {collectDetail} from '@/api/monitor'
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
          facility_name:'',
          community_id_name:'',
          address:'',
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
    methods: {
      open(){
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
        collectDetail({id:this.viewData.id}).then(res=>{
          const { facility_name, community_id_name,address, } = res.data
          this.formData = { facility_name, community_id_name,address, }
        });
      },

    }
  }
</script>
