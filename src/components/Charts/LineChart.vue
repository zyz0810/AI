<template>

  <div class="clearfix">
    <div class="fl" :style="{width: divWidth}">
      <div :class="className" ref="pieChart" :style="{height:height,width:width}" />
    </div>
<!--    <div class="legend_span fr" v-if="lineChartLegend.length>0">-->
<!--      <div v-for="(item,index) in lineChartLegend" @click="editLegend">-->
<!--        <label :for="index">-->
<!--          <input type="checkbox" checked="checked" ref="pieCheckbox" :id="index" :value="item.name"/>-->
<!--          <span class="color_block" :style="{background:item.color}"></span>-->
<!--          {{item.name}}-->
<!--        </label>-->
<!--      </div>-->
<!--    </div>-->


  </div>
</template>

<script>
import echarts from 'echarts'
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
    divWidth:{
      type:String,
      default:'100%',
      required:true
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    // lineChartLegend:{
    //   type: Array,
    //   required: true
    // }
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
    // lineChartLegend: {
    //   deep: true,
    //   handler(val) {
    //     if(val.length >0){
    //       this.setOptions(val)
    //     }
    //
    //   }
    // },
    divWidth: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
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
      this.chart = echarts.init(this.$refs.pieChart, 'macarons')
      this.setOptions(this.chartData)

    },
    setOptions({ title,xAxis,grid,yAxis,tooltip,legend,series  } = {}) {
      this.chart.setOption({
        title:title,
        xAxis:xAxis,
        grid: grid,
        tooltip: tooltip,
        yAxis: yAxis,
        legend: legend,
        series: series
      })
    },
    editLegend(){
      var selectOption = {};
      var options = this.chartData;
      this.$refs.pieCheckbox.forEach(function (c) {
        c.checked?selectOption[c.value]=true:selectOption[c.value]=false;
      });
      options.legend.selected = selectOption;
      this.chart.setOption(options);
    }
  }
}
</script>
