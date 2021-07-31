<template>
  <div class="rotate_contanier">
    <div class="header">
<!--      <span @click="handleImg(1)">上一张</span>-->
<!--      <span @click="handleImg(2)">下一张</span>-->
<!--      <span @click="rotate">旋转</span>-->
      <el-button type="primary" icon="el-icon-refresh-right" @click="rotate">旋 转</el-button>
    </div>
    <div class="picture_contaner">
      <div class="img_box" ref="rotate" :style="'transform:rotate(' + fileInfo.deg + 'deg);'">
<!--      <div class="img_box" ref="rotate">-->
        <img :src="imgUrl.dialogImageUrl" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      imgUrl: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        fileInfo: {
          fileUrl: '',
          deg: 0
        },
      }
    },
    watch:{
      'imgUrl.dialogImageUrl'(){
        return this.fileInfo = this.imgUrl
      }
    },
    created() {
      // 设置图片初始旋转角度
      this.fileInfo = this.imgUrl
    },
    mounted() {
    },
    methods: {
      // 旋转图片
      rotate () {
        this.fileInfo.deg += 90
        if (this.fileInfo.deg >= 360) {
          this.fileInfo.deg = 0
        }
        this.$refs.rotate.style.transform = `rotate(${this.fileInfo.deg}deg)`
      }
    }
  }
</script>

<style>
  .rotate_contanier {
    display: flex;
    flex-direction: column;
    /*padding: 20px;*/
    /*background-color: #909399;*/
    /*width: 600px;*/
    /*height: 670px;*/
  }
  .header {
    margin-bottom: 10px;
    text-align: center;
    background-color: #fff;
  }
  /*.header span {*/
  /*  padding: 5px 8px;*/
  /*  color: #fff;*/
  /*  background-color: #409eff;*/
  /*  border-radius: 4px;*/
  /*  margin-right: 5px;*/
  /*  cursor: pointer;*/
  /*}*/
  .picture_contaner {
    height: 600px;
    width: 100%;
    background-color: #fff;
    padding: 10px;
    box-sizing: border-box;
    overflow: auto;
  }
  .picture_contaner .img_box {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .picture_contaner .img_box img {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }

</style>
