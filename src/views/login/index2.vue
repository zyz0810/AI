<template>
  <div class="login-container flex flex-vertical">
    <div id='mapDiv' class="mapDiv"></div>
<!--    <el-row class="login_content">-->
<!--      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12"></el-col>-->
<!--      <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"><div class="grid-content bg-purple-light"></div></el-col>-->

<!--    </el-row>-->
<!--    <div class="login_content">-->
<!--      <p class="f50 clr_white">滨江区城市管理局AI视频智能识别系统</p>-->
<!--      <div style="background: rgba(255,255,255,.5); border-radius: 20px; padding: 30px; box-shadow: 0 0 10px #ccc; width: 600px; margin: 50px auto;">-->
<!--        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">-->
<!--          <div class="title-container">-->
<!--            <h3 class="title">用户登录</h3>-->
<!--          </div>-->
<!--          <el-form-item prop="mobile">-->
<!--        <span class="svg-container">-->
<!--          <svg-icon icon-class="user" />-->
<!--        </span>-->
<!--            <el-input ref="mobile" v-model="loginForm.mobile" placeholder="请输入用户名" name="mobile" type="text" tabindex="1" autocomplete="on"/>-->
<!--          </el-form-item>-->
<!--          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>-->
<!--            <el-form-item prop="password" style="margin-bottom: 50px;">-->
<!--          <span class="svg-container">-->
<!--            <svg-icon icon-class="password" />-->
<!--          </span>-->
<!--              <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码" name="password" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false" @keyup.enter.native="handleLogin"/>-->
<!--              <span class="show-pwd" @click="showPwd">-->
<!--            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />-->
<!--          </span>-->
<!--            </el-form-item>-->
<!--          </el-tooltip>-->
<!--          &lt;!&ndash;        <div class="clearfix" style="margin-top: -8px;margin-bottom: 30px;">&ndash;&gt;-->
<!--          &lt;!&ndash;          <el-checkbox v-model="checked" class="fl">记住密码</el-checkbox>&ndash;&gt;-->
<!--          &lt;!&ndash;          <span class="f14 fr baseColor">忘记密码？</span>&ndash;&gt;-->
<!--          &lt;!&ndash;        </div>&ndash;&gt;-->
<!--          <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:50px; padding: 15px" class="login_btn f18" @click.native.prevent="handleLogin">登 录</el-button>-->
<!--        </el-form>-->
<!--      </div>-->
<!--    </div>-->





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
      otherQuery: {},
      zoom:12,
      centerLatitude:'30.20835',//中心纬度
      centerLongitude:'120.21194',//中心经度
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
    // if (this.loginForm.mobile === '') {
    //   this.$refs.mobile.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
    this.onLoad()
    console.log('加载4444')
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    onLoad() {
      console.log('加载')
      let T = window.T
      this.map = new T.Map('mapDiv')
      this.map.centerAndZoom(new T.LngLat(this.centerLongitude, this.centerLatitude), this.zoom) // 设置显示地图的中心点和级别
      // 添加地图类型控件
      // this.addCtrl()
      // this.map.setStyle('indigo');
      document.getElementsByClassName("tdt-control-copyright tdt-control")[0].style.display = 'none';

      this.getMap()
    },
    getMap() {
      let that= this
      //创建对象
      let administrative = new T.AdministrativeDivision(); //创建一个获取行政区划的实例
      let config = {
        needSubInfo: false, //是否需要下一级信息
        needAll: false, //是否需要所有子节点。
        needPolygon: true,//是否需要行政区划范围。
        needPre: true,//是否需要上一级所有信息。
        searchType: 1,//查询类型。0表示根据code查询，1表示根据名称查询。
        searchWord: '海淀区'//查询行政区划的名称。
      };
      administrative.search(config, searchResult);//方法：根据检索词发起检索，searchResult：回调参数
      function searchResult(result) {
        if (result.getStatus() == 100) {
          let data = result.getData();
          console.log(data)
          that.showMsg(data);
        } else {
          result.getMsg();
        }
      }
      //具体内容详见AdministrativeDivisionResult类。
    },
    showMsg(data) {
      for (let i = 0; i < data.length; i++) {
        //解释上级行政区划
        // if (data[i].parents) {
        //   let upLevel = "";
        //   if (data[i].parents.country) {
        //     upLevel += data[i].parents.country.name;
        //   }
        //   if (data[i].parents.province) {
        //     upLevel += data[i].parents.province.name;
        //   }
        // }

        console.log('华轩')
        console.log(data[i].points)
        if (data[i].points) {
          //绘制行政区划
          this.polygon(data[i].points);
        }

        //解释下级行政区划
        // if (data[i].child) {
        //   showMsg(data[i].child);
        //   console.log(data[i].child.points);
        //   if (data[i].child.points) {
        //     //绘制行政区划
        //     this.polygon(data[i].child.points);
        //   }
        // }
      }
    },

    polygon(points) {
      let that=this
      let pointsArr = [];
      for (let i = 0; i < points.length; i++) {
        let regionLngLats = [];
        let regionArr = points[i].region.split(",");
        for (let m = 0; m < regionArr.length; m++) {
          let lnglatArr = regionArr[m].split(" ");
          let lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
          regionLngLats.push(lnglat);
          pointsArr.push(lnglat);
        }
        //创建面对象,样式
        let polygon = new T.Polygon(regionLngLats, {
          color: "#fd737a",
          weight: 3,
          opacity: 1,
          fillColor: "#FFFFFF", //填充颜色。
          fillOpacity: 0.3 //填充透明度
        });
        //向地图上添加行政区划面
        that.map.addOverLay(polygon);
      }
      //显示最佳比例尺
      that.map.setViewport(pointsArr);
      alert(
        "当前地图中心点：" +
        that.map.getCenter().getLng() +
        "," +
        that.map.getCenter().getLat()
      );
    },


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
.mapDiv {
  width: 100%;
  height: 716px;
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
  background-color: rgb(45,98,142); /* 浏览器不支持的时候显示 */
  /*background-image: linear-gradient( #44c6fe, #0577f9);*/
  box-shadow: 0 0 10px rgb(45,98,142);
  border:none;
}

  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: #fff;
    border-radius: 5px;
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
  background: url("../../assets/image/login_bg.png") no-repeat;
  /*background-position: 0 0;*/
  background-size: 100% 50%;
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
    /*width: 600px;*/
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
    /*width: 650px;*/
    border-radius: 20px;
    padding: 50px 100px 10px;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: 0 0 10px #ccc;
    background: #fff;
    /*border:1px solid #337fd5;*/
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
    color: rgba(157,157,157,1);
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 2.6rem;
      color: rgb(45,98,142);
      margin: 0px auto 20px auto;
      text-align: center;
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
