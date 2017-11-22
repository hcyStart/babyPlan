<template>
  <div class="login">
      <div class= "login-content">
          <input type = "text" class = "input-style" v-model = "loginUser"/>
          <input type = "password" class = "input-style"  v-model = "loginPassword">
           <button @click.native="loginmeth">{{loginAction}}</button>
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
    loginmeth () {
      console.log("err");
    },
   re(){
      console.log("err");
   }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
