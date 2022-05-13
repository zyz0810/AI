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
      <el-form-item label="案件去向：" prop="whereabouts">
        <el-select v-model="temp.whereabouts" placeholder="请选择">
          <!--                 <el-option label="基层治理四平台" :value="1"></el-option>-->
          <!--                 “指挥平台”“一网统管”-->
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
      pushData: {
        required: true,
        type: Object,
        default: {
          list: []
        }
      }
    },
    data() {
      return {
        temp: {
          whereabouts:'',
          is_audited:'',
          is_important:'',
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
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
        // this.getList();
      },
      close(){},

      save() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            const tempData = Object.assign({}, this.temp);
            this.$delete(tempData,'createTime')
            this.$delete(tempData,'updateTime')
            paraValueUpdate(tempData).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                // const index = this.list.findIndex(v => v.id === this.temp.id);
                // this.list.splice(index, 1, res.data);
                this.getList();
                this.dialogFormVisible = false;
                this.$message({
                  message: '修改成功',
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
