<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="违规类型">
          <el-select v-model="listQuery.area" placeholder="请选择">
            <el-option label="区域1" value="1"></el-option>
            <el-option label="区域2" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择：" prop="name">
          <el-date-picker
            v-model="listQuery.yearChoose"
            clearable
            type="date"
            placeholder="开始日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="9">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">审核统计</p>
          <RingChart :chartData="chartDataThree" :PieChartLegend="PieChartLegend" height="28vh"></RingChart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="15">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">来源对比分析</p>
          <ColumnChart :name="'myChart'" :echartData='echartData' style="width:100%;height: 28vh;"></ColumnChart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="bg_white p20 mt_10">
      <p class="chart_title f15 mb_10">审核趋势分析</p>
      <LineChart :divWidth="divWidth" :chartData="chartData" height="28vh"></LineChart>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import {paraList, paraSave, paraUpdate, paraDelete} from '@/api/parameter'
  import RingChart from '@/components/Charts/RingChart'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  export default {
    name: 'parameterList',
    directives: {waves},
    components: {
      draggable,
      Pagination,
      paraView,
      RingChart
    },
    data() {
      return {
        listQuery:[],
        PieChartLegend:[],
        chartDataThree: {
          title:{},
          grid:{
            top:'0',
            left:'0',
            right: '0',
            bottom:'0'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            show:false
          },
          color:['#367CFD','#E20280'],
          series: [
            {
              name: '访问来源',
              type: 'pie',
              avoidLabelOverlap: true,
              // label: {
              //   show: false,
              //   position: 'center',
              //
              // },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              markLine :{
                label  :{
                  show:true,
                  position :'outside'
                },
              },
              labelLine:{
                normal:{
                  lineStyle: {
                    // color: '#fff'
                  },
                  length:10,
                  length2 :35,
                }
              },
              label :{
                formatter: ['{b}({d}%)',].join('\n'),
                verticalAlign :'bottom',
                position:'outside',
                textShadowOffsetY :10,
                align :'right',
                // fontSize:'16',
                rich: {
                  a: {
                    verticalAlign:'bottom',
                    // 没有设置 `verticalAlign`，则 `verticalAlign` 为 bottom
                  }
                }
              },
              color: ['rgb(84,111,198)','rgb(238,102,102)',],
              data: [
                {value: 125, name: '通过'},
                {value: 125, name: '不通过'},
              ]
            }
          ]
        },
        divWidth:'100%',
        chartData:{
          grid: {
            left: '20',
            right: '10',
            bottom: '40',
            containLabel: true
          },
          legend: {
            bottom:'0',
            data:['总审核数','其它区域审核数','滨康二区审核数']
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: 'blue'
              }

            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel:{
              color:'#c9c9c9'
            },   // x轴字体颜色


            axisLine:{
              lineStyle:{color:'#fff'}    // x轴坐标轴颜色
            },


            axisTick:{
              lineStyle:{color:'#fff'}    // x轴刻度的颜色
            },
            data: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00','14:00','16:00','18:00','20:00','22:00','24:00',]
          },
          yAxis: {
            type: 'value',
            axisLabel : {color:'#c9c9c9'},    //y轴字体颜色
            splitArea : {
              show : false//去除网格区域
            },
            splitLine:{
              // show: false//去除网格线
              lineStyle:{color:'#f2f2f2'}
            },

            axisLine:{
              lineStyle:{color:'#fff'}  //y轴坐标轴颜色
            },
            axisTick:{
              show:false,
              lineStyle:{color:'#fff' }  //y轴坐标刻度颜色
            },
          },
          series: [{
            name:'总审核数',
            smooth:false,
            data: [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
            type: 'line',
            color:'rgba(170,138,187,1)'
          }, {
            name:'其它区域审核数',
            smooth:false,
            data: [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
            type: 'line',
            color:'rgba(234,109,63,1)'
          }, {
            name:'滨康二区审核数',
            smooth:false,
            data: [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
            type: 'line',
            color:'rgba(61,232,127,1)'
          }]
        },
        chartDataTwo: {
          title:{},
          grid:{
            top:'0',
            left:'0',
            right: '0',
            bottom:'0'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            show:false
          },
          color:['#367CFD','#E20280'],
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['65%', '90%'],
              avoidLabelOverlap: false,
              // label: {
              //   show: false,
              //   position: 'center',
              //
              // },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              },
              // labelLine: {
              //   show: false
              // },
              markLine :{
                label  :{
                  show:true,
                  position :'outside'
                },
              },
              labelLine:{
                normal:{
                  lineStyle: {
                    color: '#fff'
                  },
                  length:10,
                  length2 :35,
                }
              },
              label :{
                formatter: [
                  '{c}',
                  '{b}',
                ].join('\n'),
                verticalAlign :'bottom',
                position:'outside',
                textShadowOffsetY :10,
                align :'right',
                color:'white',
                height :60,
                lineHeight:30,
                fontSize:'16',
                rich: {
                  a: {
                    verticalAlign:'bottom',
                    // 没有设置 `verticalAlign`，则 `verticalAlign` 为 bottom
                  }
                }
              },
              data: [
                {value: 520, name: '浦沿街道'},
                {value: 205, name: '长河街道'},
                {value: 205, name: '西兴街道'},
              ]
            }
          ]
        },
        listQuery3: {
          performanceEnum: 'USER',//  DEPT: 对应部门   USER: 对应员工
          startTime: '',
          endTime: '',
          yearChoose: '',
          year: '',
        },
        echartData: {
          count:[70,10,],
          name: ['其它区域','滨康二区',],
        },
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {

    },
    methods: {
      achievementByOrderEchars(){},

    }
  }
</script>
<style lang="scss" scoped>
  .chart_title{
    padding-left: 10px;
    border-left: 3px solid rgba(39,158,249,1);
  }

</style>
