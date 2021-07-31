<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
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
         <p class="chart_title f15 mb_10">今日识别统计</p>
         <div class="flex flex-vertical">
           <RingChart :chartData="chartDataTwo" :PieChartLegend="PieChartLegend" divwidth="50%" height="28vh"></RingChart>
           <div class="f18 text-right" style="width: 50%">
             <p><span class="f30 clr_blue bold mr_10">291</span>识别总数</p>
             <p><span class="f30 baseColor bold mr_10">291</span>其它区域</p>
             <p><span class="f30 baseColor bold mr_10">0</span>滨康二区</p>
             <p><span class="f30 baseColor bold mr_10">0</span>审核数</p>
           </div>
         </div>

       </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="15">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">今日识别、审核趋势分析</p>
          <LineChart :divWidth="divWidth" :chartData="chartData" height="28vh"></LineChart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt_10">
      <el-col :span="9">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">违规类型分析</p>
          <RingChart :chartData="chartDataThree" :PieChartLegend="PieChartLegend" height="28vh"></RingChart>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">渠道来源对比分析</p>
          <ColumnChart :name="'myChart'" :echartData='echartData' style="width:100%;height: 28vh;"></ColumnChart>
        </div>
      </el-col>
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
                formatter: ['{b}({c})',].join('\n'),
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
              color: ['rgb(254,67,101)','rgb(146,204,119)','rgb(250,199,89)','rgb(200,200,169)','rgb(114,192,221)','rgb(57,163,114)'],
              data: [
                {value: 0, name: '占道经营'},
                {value: 125, name: '乱堆物料'},
                {value: 22, name: '违规撑伞'},
                {value: 0, name: '非机动车乱停放'},
                {value: 25, name: '无照经营游商'},
                {value: 77, name: '店外经营'},
                {value: 1, name: '打包垃圾'},
                {value: 14, name: '沿街晾挂'},
                {value: 2, name: '暴露垃圾'},
                {value: 4, name: '垃圾满溢'},
                {value: 21, name: '违规户外广告'},
              ]
            }
          ]
        },
        divWidth:'100%',
        chartData:{
          grid: {
            left: '20',
            right: '10',
            bottom: '30',
            containLabel: true
          },
          legend: {
            bottom:'0',
            data:['审核','智能识别']
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
            name:'审核',
            smooth:false,
            data: [0, 0, 0, 0, 0, 1.2, 0.8,0, 0, 0, 0, 0, 0,],
            type: 'line',
            color:'rgba(236,109,57,1)'
          }, {
              name:'智能识别',
              smooth:false,
              data: [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0,],
              type: 'line',
              color:'rgba(170,138,186,1)'
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
