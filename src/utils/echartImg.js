export default {
  option1: (data) => {
    return {
      series: [{
        type: 'liquidFill',
        radius: '64%',
        center: ['50%', '50%'],
        data: [data, data - 0.05, data - 0.08], // data个数代表波浪数
        backgroundStyle: {
          color: '#f3f2f7'
        },
        label: {
          normal: {
            // formatter: `${(data * 100).toFixed(2) + '%'}\n立案率`,
            formatter: function(params) {
              const str = `${(data * 100).toFixed(2) + '%'}\n{a|立案率}`
              return str
            },
            rich: {
              a: {
                fontSize: 16
              }
            },
            textStyle: {
              fontSize: 28,
              lineHeight: 30
            }
          }
        },
        outline: {
          borderDistance: 10,
          itemStyle: {
            borderWidth: 5,
            borderColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(15, 172, 255, 0.8)'
              }, {
                offset: 1,
                color: 'rgb(18,13,218)'
              }],
              globalCoord: false
            }
          }
        }
      }]
    }
  },
  //折线图
  option2: (data) => {
    const xdata = []
    const ydata1 = []
    const ydata2 = []
    const ydata3 = []
    const ydata4 = []
    for (let i = 0, len = data.length; i < len; ++i) {
      xdata.push(data[i].x_name)
      ydata1.push(data[i].y_check)
      ydata2.push(data[i].y_report)
      ydata3.push(data[i].y_smart)
      ydata4.push(data[i].y_report - data[i].y_smart)
    }
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '8%',
        left: '6%',
        right: '6%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '审核',
          type: 'line',
          stack: '总量1',
          data: ydata1,
          itemStyle: {
            normal: {
              color: '#aa8aba', // 折点颜色
              lineStyle: {
                color: '#aa8aba' // 折线颜色
              }
            }
          }
        },
        {
          name: '上报',
          type: 'line',
          stack: '总量2',
          data: ydata2,
          itemStyle: {
            normal: {
              color: '#49d9fd', // 折点颜色
              lineStyle: {
                color: '#49d9fd' // 折线颜色
              }
            }
          }
        },
        {
          name: '智能识别',
          type: 'line',
          stack: '总量3',
          data: ydata3,
          itemStyle: {
            normal: {
              color: '#e86e3c', // 折点颜色
              lineStyle: {
                color: '#e86e3c' // 折线颜色
              }
            }
          }
        },
        {
          name: '人工',
          type: 'line',
          stack: '总量4',
          data: ydata4,
          itemStyle: {
            normal: {
              color: '#3ce881', // 折点颜色
              lineStyle: {
                color: '#3ce881' // 折线颜色
              }
            }
          }
        }
      ]
    }
  },
//柱形图
  option3: (data, opts = {}) => {
    const xdata = []
    const ydata1 = []
    const ydata2 = []
    for (let i = 0, len = data.length; i < len; ++i) {
      xdata.push(data[i].x_name)
      ydata1.push(data[i][opts.yLabel1 || 'y_report_smart'])
      ydata2.push(data[i][opts.yLabel2 || 'y_report_worker'])
    }
    return {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        show: !!opts.legend,
        data: ['智能识别', '人工上报'],
        bottom: 0
      },
      grid: {
        top: '6%',
        left: '6%',
        right: '6%',
        bottom: 30,
        containLabel: true
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      xAxis: {
        type: 'category',
        data: xdata,
        axisLabel: {
          show: true,
          interval: 0 // {number}表示隔几个标签显示一个标签
          // rotate: -45
        }
      },
      series: [
        {
          name: '智能识别',
          type: 'bar',
          data: ydata1,
          label: {
            show: opts.label || false,
            position: 'top'
          },
          itemStyle: {
            normal: {
              color: '#e66c3d'
            }
          }
        },
        {
          name: '人工上报',
          type: 'bar',
          data: ydata2,
          label: {
            show: opts.label || false,
            position: 'top'
          },
          itemStyle: {
            normal: {
              color: '#47d7ff'
            }
          }
        }
      ]
    }
  },
