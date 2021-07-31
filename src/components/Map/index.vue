<template>
  <div :id="tdtMapDivID" class="divTdtMap"></div>
</template>

<script>
  export default {
    name: 'TdtMap',
    data() {
      return {
        tdtMapDivID: "tdtMapDivID_"+this._uid,
        tdtMap: {}
      }
    },
    created() {
    },
    mounted(){
      // 初始化天地图
      this.initTdtMap()
    },
    watch: {
    },
    methods: {
      // 初始化天地图
      initTdtMap(){
        this.tdtMap = new T.Map(this.tdtMapDivID);
        this.tdtMap.centerAndZoom(new T.LngLat(116.40769, 39.89945), 12);
        document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';
      },
    }
  }
</script>

<style scoped>
  .divTdtMap {
    margin: 0px;
    padding: 0px;
    width: 100%;
    height: 80vh;
    z-index: 0;
  }
</style>
