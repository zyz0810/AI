<template>

  <div class="" style="background: #fff;padding: 20px;margin-bottom: 20px;">
    <div class="legend_span legend_inline text-center" v-if="BarChartLegend.length>0">
      <div v-for="(item,index) in BarChartLegend" @click="editLegend">
        <label :for="'barTwo'+index">
          <input type="checkbox" checked="checked" ref="pieCheckbox" :id="'barTwo'+index" :value="item.name"/>
          <span class="color_block" :style="{background:item.color}"></span>
          {{item.name}}
        </label>
      </div>
    </div>
    <div :class="className" ref="barChart" :style="{height:height,width:width}" />
  </div>
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
      divwidth: {
        type: String,
        default: '100%',
        required: true
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
      BarChartLegend: {
        type: Array,
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
      divwidth: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      },
      BarChartLegend: {
        deep: true,
        handler(val) {
          if(val.length>0){
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
        this.chart = echarts.init(this.$refs.barChart, 'macarons');
        this.setOptions(this.chartData)
      },
      setOptions({title,tooltip,legend,grid,xAxis,yAxis,series } = {}) {
        this.chart.setOption({
          title: title,
          tooltip: tooltip,
          legend: legend,
          grid: grid,
          xAxis: xAxis,
          yAxis: yAxis,
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
