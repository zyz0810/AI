<template>
  <div class="app-container">
    <div id="reportChart1" class="report-chart none" style="width: 500px;height: 300px;display: none;"/>
    <div id="reportChart2" class="report-chart none" style="width: 500px;height: 300px;display: none;"/>
    <div class="flex flex-vertical" style="width: 50%;position:fixed;z-index:-1;" ref="imageWrapper">
      <div id="reportChart3" class="report-chart none" style="width: 500px;height: 300px;"></div>
      <div class="f18 text-right" style="width: 50%">
        <p><span class="f30 clr_blue bold mr_10">{{totalData.count}}</span>识别总数</p>
        <p><span class="f30 baseColor bold mr_10">{{totalData.isAudited}}</span>审核通过</p>
        <p><span class="f30 baseColor bold mr_10">{{totalData.isNotAudited}}</span>审核不通过</p>
        <p><span class="f30 baseColor bold mr_10">{{totalData.audited}}</span>未审核</p>
      </div>
    </div>
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="search_form">
        <el-form-item label="报告模板">
          <el-input v-model.trim="listQuery.name" autocomplete="off" readonly clearable/>
        </el-form-item>
        <el-form-item label="统计维度">
          <el-select v-model="listQuery.dimension" placeholder="请选择" readonly>
            <el-option label="按天统计" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="统计时间" prop="name">
          <el-date-picker
            v-model="dateTime"
            clearable
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-check" @click="getReport">生成报告</el-button>
          <el-button v-waves icon="el-icon-download" @click="handleExport">导出Word</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg_white p20">
      <quillEditor ref="myQuillEditor"
                   :isChange.sync="isChange"
                   :content.sync="escription" />
    </div>
  </div>
</template>

