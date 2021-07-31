<template>
  <myDialog
    :visible.sync="showViewDialog"
    :close-on-click-modal="false"
    width="60%"
    @close="close"
    top="10vh"
    title=""
    class="dialogContainer"
    @open="open"
  >
    <div class="view_tab flex text-center">
      <div :class="['flex-item',activeId == 0 ? 'active':'']" data-id="0" @click="handleTab(0)">实时工况</div>
      <div :class="['flex-item',activeId == 1 ? 'active':'']" data-id="1" @click="handleTab(1)">趋势曲线</div>
      <div :class="['flex-item',activeId == 2 ? 'active':'']" data-id="2" @click="handleTab(2)">企业信息</div>
      <div :class="['flex-item',activeId == 3 ? 'active':'']" data-id="3" @click="handleTab(3)">设备信息</div>
    </div>
    <div v-show="activeId == 0">
      <div class="flex baseColor">
        <el-form style="flex: 3">
          <el-form-item label="餐企名称：">新石器烤肉</el-form-item>
          <el-form-item label="检测状态："><span class="red01">超标</span></el-form-item>
          <el-form-item label="监测时间：">2021-8-4 12:20:08</el-form-item>
        </el-form>
        <div style="flex: 5">
          <div class="table_title text-center">污染物排放情况（mg/m3）</div>
          <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" fit ref="tableList" border class="table_noBg">
            <el-table-column label="污染物类型" align="center" prop="name"></el-table-column>
            <el-table-column label="实测值" align="center" prop="createUserName"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div class="flex mt_20">
        <ul class="clr_white flex view_ul text-center" style="flex: 3">
          <li class="flex-item">
            <div class="bg_yellow">
              <i class="iconfont icon-wendu f26"></i>
              <p>温度</p>
            </div>
            <p class="num">32℃</p>
          </li>
          <li class="flex-item">
            <div class="bg_blue">
              <i class="iconfont icon-wenshidu1 f26"></i>
              <p>湿度</p>
            </div>
            <p class="num">32rh</p>
          </li>
          <li class="flex-item">
            <div class="bg_green">
              <i class="iconfont icon-fengsu f26"></i>
              <p>风速</p>
            </div>
            <p class="num">32m/s</p>
          </li>
          <li class="flex-item">
            <div class="bg_purple">
              <i class="iconfont icon-zaosheng f26"></i>
              <p>噪声</p>
            </div>
            <p class="num">32Hz</p>
          </li>
        </ul>
        <div style="flex: 5">
          <div class="table_title text-center">污染物排放情况（mg/m3）</div>
          <el-table v-loading="listLoading" :data="list" element-loading-text="拼命加载中" fit border ref="tableList">
            <el-table-column label="设备类型" align="center" prop="name"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span>{{$moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
    </div>
    <div v-if="activeId == 1">
      <div class="f16 txtColor text-center">
        <span class="m_r30">餐企名称：新石器烤肉</span>
        <span>设备名称：新石器烤肉</span>
      </div>
      <div class="bg_shadow mt_20 p20 line_chart">
        <p class="f14 txtColor text-center mt_10 mb_10">最近24小时污染物排放情况</p>
        <LineChart :chartData="lineData" :BarChartLegend="PieChartLegend" height="25vh" divwidth="100%"></LineChart>
      </div>
    </div>
    <table v-if="activeId == 2" class="company_table f14">
      <tr>
        <td class="baseColor">餐企名称</td>
        <td class="txtColor">新石器烤肉</td>
        <td class="baseColor">餐企简称</td>
        <td class="txtColor">新石器</td>
        <td class="baseColor">信用代码</td>
        <td class="txtColor">986843451215445</td>
      </tr>
      <tr>
        <td class="baseColor">组织机构码</td>
        <td class="txtColor">组织机构代码</td>
        <td class="baseColor">企业状态</td>
        <td class="txtColor">正常营业</td>
        <td class="baseColor">企业编码</td>
        <td class="txtColor">浦沿街道08</td>
      </tr>
      <tr>
        <td class="baseColor">负责人</td>
        <td class="txtColor">负责人</td>
        <td class="baseColor">手机号码</td>
        <td class="txtColor">156332285</td>
        <td class="baseColor">餐企电话</td>
        <td class="txtColor">51215445</td>
      </tr>
      <tr>
        <td class="baseColor">餐企类型</td>
        <td class="txtColor">食堂</td>
        <td class="baseColor">菜系</td>
        <td class="txtColor">食堂</td>
        <td class="baseColor">营业面积</td>
        <td class="txtColor">126</td>
      </tr>
      <tr>
        <td class="baseColor">灶头数量</td>
        <td class="txtColor">1</td>
        <td class="baseColor">排口数量</td>
        <td class="txtColor">1</td>
        <td class="baseColor">餐企规模</td>
        <td class="txtColor">中型</td>
      </tr>
      <tr>
        <td class="baseColor">所属辖区</td>
        <td class="txtColor">浦沿街道</td>
        <td class="baseColor">所属分组</td>
        <td class="txtColor" colspan="3">浦沿街道</td>
      </tr>
      <tr>
        <td class="baseColor">详细地址</td>
        <td class="txtColor" colspan="5">浦沿街道853号</td>
      </tr>
    </table>
    <table v-if="activeId == 3" class="company_table equipment_table f14">
      <tr>
        <td class="baseColor">餐企名称</td>
        <td class="txtColor">新石器烤肉</td>
        <td class="baseColor">设备类型</td>
        <td class="txtColor">油烟检测设备</td>
      </tr>
      <tr>
        <td class="baseColor">设备名称</td>
        <td class="txtColor">新石器烤肉</td>
        <td class="baseColor">设备型号</td>
        <td class="txtColor">jsh-123</td>
      </tr>
      <tr>
        <td class="baseColor">设备编号</td>
        <td class="txtColor">2313</td>
        <td class="baseColor">设备IMEI</td>
        <td class="txtColor">156332285</td>
      </tr>
      <tr>
        <td class="baseColor">生产厂家</td>
        <td class="txtColor">浙大网新</td>
        <td class="baseColor">安装日期</td>
        <td class="txtColor">2021-5-21</td>
      </tr>
    </table>



  </myDialog>
</template>

<script>
  import echarts from 'echarts'
  import {paraValueList,paraValueSave,paraValueUpdate,paraValueDelete} from '@/api/parameter'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import LineChart from '@/components/Charts/LineChart'
  import Pagination from "@/components/Pagination/index"; // waves directive
  export default {
    name: 'parameterView',
    directives: { waves },
    components: {
      draggable,
      Pagination,
      LineChart
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
          option: {},
          operatorType: "view",
          id: ""
        }
      }
    },
    data() {
      return {
        activeId:0,
        paraLoading:false,
        operatingMode:'',
        updateBtn:true,
        total:0,
        specificationsItem:[''],
        list: null,
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
        name:'',
        lineData:{
          title: {},
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '0',
            right: '0',
            bottom: '5',
            top: '30',
            containLabel: true
          },
          //----------------   图例 legend  -----------------
          legend:{
            textStyle:{
              fontSize:15,
              color: '#5EF4F9'
            },
            data:['TVOC','油烟浓度']
          },
          xAxis: {
            splitArea : {show :  false }, //保留网格区域
            // show:false,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
              alignWithLabel: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#26CBE2',
                fontSize:'16',
                fontWeight:'bold'
              }
            },
            splitLine: {
              show: false,
              textStyle: {
                color: 'rgba(16,54,123,1)',
                fontSize:'15',
                fontWeight:'bold'
              }
            },//去除网格线
            boundaryGap: false, // 不留白，从原点开始
            type: 'category',
            data: ['5.13', '5.14', '5.15', '5.16', '5.17', '5.18', '5.19']
          },
          yAxis: {
            splitArea : {show :  false }, //保留网格区域
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#26CBE2',
                fontSize:'15',
                fontWeight:'bold'
              }
            },
            splitLine: {
              show: false,//去除网格线
              textStyle: {
                color: '#08245F',
                fontSize:'15',
                fontWeight:'bold'
              }
            },
            type: 'value'
          },
          series: [{
            name:'TVOC',
            symbol:'circle',
            symbolSize:8,
            color:'#CC3275',
            itemStyle : {
              normal : {
                // color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                //     offset: 0, color: 'purple' // 0% 处的颜色
                //   }, {
                //     offset: 0.5, color: 'green' // 100% 处的颜色
                //   }, {
                //     offset: 1, color: 'yellow' // 100% 处的颜色
                //   }]
                // ),  //背景渐变色
                lineStyle:{
                  color:'#CC3275',
                  borderColor:'#CC3275'
                }
              }
            },
            areaStyle:{
              normal:{
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(204,50,117,0.5)'
                }, {
                  offset: .2,
                  color: 'rgba(204,50,117,0.5)'
                },{
                  offset: 1,
                  color: 'rgba(204,50,117,0)'
                }])

              }
            },//区域颜色渐变
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          },{
            name:'油烟浓度',
            symbol:'circle',
            symbolSize:8,
            color:'#E39915',
            itemStyle : {
              normal : {
                lineStyle:{
                  color:'#E39915',
                  borderColor:'#E39915'
                }
              }
            },
            areaStyle:{
              normal:{
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(227,153,21,0.5)'
                }, {
                  offset: .2,
                  color: 'rgba(227,153,21,0.5)'
                },{
                  offset: 1,
                  color: 'rgba(227,153,21,0)'
                }])

              }
            },//区域颜色渐变
            data: [520, 232, 501, 634, 790, 930, 320],
            type: 'line'
          }]
        },
        PieChartLegend:[],
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
      handleTab(val){
        this.activeId = val;
      },
      open(){
        this.listQuery.parameterId = this.paraData.id
        this.operatingMode = this.paraData.option.operatingMode
        this.getList();
        this.name = this.paraData.option.name
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
  @import '@/styles/variables.scss';
  .view_tab{
    width: 60%;
    margin: 0 auto 30px;
    line-height: 2.6;
    //color:$txtColor;
    background: #0a275f !important;
    box-shadow: $menuText 0 0 8px inset;
    border-radius: 5px;

    .active{
      color: #fff;
      background: #0a275f !important;
      box-shadow: $menuText 0 0 18px inset;
    }
    .flex-item{
      &:nth-child(1){
        &.active{
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
        }
      }
      &:nth-child(4){
        &.active{
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
        }
      }
    }
  }
  .table_title{
    /*width: 60%;*/
    line-height: 2.6;
    color:$txtColor;
    background: #0a275f !important;
    box-shadow: $menuText 0 0 8px inset;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .view_ul{
    li{
      margin: 0 5px;
      border: 1px solid $txtColor;
      border-radius: 5px;
      & > div{
        padding: 10px 0;
        p{
          margin-top: 5px;
        }
      }
      .num{
        line-height: 2.5;
      }
    }
  }
  .company_table{
    width: 100%;
    border-top: 1px solid #223492;
    border-left: 1px solid #223492;
    border-spacing: 0;
    tr{
      line-height: 2;

      td{
        padding: 0 5px;
        border-right: 1px solid #223492;
        border-bottom: 1px solid #223492;
      }
    }
  }
  .equipment_table{
    width: 80% !important;
    margin: 0 auto;
  }
</style>
