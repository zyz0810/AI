<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 2000

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '500px'
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({

          title: {
            text: '营收',
            // subtext: '数据来自网络'
            textStyle:{
              color :'#666',
              fontSize :'18'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['营业额', '纯利润']
          },
          grid: {
            top: 70,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },

          xAxis: {
            type: 'category',
            name:'月',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#666',//左边线的颜色
                width:'1'//坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                color: '#666',//坐标值得具体的颜色
                fontSize:9
              }
            },
            axisTick: {
              alignWithLabel: true
            },
            data: ['2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12','2020-01']
          },
          yAxis: {
            type: 'value',
            name:'万元        ',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#666',//左边线的颜色
                width:'1'//坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                color: '#666',//坐标值得具体的颜色
                fontSize:9
              }
            },
            axisTick: {
              show: false
            },
            boundaryGap: [0, 0.01]
          },
          series: [
            {
              name: '营业额',
              type: 'bar',
              itemStyle:{
                normal:{
                  color:'#00a9ff'
                }
              },
              barWidth : '20%',
              barGap:'0',/*多个并排柱子设置柱子之间的间距*/
              barCategoryGap:'0',/*多个并排柱子设置柱子之间的间距*/
              data: [100, 90, 160, 126, 130, 101,80],
              animationDuration
            },
            {
              name: '纯利润',
              type: 'bar',
              itemStyle:{
                normal:{
                  color:'#ffb840'
                }
              },
              barWidth : '20%',
              barGap:'0',/*多个并排柱子设置柱子之间的间距*/
              barCategoryGap:'0',/*多个并排柱子设置柱子之间的间距*/
              data: [80, 50, 120, 100, 124, 80,50],
              animationDuration
            }
          ]
        })
      }
    }
  }
</script>
