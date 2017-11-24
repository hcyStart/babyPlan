<template>
  <div class="login">
      <div class= "login-content">
           <div class = "user-name">
              <input type = "text" class = "name-style" placeholder = "账户" v-model = "loginUser"/>
           </div>
           <div class = "user-password">
              <input type = "password" class = "password-style" placeholder = "请输入密码" v-model = "loginPassword">
           </div>
           <button class = "btn-login" @click.native="loginMeth">{{loginAction}}</button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loginAction: '登录',
      loginUser: '',
      loginPassword: ''
    }
  },
  method:{
    loginMeth () {
    debugger;
     var _this = this;
      alert(_this.loginUser);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-content{

}
.user-name{

}
.name-style{

}
.password-style{

}
.btn-login{

}
</style>
