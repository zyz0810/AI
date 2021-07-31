<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import Breadcrumb from "@/components/Breadcrumb";
  import Hamburger from "@/components/Hamburger";
  import ErrorLog from "@/components/ErrorLog";
  import Screenfull from "@/components/Screenfull";
  import SizeSelect from "@/components/SizeSelect";
  import Search from "@/components/HeaderSearch";
  import headImg from "@/assets/headImg/img.png";
  import {
    getToken,
    setToken,
    removeToken,
    getId,
    setId,
    removeId,
    getName,
    setName,
    removeName,
    getMobile,
  } from "@/utils/auth";
  import { validUsername, validatePhone, isPassword } from "@/utils/validate";
  import { updatePassword } from "@/api/user";
  import { getSmsCode } from "@/api/code";
  export default {
    data() {
      return {
        headImg: headImg,
        systemDate: "",
        name: getName() != "null" ? getName() : "",
        nowDate: "",
        dialogFormVisible: false,
        textMap: {
          update: "修改密码",
        },
        dialogStatus: "",
        temp: {
          oldPassword: "",
        },
        rules: {
          password: [
            { required: true, message: "请输入密码", trigger: "change" },
            { validator: isPassword },
          ],
          mobile: [
            { required: true, message: "请输入手机号码", trigger: "change" },
            { validator: validatePhone },
          ],
          verifyCode: [
            { required: true, message: "请输入验证码", trigger: "change" },
          ],
          confirmPassword: [
            { required: true, message: "请再次输入密码", trigger: "change" },
            { validator: isPassword },
          ],
        },
        passwordTemp: {
          confirmPassword: "",
          mobile: getMobile(),
          password: "",
          verifyCode: "",
        },
        codeTxt: "获取验证码",
        disabled: false,
      };
    },
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      SizeSelect,
      Search,
    },
    computed: {
      ...mapState({
        roles: (state) => state.user.roles,
      }),
      ...mapGetters(["sidebar", "avatar", "device"]),
    },
    methods: {
      getRule() {
        this.$router.push({ path: "/rule" });
      },
      resetPasswordTemp() {
        this.passwordTemp = {
          confirmPassword: "",
          mobile: getMobile(),
          password: "",
          verifyCode: "",
        };
      },
      getCode() {
        if (this.passwordTemp.mobile != "") {
          getSmsCode({ mobile: this.passwordTemp.mobile }).then((res) => {
            // this.publishOption = res.data
            // if(res.resp_code == 0){
            this.countdown2(this);
            // }
          });
        } else {
          this.$confirm("请输入手机号码", "提示", {
            type: "warning",
            showCancelButton: false,
          })
            .then(() => {})
            .catch(() => {});
        }
      },
      countdown2(that) {
        let setTime = 60;
        let time = setTime;
        let codeTxt = "获取验证码";
        return (function timeFn(o) {
          if (time == 0) {
            that.codeTxt = codeTxt;
            that.disabled = false;
            time = setTime;
          } else {
            that.codeTxt = time + "s重试";
            that.disabled = true;
            time--;
            setTimeout(function () {
              timeFn(o);
            }, 1000);
          }
          if (that.dialogFormVisible == false) {
            time = 0;
          }
        })();
      },
      toggleSideBar() {
        this.$store.dispatch("app/toggleSideBar");
      },
      updatePassword() {
        this.resetPasswordTemp();
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      updateData() {
        this.$refs["dataForm"].validate((valid) => {
          if (valid) {
            updatePassword(this.passwordTemp).then((res) => {
              if (res.resp_code == 0) {
                this.dialogFormVisible = false;
                this.$message({
                  message: "密码重置成功",
                  type: "success",
                });
              }
            });
          }
        });
      },
      async logout() {
        await this.$store.dispatch("user/logout");
        // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        this.$router.push(`/login?redirect=/dashboard`);
      },
      // addDate() {
      //   let nowDate = new Date();
      //   this.nowDate = new Date();
      //   let date = {
      //     year: nowDate.getFullYear(),
      //     month: nowDate.getMonth() + 1,
      //     date: nowDate.getDate(),
      //   };
      //   if(date.month<10 && date.date<10){
      //     this.systemDate = date.year + '-' + 0 + date.month + '-' + 0 + date.date;
      //   }else if(date.month<10 && date.date>10){
      //     this.systemDate = date.year + '-' + 0 + date.month + '-' + date.date;
      //   }else if(date.month>10 && date.date<10){
      //     this.systemDate = date.year + '-' + date.month + '-' + 0 + date.date;
      //   }else {
      //     this.systemDate = date.year + '-' + date.month + '-' + date.date;
      //   }
      // }
    },
    mounted() {
      // this.addDate();
    },
  };
</script>

<style lang="scss" scoped>
  .get_code {
    position: relative;
    button {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
  .navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .date {
      font-size: 20px;
      font-weight: 500;
      line-height: 50px;
      display: inline-block;
      height: 100%;
      float: left;
      margin-right: 20px;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;

          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          /*margin-top: 5px;*/
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            margin-top: 5px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 20px;
            font-size: 12px;
          }
        }
      }
    }
  }
  .cursor {
    cursor: pointer;
  }
  .el-icon-question {
    color: #999;
    margin-right: 6px;
  }
</style>
