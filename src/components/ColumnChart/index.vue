<template>
  <div :id="name" class="myChart" style="height: 200px;"></div>
</template>
<script>
import echarts from "echarts";
export default {
  name: "",
  props: {
    name: {
      required: true,
      default: "",
      type: [String, Number],
    },
    echartData: {
      required: false,
      default: () => {
        return [];
      },
      type: [Array, Object],
    },
  },
  data () {
    return {
      // echarts 初始值
      charts: "",
    };
  },
  watch: {
    echartData () {
      this.drawLine(this.name);
      // this.setData();
    },
  },
  methods: {
    setData () {
      this.charts.setOption({
        title: {
          text: this.echartData.name.length == 0 ? '暂无数据' : '',
          x: 'center',
          y: 'center',
          textStyle: {
            color: '#999',
            fontWeight: 'normal',
            fontSize: 16
          }
        },
        grid: {
          left: '2%',
          right: '10',
          bottom: '1%',
          containLabel: true
        },

        legend: this.legend,
        color: this.color,
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: this.echartData.name,
          axisLabel: {//底部文字倾斜
            interval: 0,
            rotate: 25,
            textStyle: {
              color: '#fff',
              fontSize:26
            },
            // axisLine:{
            //   lineStyle:{color:'#1A407A'}  //y轴坐标轴颜色
            // },
          },
        },
        yAxis: this.yAxis,
        series: [
          {
            name: "次数",
            type: "bar",
            barWidth: 20,
            barGap: 0,
            data: this.echartData.count,
          }
        ],
      });
    },
    drawLine (id) {
      let colors =  ['rgba(230,108,59,1)',"rgba(0,160,234,1)"]
      // 基于准备好的dom，初始化echarts实例
      this.charts = echarts.init(document.getElementById(id));
      // 绘制图表
      this.charts.setOption({
        grid: {
          top:'20',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        color:  ['rgba(230,108,59,1)',"rgba(0,160,234,1)"],
        xAxis: {
          boundaryGap: true,
          type: "category",
          data: this.echartData.name,
          axisLabel: {    //底部文字倾斜
            // interval: 0,
            // rotate: 25,
            textStyle: {
              // color: '#fff',
              // fontSize:15
            },
          },
          // axisLine:{
          //   lineStyle:{color:'#1A407A'}  //y轴坐标轴颜色
          // },
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
            name: "目标金额",
            type: "bar",
            // barWidth: 50,
            barGap: 0,
            itemStyle: {
              normal:{
                color: function(params){
                  return colors[params.dataIndex];
                  // 取每条数据的 index 对应 colors 中的 index 返回这个颜色
                }
              }
            },
            data: this.echartData.count,
          },
        ],
      });
    },
  },
  //调用
  mounted () {
    this.$nextTick(function () {
      this.drawLine(this.name);
      // 图表自适应
      let _this = this
      window.onresize = function () {
        _this.charts.resize();
      };
    });
  },
};
</script>
<style scoped lang='scss'>

</style>
