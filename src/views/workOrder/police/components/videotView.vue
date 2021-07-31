<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="80%"
    @close="close"
    top="10vh"
    title="来源设备：ST12314  位置信息：滨湖路133号"
    class="dialogContainer"
    @open="open"
  >
   <div class="video_cont">
     <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic18.nipic.com%2F20111226%2F6647776_214907087000_2.jpg" style="width: 100%;height: 100%;"/>
   </div>

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
      paraData: {
        required: false,
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
        paraLoading:false,
        operatingMode:'',
        updateBtn:true,
        total:0,
        specificationsItem:[''],
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
        listLoading: false,
        listQuery:{
          parameterId:'',
          page:1,
          limit:10
        },
        updateId:undefined,
        dialogFormVisible: false,
        temp: {
          name:'',
          parameterId:undefined,
          deleted:0
        },
        textMap: {
          update: '编辑规格信息',
          create: '新增规格信息'
        },
        dialogStatus: '',
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'change' }],
        },
        name:''
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
    mounted() {

    },
    methods: {
      open(){
        // this.listQuery.parameterId = this.paraData.id
        // this.operatingMode = this.paraData.option.operatingMode
        // this.getList();
        // this.name = this.paraData.option.name
      },
      close(){},
      getList(){
        paraValueList(this.listQuery).then(res=>{
          this.list = res.data.data;
          this.total = res.data.count
        });
      },
      clickRow(row){
        this.$refs.tableList.toggleRowSelection(row)
      },
      handleSelectionChange(val) {
        this.rowInfo = val;
        if(val.length > 1){
          this.updateBtn = true
          this.deleteBtn = true
        }else if(val.length == 1){
          this.updateBtn = false
          this.deleteBtn = false
        }else{
          this.updateBtn = true
          this.deleteBtn = true
        }
      },

      resetTemp() {
        this.temp = {
          // parameterId:undefined,
          name:'',
          parameterId:undefined,
          deleted:0
          // orders:'',
          // isSystem:1,
        }
      },

      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.paraLoading = true
            this.temp.parameterId = this.paraData.id
            paraValueSave(this.temp).then((res) => {
              setTimeout(()=>{
                this.paraLoading = false
              },1000)
              if(res.resp_code == 0) {
                this.getList();
                // this.list.unshift(res.data);
                this.dialogFormVisible = false;
                // debugger
                this.getList();
                this.$message({
                  message: '增加成功',
                  type: 'success'
                });
              }
            }).catch(() => {
              this.paraLoading = false;
            });
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, this.rowInfo[0]); // copy obj
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
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
      handleDelete(row, index) {
        this.$confirm('确定删除此记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = {id: this.rowInfo[0].id};
          paraValueDelete(para).then((res) => {
            this.listLoading = false;
            if(res.resp_code == 0) {
              this.getList();
              //NProgress.done();
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            }
          });
        }).catch(() => {

        });
      },



    }
  }
</script>
<style lang="scss">
  .video_cont{
    width: 100%;
    height: 50vh;
  }
</style>
