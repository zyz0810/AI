<template>
  <div class="upload-container">
    <!--    :class="[{hide:hideUploadEdit},'avatar-uploader']"-->
    <el-upload
      :class="[{ hide_add: hideUploadEdit }, 'avatar-uploader']"
      :data="dataObj"
      :multiple="false"
      action=""
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :http-request="uploadImg"
      :file-list="imgArr"
      :limit="1"
      :append-to-body="true"
      :on-exceed="exceedSize"
      :on-change="handleEditChange"
      list-type="picture-card"
    >
      <i class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <!--    <el-upload-->
    <!--      class="avatar-uploader"-->
    <!--      :data="dataObj"-->
    <!--      :multiple="false"-->
    <!--      action=""-->
    <!--      :on-preview="handlePictureCardPreview"-->
    <!--      :on-remove="handleRemove"-->
    <!--      :http-request="uploadImg"-->
    <!--      :show-file-list="false">-->
    <!--      <img v-if="tempUrl" :src="tempUrl" class="avatar">-->
    <!--      <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
    <!--    </el-upload>-->
    <el-dialog
      title="查看图片"
      :visible.sync="dialogVisible"
      :append-to-body="true"
    >
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/api/qiniu";
import store from "@/store";
import { uploadImg } from "@/api/upload";

export default {
  name: "SingleImageUpload",
  props: {
    tempUrl: {
      type: String,
      default: "",
      required: true,
    },
  },
  data() {
    return {
      progressFlag: true,
      progressPercent: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      // tempUrl: '',
      dataObj: { type: "license" },
      imgArr: [],
      hideUploadEdit: false,
    };
  },
  watch: {
    //监听value的变化，进行相应的操作即可
    tempUrl: function (a, b) {
      //a是value的新值，b是旧值
      if (a != null && a != "") {
        this.imgArr = [{ url: a }];
        this.hideUploadEdit = true;
      } else {
        this.imgArr = [];
        this.hideUploadEdit = false;
      }
    },
  },
  mounted() {
    if (this.tempUrl != null && this.tempUrl != "") {
      this.imgArr = [{ url: this.tempUrl }];
      this.hideUploadEdit = true;
    } else {
      this.imgArr = [];
      this.hideUploadEdit = false;
    }
  },
  methods: {
    exceedSize() {
      this.$message({ message: "最多只能上传一张图片", type: "warning" });
    },
    emitInput(val) {
      this.$emit("imgSrc", val);
    },
    handleEditChange(file, fileList) {
      this.hideUploadEdit = fileList.length >= 1;
    },
    handleRemove(file, fileList) {
      this.hideUploadEdit = fileList.length >= 1;
      this.emitInput("");
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // handleImageSuccess(response, file, fileList) {
    //   this.emitInput(response.data.picUrl)
    //   this.tempUrl=response.data.picUrl
    // },
    uploadImg(e) {
      const file = e.file;
      // let config = {
      //   onUploadProgress: progressEvent => {
      //     // progressEvent.loaded:已上传文件大小
      //     // progressEvent.total:被上传文件的总大小
      //     this.progressPercent = (progressEvent.loaded / progressEvent.total * 100)
      //   }
      // }
      // uploadImg(file,config)
      uploadImg(file)
        .then((res) => {
          this.emitInput(res.url);
          // this.tempUrl = res.picUrl;
        })
        .catch((e) => {
          this.$message({ message: "上传图片失败", type: "warning" });
        });
    },
    beforeUpload() {
      const _self = this;
      return new Promise((resolve, reject) => {
        // getToken().then(response => {
        //   const key = response.data.qiniu_key
        //   const token = response.data.qiniu_token
        //   _self._data.dataObj.token = token
        //   _self._data.dataObj.key = key
        //   this.tempUrl = response.data.qiniu_url
        //   resolve(true)
        // }).catch(err => {
        //   reject(false)
        // })
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/element-ui.scss";
@import "~@/styles/element-variables.scss";
@import "~@/styles/index.scss";
.avatar-uploader {
  width: 80px;
  height: 80px;
  &.hide_add {
    .el-upload {
      display: none;
    }
  }
  .el-upload--picture-card,
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
    /*line-height: 80px;*/
  }
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    cursor: pointer;
    overflow: hidden;
  }
  .el-upload {
    width: 80px;
    height: 80px;
    line-height: 80px;
    cursor: pointer;
    overflow: hidden;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    /*line-height: 80px;*/
    text-align: center;
  }
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    display: block;
  }
}
</style>