<script>
  import html2canvas from "html2canvas"
  import draggable from 'vuedraggable'
  import waves from '@/directive/waves'
  import { mapState } from 'vuex'
  import quillEditor from "@/components/quillEditor/quillEditor";
  import {analysisData, earlyWarning} from "@/api/statistics";
  import chartOptions from './../../../utils/echartImg'
  import echarts from 'echarts'
  export default {
    name: 'operationReport',
    directives: {waves},
    components: {
      draggable,
      quillEditor
    },
    data() {
      return {
        escriptionBefore:'',
        editor: false,
        chart1: null,
        chart2: null,
        chart3: null,
        escription:'',
        isChange:false,
        listQuery: {
          name: '城市管理智能运行分析报告',
          dimension:1,
          start_time: '',
          end_time: ''
        },
        tableHeight:'100',
        totalData:{},
      }
    },
    computed: {
      ...mapState({
        roles: state => state.user.roles,
      }),
      dateTime: {
        get () {
          if (this.listQuery.start_time && this.listQuery.end_time) {
            return [this.listQuery.start_time, this.listQuery.end_time];
          } else {
            return [];
          }
        },
        set (v) {
          if (v) {
            this.listQuery.start_time = v[0];
            this.listQuery.end_time = v[1];
          } else {
            this.listQuery.start_time = "";
            this.listQuery.end_time = "";
          }
        },
      },
    },
    mounted() {
      this.$nextTick(function() {
        // this.$refs.filter-container.offsetHeight
        let height = window.innerHeight - this.$refs.myQuillEditor.$el.offsetTop - 260;
        if(height>100){
          this.tableHeight = height
        }else{
          this.tableHeight = 100
        }
        // 监听窗口大小变化
        const self = this;
        window.onresize = function() {
          let height = window.innerHeight - self.$refs.myQuillEditor.$el.offsetTop - 260;
          if(height>100){
            self.tableHeight = height
          }else{
            self.tableHeight = 100
          }
        };
      });
      // this.getData();
    },
    methods: {
      handleExport(){
        if (this.editor) {
          // eslint-disable-next-line
          $('.ql-editor').wordExport(this.$moment().format('YYYYMMDDHHmmss'))
        }
      },
      // getReport(){
      //   this.escription = this.escriptionBefore
      //   this.$refs.myQuillEditor.changeContent(this.escription);
      // },
      getReport() {
        this.editor = false;
        analysisData().then(res => {
          this.totalData = res.data.total;
          let categoryList = res.data.category.map(item=>{
            return item.x_name;
          })
          // 生成图表
          // 折线图
          let trend_x = res.data.trend.map(item=>{
            return item.x_name;
          });
          let trend_y = res.data.trend.map(item=>{
            return item.y_count;
          })
          const option1 = {
            animation: false,
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
              data: trend_x
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
              data: trend_y,
              type: 'line',
              color:'rgba(236,109,57,1)'
            }]
          };
          if (!this.chart1) {
            this.chart1 = echarts.init(document.getElementById('reportChart1'))
          }
          this.chart1.setOption(option1)

          //柱形图
          const optionSet2 = {
            radius: '60%',
            top: '-14%',
            label: true
          }
          let category_x = [];
          let category_y = [];
          res.data.category.map((item,index)=>{
            if(index<10){
              category_x.push(item.x_name);
              // category_y.push(item.y_count);
              category_y.push(6);
            }
          })
          const option2 = {
            animation: false,
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
              data: category_x,
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
                data: category_y,
              },
            ],
          };
          if (!this.chart2) {
            this.chart2 = echarts.init(document.getElementById('reportChart2'))
          }
          option2.series[0].width = '80%'
          option2.series[0].height = '80%'
          this.chart2.setOption(option2)

          //饼图
          const optionSet3 = {}

          const option3 = {
            animation: false,
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
            color:['rgb(45,199,201)','rgb(182,162,223)','rgb(89,177,240)'],
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
                data: [{
                  // name:'审核通过',value:res.data.isAudited
                  name:'审核通过',value:28
                },{
                  // name:'未审核',value:res.data.audited
                  name:'未审核',value:44
                },{
                  // name:'审核不通过',value:res.data.isNotAudited
                  name:'审核不通过',value:68
                }]
              }
            ]
          }
          if (!this.chart3) {
            this.chart3 = echarts.init(document.getElementById('reportChart3'))
          }
          this.chart3.setOption(option3)
          let opts = {
            type: 'jpeg', // 导出的格式，可选 png, jpeg
            pixelRatio: 1,// 导出的图片分辨率比例，默认为 1。
            backgroundColor: '#fff',// 导出的图片背景色，默认使用 option 里的 backgroundColor
            // 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox'],一般也忽略了'toolbox'这栏就够了
            excludeComponents:  ['toolbox']
          }
          // var resBase64 = myChart.getDataURL(opts);  //拿到base64 地址，就好下载了。
          const chart1Img = this.chart1.getDataURL()
          const chart2Img = this.chart2.getDataURL(opts)
          let chart3Img;
      setTimeout(()=>{
        html2canvas(this.$refs.imageWrapper).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
          chart3Img = dataURL;
          this.escriptionBefore ='<h1 style="text-align:center;">城市管理智能运行分析报告</h1>' +
            '<h2>一、运行概述</h2>' +
            '<p>运行周期：'+ this.listQuery.start_time + '至' + this.listQuery.end_time +'</p>' +
            '<p>AI视频智能分析系统在本周期范围内，实现'+  res.data.category.length +'类类别问题的上报， 包括：' + categoryList.join("、") +'</p>' +
            '<p>上报问题：'+ res.data.total.count +'起</p>' +
            '<p>审核事件：'+ Number(res.data.total.isAudited) + Number(res.data.total.isNotAudited) +'件</p>' +
            '<p>立案案件：'+ res.data.total.isAudited +'件</p>' +
            '<p>准确率：'+ Number(res.data.total.isAudited)/(Number(res.data.total.isAudited) + Number(res.data.total.isNotAudited)) +'%</p>' +
            '<h2 style="margin-top: 20px;">二、数据分析</h2>' +
            '<h3>1、上报问题时间分布</h3>' +
            '<img src="'+ chart1Img +'" alt/>' +
            '<h3>2、上报问题类型分布</h3>' +
            '<img src="'+ chart2Img +'" alt/>' +
            '<h3>3、事件趋势分析</h3>' +
            '<img src="'+ chart3Img +'" alt/>' +
            '<h2 style="margin-top: 20px;">三、小结</h2>' +
            '<p>1、本统计时段，店外经营、无照经营游商、非机动车乱停放、占道经营、暴露垃圾较为严重，为高发问题；</p>' +
            '<p>2、在巡查时段中，14:00~16:00为问题高发时间段。</p>';
          this.escription = this.escriptionBefore
          this.$refs.myQuillEditor.changeContent(this.escription);
          this.editor = true;
        });
      },1000)




          this.isChange = true

        });
      },
    }
  }
</script>
