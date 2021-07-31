<template>
  <div class="login-container flex flex-vertical">

<!--    <el-row class="login_content">-->
<!--      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"></el-col>-->
<!--      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple-light"></div></el-col>-->

<!--    </el-row>-->
    <div class="login_content">
      <img src="../../assets/image/login_txt.png" class="login_txt"/>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">用户登录</h3>
          </div>
          <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
            <el-input ref="mobile" v-model="loginForm.mobile" placeholder="请输入用户名" name="mobile" type="text" tabindex="1" autocomplete="on"/>
          </el-form-item>
          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password" style="margin-bottom: 50px;">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
              <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin"/>
              <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
            </el-form-item>
          </el-tooltip>
<!--        <div class="clearfix" style="margin-top: -8px;margin-bottom: 30px;">-->
<!--          <el-checkbox v-model="checked" class="fl">记住密码</el-checkbox>-->
<!--          <span class="f14 fr baseColor">忘记密码？</span>-->
<!--        </div>-->
          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px; padding: 15px" class="login_btn f18" @click.native.prevent="handleLogin">登 录</el-button>
        </el-form>
    </div>





  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import axios from 'axios'
import Qs from 'qs'
export default {
  name: 'Login',
  components: {  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请填写用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请填写正确的密码'))
      } else {
        callback()
      }
    }
    return {
      checked:false,
      loginForm: {
        mobile: '',
        password: ''
      },
      loginRules: {
        // username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        mobile:[{required: true, message: '请输入用户名', trigger: 'change'}],
        password: [{ required: true,message: '请输入密码', trigger: 'change' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.mobile === '') {
      this.$refs.mobile.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // let data = {
      //   "username": "admin",
      //   "password": "a"
      // }
      // axios({
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'client_id':'webApp',
      //     'client_secret':'webApp'
      //   },
      //   method: 'post',
      //   url: 'http://192.168.3.66:9200/api-auth/oauth/platform/login',
      //   data: Qs.stringify(data),
      //   success(){
      //
      //   }
      // })


      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.loading = true
          this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
          this.loading = false
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((e) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    // color: $cursor;
  }
}

/* reset element-ui css */
.login-container {

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      &:-webkit-autofill {
        // box-shadow: 0 0 0px 1000px $bg inset !important;
       //  -webkit-text-fill-color: $cursor !important;
      }
    }
  }
.login_btn{
  background-color: #2143af; /* 浏览器不支持的时候显示 */
  background-image: linear-gradient( #44c6fe, #0577f9);
  border:none;
}

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fff;
    /*border-radius: 5px;*/
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$txt:#3f35cf;


.login-container {
  min-height: 100%;
  width: 100%;
  //background-color: $bg;
  background: url("../../assets/image/login_bg.jpg") no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
  overflow: hidden;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  .login_content{
    /*width: 90%;*/
    /*margin: 0 auto;*/
    /*height: 100vh;*/
    width: 650px;
  }


.login_txt{
  width: 600px;
  margin: 0 auto 5vh;
  display: block;
}


  .login-form {
    color:#fff;
    /*position: fixed;*/
    /*left: 66%;*/
    /*top: 45%;*/
    width: 650px;
    padding: 50px 150px 10px;
    margin: 0 auto 150px;
    overflow: hidden;
    background: rgba(0,0,0,0.2);
    border:1px solid #337fd5;
/deep/.el-checkbox__label{
  color: #fff !important;
}
    .form-item__content{
      background: #fff;
    }
    /deep/.el-input__inner{
      font-size: 14px;
      color: #333 !important;
      border:none !important;
      background: #fff !important;
      &::-webkit-input-placeholder {
        /* WebKit browsers */
        color: #ccc !important;
      }
      &:-moz-placeholder {
        /* Mozilla Firefox 4 to 18 */
        color: #ccc !important;
      }
      &::-moz-placeholder {
        /* Mozilla Firefox 19+ */
        color: #ccc !important;
      }
      &:-ms-input-placeholder {
        /* Internet Explorer 10+ */
        color: #ccc !important;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: rgba(12,131,250,1);
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #fff;
      margin: 0px auto 20px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }


  /*@media only screen and (max-width: 1370px) {*/
  /*  .login-form{*/
  /*    left: 60%;*/
  /*  }*/
  /*}*/
  /*@media only screen and (max-width: 1150px) {*/
  /*  .login-form{*/
  /*    left: 55%;*/
  /*  }*/
  /*}*/
  /*@media only screen and (max-width: 1000px) {*/
  /*  .login-form{*/
  /*    left: 50%;*/
  /*  }*/
  /*}*/
}
</style>
