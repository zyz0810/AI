<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="50%"
    @close="close"
    top="20vh"
    title="新增"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px" style="width: 400px; margin-left:50px;">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="temp.name" placeholder="请输入名称" autocomplete="off" clearable/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.trim="temp.sort" placeholder="请输入排序值" autocomplete="off" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createData()" :loading="paraLoading">确 定</el-button>
      <el-button type="primary" class="btn_gray" @click="showViewDialog = false">取 消</el-button>
    </div>

  </myDialog>
</template>

<script>
  import {addDictionary} from '@/api/dictionary'
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
      paraData: {
        required: true,
        type: Object,
        default: {
          parent_id: '',
          operatorType: "",
          id: ""
        }
      }
    },
    data() {
      return {
        paraLoading:false,
        dialogFormVisible: false,
        temp: {
          name:'',
          sort:'',
          type:'',
          parent_id:''
        },
        dialogStatus: '',
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
          sort: [{ required: true, message: '请输入序号', trigger: 'change' }],
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
        this.temp.parent_id = this.paraData.parent_id;
        this.temp.type = this.paraData.operatorType;
      },
      close(){},

      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            addDictionary(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              this.showViewDialog = false;
              console.log(0)
              if(res.code == 1) {
                if(this.paraData.operatorType == 1){
                  this.$emit('insertParent');
                }else if(this.paraData.operatorType == 2){
                  this.$emit('insertChilden');
                }
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
