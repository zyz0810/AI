<template>
  <div :style="{width:divwidth,}">
    <div :class="className" ref="ringCharts" :style="{height:height,width:width,}" />
    <div class="legend_span legend_inline text-center" style="margin-top: -30px" v-if="PieChartLegend.length>0">
      <div v-for="(item,index) in PieChartLegend" @click="editLegend">
        <label :for="'ring'+index">
          <input type="checkbox" checked="checked" ref="pieCheckbox" :id="'ring'+index" :value="item.name"/>
          <span class="color_block" :style="{background:item.color}"></span>
          {{item.name}}
        </label>
      </div>
    </div>
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
    divwidth: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    PieChartLegend: {
      type: Array,
      required: true
    }
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
    PieChartLegend: {
      deep: true,
      handler(val) {
        if(val.length >0){
          this.setOptions(val)
        }
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
      this.chart = echarts.init(this.$refs.ringCharts, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ title,tooltip,legend,series } = {}) {
      this.chart.setOption({
        title: title,
        tooltip: tooltip,
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
      this.setOptions(options);
    }
  }
}
</script>
