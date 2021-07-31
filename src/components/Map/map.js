export default {
  methods: {
    addCtrl() {
      let T = window.T
      var ctrl = new T.Control.MapType([{
        title: '地图', // 地图控件上所要显示的图层名称
        icon: 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png', // 地图控件上所要显示的图层图标（默认图标大小80x80）
        layer: window.TMAP_NORMAL_MAP // 地图类型对象，即MapType。
      },
        {
          title: '卫星',
          icon: 'http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png',
          layer: window.TMAP_HYBRID_MAP
        }
      ])
      this.map.addControl(ctrl)
    },
    markerPoint(site) {
      let T = window.T
      site.forEach(item => {
        //创建标注对象
        let marker = new T.Marker(new T.LngLat(item.lng, item.lat))
        //向地图上添加标注
        this.map.addOverLay(marker)
      })
    },
  }
}
