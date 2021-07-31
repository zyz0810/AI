<template>
  <div class="dashboard-editor-container">
    <!--    <github-corner class="github-corner" />-->

    <!--    <el-row :gutter="40" class="panel-group">首页</el-row>-->
    <!--<img src="../../../assets/image/2.jpg"/>-->

  </div>
</template>

<script>
  import CountTo from 'vue-count-to'
  import PanelGroup from './components/PanelGroup'
  import PieChart from '@/components/Charts/PieChartTwo'
  import BarChartThree from '@/components/Charts/BarChartThree'

  export default {
    name: 'DashboardAdmin',
    components: {
      CountTo,
      PanelGroup,
      PieChart,
      BarChartThree,
    },
    data() {
      return {
        todayConsults:0,
        todayTurnoverData:0,
        todayProfit:0,
        todayOut:0,

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    height: calc(100vh - 100px);
    padding: 10px 30px;
    /*background-color: rgb(240, 242, 245);*/
    width: 90%;
    margin: 0 auto;
    background: url("./../../../assets/image/index.jpg") no-repeat;
    background-size: 100%;
    background-position: center;
    position: relative;
    /*img{*/
    /*  width: 100%;*/
    /*  height: 100%;*/
    /*}*/
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }


  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }


  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
      padding-left: 10px !important;
      padding-right: 10px !important;
    }

    .card-panel {
      height: 125px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }

        .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .iconfont {
        float: left;
        font-size: 58px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }

</style>
