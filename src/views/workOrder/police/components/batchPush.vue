<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="400px"
    @close="close"
    top="15vh"
    title="批量推送"
    class="dialogContainer"
    @open="open"
  >
    <el-form ref="dataForm" :rules="rules" :model="temp" label-width="120px">
      <el-form-item label="审核意见：" prop="is_audited">
        <el-radio-group v-model="temp.is_audited">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="事件等级：" prop="is_important">
        <el-radio-group v-model="temp.is_important">
          <el-radio :label="1">一般案件</el-radio>
          <el-radio :label="2">重大案件</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="案件去向：" prop="platform">
        <el-select v-model="temp.platform" placeholder="请选择">
          <!--                 <el-option label="基层治理四平台" :value="1"></el-option>-->
          <!--                 “指挥平台”“一网统管”-->
<!--          <el-option label="请选择" :value="0"></el-option>-->
          <el-option label="指挥平台" :value="1"></el-option>
          <el-option label="一网统管" :value="2"></el-option>
        </el-select>
      </el-form-item>

    </el-form>
    <span slot="footer" class="page_footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </myDialog>
</template>

<script>
  import {collectEdit, collectList,} from '@/api/monitor'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
    },
    props: {
      showDialog: {
        required: true,
        type: Boolean,
        default: false
      },
      pushData: {
        required: true,
        type: Object,
        default: {
          ids: []
        }
      }
    },
    data() {
      return {
        temp: {
          id:[],
          platform:'',
          is_audited:'',
          is_important:1,
        },
        rules: {
          platform: [{ required: true, message: '请选择案件去向', trigger: 'change' }],
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
        this.temp= {
          id:[],
          platform:'',
          is_audited:'',
          is_important:1,
        };
        this.$refs['dataForm'].clearValidate()
      },
      close(){
        this.temp= {
          id:[],
          platform:'',
          is_audited:'',
          is_important:1,
        };
        this.showViewDialog = false;
        this.$refs['dataForm'].clearValidate()
      },

      save() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true;
            this.temp.id = this.pushData.ids;
            let temp = JSON.parse(JSON.stringify(this.temp))
            let form;
            const {id,is_important,is_audited,platform} = temp;
            form = {id,is_important,is_audited,platform}
            collectEdit(form).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.code == 1) {
                this.$emit('insertList')
                this.$message({
                  message: res.message,
                  type: 'success'
                });
                this.showViewDialog = false;
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
