import Pagination from './Pagination'
import MyDialog from './MyDialog'
import VCarousel from './cusomComponent/VCarousel'
import VCrosswise from './cusomComponent/VCrosswise'
import VLengthways from './cusomComponent/VLengthways'
import VMeal from './cusomComponent/VMeal'
import ColumnChart from './ColumnChart'
import LineChart from './Charts/LineChart'

const commomComponents = {
  install: function (Vue) {
    Vue.component('pagination', Pagination)
    Vue.component('myDialog', MyDialog)
    Vue.component('VMeal', VMeal)
    Vue.component('VCarousel', VCarousel)
    Vue.component('VCrosswise', VCrosswise)
    Vue.component('VLengthways', VLengthways)
    Vue.component('ColumnChart', ColumnChart)
    Vue.component('LineChart', LineChart)
  }
}
// 导出
export default commomComponents
