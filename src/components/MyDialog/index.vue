<template>

  <el-dialog
    :visible="visible"
    :close-on-click-modal="closeOnClickModal"
    :width="width"
    @close="close"
    :append-to-body="appendToBody"
    :top="top"
    :title="title"
    :fullscreen="isFullscreen"
    @open="open"
    v-dragDialog
  >
    <div slot="title" class="dialog-title clr_white">
      {{title}}
    </div>
    <slot></slot>
    <slot name="footer" class="page_footer"></slot>
  </el-dialog>

</template>

<script>
  import dragDialog from '@/directive/el-drag-dialog'
  import waves from "@/directive/waves"; // waves directive
export default {
  directives: { dragDialog },
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      required: false,
      default: false,
      type: Boolean
    },
    width: {
      required: false,
      default: "40%",
      type: String
    },
    appendToBody: {
      required: false,
      default: false,
      type: Boolean
    },
    top: {
      required: false,
      default: "15vh",
      type: String
    },
    title: {
      required: false,
      default: "",
      type: String
    }
  },
  data() {
    return {
      isFullscreen: false
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(value) {
        this.$emit("update:visible", value);
      }
    }
  },
  methods: {
    open() {
      this.$emit("open");
    },
    close() {
      this.dialogVisible = false;
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "@/styles/variables.scss";
.iconfont {
  float: right;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  color: #909399;
}
.iconfont:nth-child(2) {
  margin-right: 10px;
}
.iconfont:nth-child(1) {
  font-size: 21px;
}
.icon{
  color: #909399;
  float: right;
  &:first-child{
    margin-right: 23px;
  }
  &:nth-child(2){
    margin-right: 8px;
  }
  &:hover{
    color: $baseColor;
    cursor: pointer;
  }
}
</style>
