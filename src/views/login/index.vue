<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" :placeholder="$t('login.username')"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          :placeholder="$t('login.password')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <div style="margin-bottom:22px;">
          <div id="captcha" ref="captcha">
              <p id="wait" v-if="isloading" class="show">正在加载验证码......</p>
          </div>
      </div>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
    </el-form>

    <el-dialog :title="$t('login.thirdparty')" :visible.sync="showDialog" append-to-body>
      {{$t('login.thirdpartyTips')}}
      <br/>
      <br/>
      <br/>
      <social-sign />
    </el-dialog>

  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import '@/gt'
import { geetest_api_v1, valiGeet } from '@/api/login'

export default {
  components: { LangSelect, SocialSign },
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur'}],//validator: validateUsername
        password: [{ required: true, trigger: 'blur'}]//validator: validatePassword
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      isloading:false,
      status:0,
      isValidate:false
    }
  },
  methods: {
    _initGeetest(){
      let _this = this
      this.initGeetest(function(captchaObj){
        //验证成功
        captchaObj.onSuccess(function () {
            _this.isdisabled = true;
            _this.value = "正在登录中...";
            _this.loading = true;
            let validate = captchaObj.getValidate();
            if (!validate) {
                _this.$Message.error("请先完成验证");
                return;
            }
            // _this.loginForm.geetest_challenge = validate.geetest_challenge
            // _this.loginForm.geetest_seccode = validate.geetest_seccode
            // _this.loginForm.geetest_validate = validate.geetest_validate
            let params = {
              geetest_challenge : validate.geetest_challenge,
              geetest_seccode : validate.geetest_seccode,
              geetest_validate : validate.geetest_validate,
              geetest_status : _this.status
            }
            _this.valiGeet(params)
        });
        captchaObj.onError(function () {
          _this.$refs.captcha.innerHTML = ''
          _this.isdisabled = false
          _this.value = '登录'
        });
        captchaObj.onReady(function () {
          _this.isdisabled = true
          _this.value = "请完成验证";
        });
          _this.$refs.captcha.innerHTML = ''
        captchaObj.appendTo("#captcha");
      })
    },
    valiGeet(params){
      valiGeet(params).then(res => {
        this.isValidate = true
        this.handleLogin()
      });
    },
    initGeetest(obj){
      geetest_api_v1().then(res => {
            var data = res.data;
            this.status = data.status;
            initGeetest({
                // 以下 4 个配置参数为必须，不能缺少
                gt: data.gt,
                challenge: data.challenge,
                offline: !data.success, // 表示用户后台检测极验服务器是否宕机
                new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机

                product: "float", // 产品形式，包括：float，popup
                width: "448px"
            }, obj);
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if(!this.isValidate){
            this.$message.warning('请滑动以完成验证')
            return
          }
          this.loginForm.username = this.loginForm.username.trim()
          this.loginForm.password = this.loginForm.password.trim()
          this.loginForm.grant_type = 'password'
          this.loginForm.client_id = 2
          this.loginForm.client_secret = '5IjevVN52Pe3GtiAy63WsViWfNj0L8igdscvcRtL'
          this.loginForm.scope = ''
          this.loginForm.provider = 'adminers'
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })////登录成功之后重定向到首页
          }).catch(error => {
            this.loading = false
            // this.$message.warning(error.response.data.message)
            this.$message.warning('用户名或密码错误')
            this._initGeetest()
            this.isValidate = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
    this._initGeetest()
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
 
  $bg:#283443;
  $light_gray:#eee;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input{
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
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
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
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
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
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
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
