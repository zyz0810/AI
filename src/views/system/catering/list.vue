<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="时间选择：" prop="day_time">
          <el-date-picker
            v-model="listQuery.day_time"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            @change="getData"
            placeholder="选择时间">
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
             <p><span class="f30 clr_blue bold mr_10">{{totalData.count}}</span>识别总数</p>
             <p><span class="f30 baseColor bold mr_10">{{totalData.isAudited}}</span>审核通过</p>
             <p><span class="f30 baseColor bold mr_10">{{totalData.isNotAudited}}</span>审核不通过</p>
             <p><span class="f30 baseColor bold mr_10">{{totalData.audited}}</span>未审核</p>
           </div>
         </div>

       </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="15">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">今日审核趋势分析</p>
          <LineChart :divWidth="divWidth" :chartData="chartData" height="28vh"></LineChart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="mt_10">
      <el-col :span="9">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">所属来源对比分析</p>
          <RingChart :chartData="chartDataThree" :PieChartLegend="PieChartLegend" height="28vh"></RingChart>
        </div>
      </el-col>
      <el-col :span="15">
        <div class="bg_white p20">
          <p class="chart_title f15 mb_10">违规类型分析</p>
<!--          <ColumnChart :name="'myChart'" :echartData='echartData' style="width:100%;height: 28vh;"></ColumnChart>-->
          <BarChartFour :chartData="barData" :BarChartLegend="PieChartLegend" height="28vh" divwidth="100%"></BarChartFour>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as echarts from 'echarts';
  import {analysisData} from '@/api/statistics'
  import BarChartFour from '@/components/Charts/BarChartFour'
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
      RingChart,
      BarChartFour
    },
    data() {
      return {
        totalData:{},
        listQuery:{
          day_time:''
        },
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
            formatter: '{b}: {c} ({d}%)'
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
                formatter: ['{b}{c} ({d}%)',].join('\n'),
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
              data: []
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
            data:['审核']
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
            data: []
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
            data: [],
            type: 'line',
            color:'rgba(236,109,57,1)'
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
            formatter: '{b}: {c} ({d}%)',
            confine:true,
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
              data: []
            }
          ]
        },
        echartData: {
          count:[],
          name: [],
        },
        barData:{
          grid: {
            top:'20',
            left: '0',
            right: '0',
            bottom: '0',
            containLabel: true
          },
          tooltip : {
            trigger : 'axis',
            showDelay : 0, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: '{b}: {c}',
          },
          color:  ['rgba(230,108,59,1)',"rgba(0,160,234,1)"],
          xAxis: {
            boundaryGap: true,
            type: "category",
            data: [],
            axisLabel: {    //底部文字倾斜
              // interval: 0,
              rotate: 30,
              textStyle: {
                color: '#000',
                fontSize:10
              },
            },
            axisLine:{
              lineStyle:{color:'#000'}  //y轴坐标轴颜色
            },
            axisTick:{
              show:false,
              // lineStyle:{color:'#1A407A' }  //y轴坐标刻度颜色
            },
          },
          yAxis: [{
            type: "value",
            axisLabel : {
              color:'#c9c9c9',
              // textStyle: {
              //   color:'#fff'  //这里用参数代替了
              // }
            },    //y轴字体颜色
            splitArea : {show : false},  //去除网格区域
            splitLine:{
              show: true,
              lineStyle:{color:'#f2f2f2' }
            },   //去除网格线
            axisLine:{
              show:false,
              // lineStyle:{color:'#1A407A'}  //y轴坐标轴颜色
            },
            axisTick:{
              show:false,
              // lineStyle:{color:'#1A407A' }  //y轴坐标刻度颜色
            },
          }],
          series: [
            {
              name: "",
              type: "bar",
              barWidth: 30,
              // barGap: 0,
              itemStyle: {
                normal:{
                  // color: function(params){
                  //   const barColors= ['rgba(230,108,59,1)',"rgba(0,160,234,1)"];
                  //   return barColors[params.dataIndex];
                  //   // 取每条数据的 index 对应 colors 中的 index 返回这个颜色
                  // }
                  color:'rgba(0,160,234,1)'
                }
              },
              data: [],
            },
          ],
        },
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData(){
        analysisData(this.listQuery).then(res => {
          //今日识别统计
          this.totalData = res.data.total;
          this.chartDataTwo.series[0].data = [{
            name:'审核通过',value:res.data.isAudited
            // name:'审核通过',value:2
          },{
            name:'未审核',value:res.data.audited
            // name:'未审核',value:44
          },{
            name:'审核不通过',value:res.data.isNotAudited
            // name:'审核不通过',value:6
          }];
          //今日审核趋势分析
          let trend_x = res.data.trend.map(item=>{
            return item.x_name;
          });
          let trend_y = res.data.trend.map(item=>{
            return item.y_count;
          })
          this.chartData.xAxis.data = trend_x;
          this.chartData.series[0].data = trend_y;
          //所属来源对比分析
          let sourceList = res.data.source.map(item=>{
            let json = {
              name:item.x_name,
              value:item.y_count,
              // value:20,
            }
            return json;
          })
          this.chartDataThree.series[0].data = sourceList;
          //违规类型分析
          let category_x = [];
          let category_y = [];
           res.data.category.map((item,index)=>{
            if(index<10){
              category_x.push(item.x_name);
              category_y.push(item.y_count);
              // category_y.push(6);
            }
          })
          this.echartData.name = category_x;
          this.echartData.count = category_y;
          this.barData.xAxis.data = category_x;
          this.barData.series[0].data = category_y;
        });
      },

    }
  }
</script>
<style lang="scss" scoped>
  .chart_title{
    padding-left: 10px;
    border-left: 3px solid rgba(39,158,249,1);
  }

</style>
