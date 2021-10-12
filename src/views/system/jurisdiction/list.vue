<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="违规类型">
          <el-cascader ref="cascaderPublish" clearable v-model="listQuery.category_small" :options="categoryList" @change="changeCategory" :show-all-levels="false" filterable :props="props" placeholder="请选择违规类型"></el-cascader>

        </el-form-item>
        <el-form-item label="时间选择：" prop="end_time">
          <el-date-picker
            v-model="listQuery.end_time"
            clearable
            type="date"
            value-format="yyyy-MM-dd"
            @change="getData"
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
<!--          <ColumnChart :name="'myChart'" :echartData='echartData' style="width:100%;height: 28vh;"></ColumnChart>-->
          <BarChartFour :chartData="barData" :BarChartLegend="PieChartLegend" height="28vh" divwidth="100%"></BarChartFour>
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
  import {analysisData, patrolCase} from '@/api/statistics'
  import BarChartFour from '@/components/Charts/BarChartFour'
  import RingChart from '@/components/Charts/RingChart'
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import Pagination from "@/components/Pagination/index"; // waves directive
  import paraView from "./components/view";
  import {categoryList} from "@/api/monitor";
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
        props: {
          expandTrigger: "click",
          value: "id",
          label: "name",
          children: "parent_list",
          disabled: false,
        },
        listQuery:{
          category_big:'',
          category_small:'',
          end_time:''
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
              // // interval: 0,
              // rotate: 30,
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
                formatter: ['{b}：{c}({d}%)',].join('\n'),
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
              data: []
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
            data:['总审核数']
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
            name:'总审核数',
            smooth:false,
            data: [],
            type: 'line',
            color:'rgba(170,138,187,1)'
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
          count:[],
          name: [],
        },
        categoryList:[],
      }
    },

    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
    },
    mounted() {
      this.getCategory();
      this.getData();
    },
    methods: {
      changeCategory(val){
        this.listQuery.category_big = val[0];
        this.listQuery.category_small = val[1];
        this.getData();
      },
      getCategory() {
        categoryList({page:1,pageSize:99999}).then(res=>{
          this.categoryList = res.data.data
        });
      },
      getData(){
        patrolCase(this.listQuery).then(res => {
          //审核统计
          let auditedList = res.data.audited.map(item => {
            return {name:item.name,value:item.count};
          });
          this.chartDataThree.series[0].data = auditedList;
          //来源对比分析
          let soure_x = res.data.soure.map(item=>{
            return item.x_name;
          });
          let soure_y = res.data.soure.map(item=>{
            return item.y_count;
          });
          this.barData.xAxis.data = soure_x;
          this.barData.series[0].data = soure_y;
          //审核趋势分析
          let house_x = res.data.house.map(item=>{
            return item.x_name;
          });
          let house_y = res.data.house.map(item=>{
            return item.y_count;
          });
          this.chartData.xAxis.data = house_x;
            this.chartData.series[0].data = house_y;
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
