<template>
  <div :sltyle="{ height: currentStyle.height + 'px' }">
    <el-carousel
      v-if="propValue.length"
      :indicator-position="trigger"
      :arrow="arrow"
      :height="currentStyle.height + 'px'"
    >
      <el-carousel-item v-for="(item, index) in propValue" :key="index">
        <img :src="item.imgUrl" fit="contain" class="carouselPic" />
      </el-carousel-item>
    </el-carousel>
    <img
      src="@/assets/app/banner.jpg"
      alt=""
      v-if="trigger == 'none' && arrow == 'never' && !propValue.length"
      class="carouselImg"
    />
    <img
      src="@/assets/app/banner_point.jpg"
      alt=""
      v-if="trigger == '' && arrow == 'never' && !propValue.length"
      class="carouselImg"
    />
    <img
      src="@/assets/app/banner_button.jpg"
      alt=""
      v-if="trigger == 'none' && arrow == 'hover' && !propValue.length"
      class="carouselImg"
    />
  </div>
</template>

<script>
export default {
  props: {
    propValue: {
      type: [Object, Array],
      default: () => {
        return [];
      },
    },
    trigger: {
      type: [String, Array],
      default: () => {
        return "";
      },
    },
    arrow: {
      type: [String, Array],
      default: () => {
        return "never";
      },
    },
    currentStyle: {
      type: [Object, Array],
      default: () => {
        return {};
      },
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-carousel {
  width: 100%;
  overflow: hidden;
  height: 200px !important;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.carouselPic {
  width: 100%;
  height: 100%;
}
.el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.carouselImg {
  width: 100%;
  height: 100%;
}
</style>