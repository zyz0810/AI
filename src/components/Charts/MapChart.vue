<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  import '../../../node_modules/echarts/map/js/china.js'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

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
        default: '800px'
      },
      chartData: {
        type: Object,
        required: true
      },
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      },
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
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.chartData)
      },
      setOptions({ mapData } = {}) {

        this.chart.setOption({
          title: {
            text: '客户分布图',
            // subtext: '纯属虚构',
            left: 'left',
            textStyle:{
              color :'#666',
              fontSize :'18',
            }
          },
          tooltip: {
            trigger: 'item',
            // formatter: '{b}：{c}  人数'
            formatter: function (params, ticket, callback) {
              var tipString = '';
              if(params.data == undefined){
                tipString = params.name+'： 0 人数'
              }else{
                tipString = params.name+'：'+params.value+'  人数'
              }
              return tipString;
            }
          },
          grid : {
            top: '200',
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true,
          },
          visualMap: {
            type:'continuous',
            min: 0,
            // max: 2500,
            itemWidth:10,                           //图形的宽度，即长条的宽度。
            itemHeight:600,                         //图形的高度，即长条的高度。
            orient:"horizontal",
            left: 'center',
            top: '30',
            // padding
            // text: ['高','低'],           // 文本，默认为数值文本
            calculable: true,
            inRange: {
              color: ['#ffe88a','#d74177']
            },
            splitNumber:5,
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: {readOnly: false},
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '客户分布',
              type: 'map',
              mapType: 'china',
              roam: true,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              zoom: 1.1,
              data:mapData,
              // data:[{name:"浙江",value:5000},{name:"安徽",value:1000},{name:"上海",value:1000},{name:"山东",value:1000}]
            }
          ]
        })
      },

    }
  }
</script>