// 饼图
  option4: (data, opts = {}) => {
    const sdata = []
    for (let i = 0, len = data.length; i < len; ++i) {
      // if (data[i].y_worker > 0) {
      sdata.push({
        name: data[i].x_name,
        value: opts.labelY ? data[i][opts.labelY] : data[i].y_worker
      })
      // }
    }
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: '4%',
        show: false
      },
      series: [
        {
          name: opts.title || '违规类型分析',
          type: 'pie',
          radius: opts.radius || '50%',
          top: opts.top || '-25%',
          left: '-28%',
          width: '150%',
          height: '150%',
          animation: false,
          labelLine: {
            show: true
          },
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}({c})'
          },
          data: sdata
        }
      ]
    }
  },
  option5: (data) => {
    const xdata = []
    const ydata = []
    let max = 0
    for (let i = 0, len = data.length; i < len; ++i) {
      max = max > data[i].y_special ? data[i].y_special : max
      xdata.push(data[i].x_name)
      ydata.push(data[i].y_special)
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: '6%',
        left: '6%',
        right: '6%',
        bottom: '6%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xdata,
        axisLabel: {
          show: true,
          interval: 0, // {number}表示隔几个标签显示一个标签
          rotate: -30
        }
      },
      yAxis: {
        type: 'value',
        // max: max + 5,
        minInterval: 1
      },
      series: [{
        data: ydata,
        type: 'bar',
        itemStyle: {
          normal: {
            color: '#47d7ff'
          }
        }
      }]
    }
  },

  option6: (data) => {
    const xdata = []
    const ydata = []
    let max = 0
    for (let i = 0, len = data.length; i < len; ++i) {
      max = max > data[i].y_report_smart ? data[i].y_report_smart : max
      xdata.push(data[i].x_name)
      ydata.push(data[i].y_report_smart || data[i].y_report_check)
    }
    return {
      animation: false,
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          return params[0].name + '</br>' + params[0].seriesName + '：' + (params[0].data >> 0)
        }
      },
      grid: {
        top: '8%',
        left: '6%',
        right: '6%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xdata
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '智能识别',
          type: 'line',
          stack: '总量',
          data: ydata,
          itemStyle: {
            normal: {
              color: '#e86e3c', // 折点颜色
              lineStyle: {
                color: '#e86e3c' // 折线颜色
              },
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#767881',
                  fontSize: 16
                }
              }
            }
          }
        },
        {
          data: ydata,
          type: 'bar',
          barMaxWidth: 20,
          itemStyle: {
            normal: {
              color: '#e86e3c'
            }
          }
        }
      ]
    }
  },

  option7: (data) => {
    return {
      series: [{
        type: 'gauge',
        progress: {
          show: true,
          width: 10
        },
        axisLine: {
          lineStyle: {
            width: 10
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 14,
          itemStyle: {
            borderWidth: 5
          }
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 14,
          lineHeight: 18,
          formatter: '立案率\n{value}%',
          textStyle: {},
          offsetCenter: [0, '62%']
        },
        data: [{
          value: data
        }]
      }]
    }
  },

  option8: (data) => {
    const xdata = []
    const ydata1 = []
    const ydata2 = []
    const ydata3 = []
    for (let i = 0, len = data.length; i < len; ++i) {
      xdata.push(data[i].x_name)
      ydata1.push(data[i].y_report_smart)
      ydata2.push(data[i].y_smart)
      ydata3.push(data[i].y_worker)
    }
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: '8%',
        left: '6%',
        right: '6%',
        bottom: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xdata
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '总立案',
          type: 'line',
          stack: '总量1',
          data: ydata1,
          itemStyle: {
            normal: {
              color: '#aa8aba', // 折点颜色
              lineStyle: {
                color: '#aa8aba' // 折线颜色
              }
            }
          }
        },
        {
          name: '智能识别',
          type: 'line',
          stack: '总量2',
          data: ydata2,
          itemStyle: {
            normal: {
              color: '#e86e3c', // 折点颜色
              lineStyle: {
                color: '#e86e3c' // 折线颜色
              }
            }
          }
        },
        {
          name: '人工',
          type: 'line',
          stack: '总量3',
          data: ydata3,
          itemStyle: {
            normal: {
              color: '#3ce881', // 折点颜色
              lineStyle: {
                color: '#3ce881' // 折线颜色
              }
            }
          }
        }
      ]
    }
  }
}
