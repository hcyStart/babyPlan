<style scoped lang="less">
    .index{
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    background: url(../images/backimg.png) no-repeat;
    background-size: 100%;
        h1{
            height: 150px;
            img{
                height: 100%;
            }
        }
       p{
          font-size: 25px;
          color: #fff;
       }
      .login-panel{
          margin: 20px 180px 0 180px;
      }
      .middle-space{
          height: 10px;
      }
     .login-opreation{
         margin: 20px 190px 0 190px;
         color: #fff;
         font-size: 14px;
         .login-remberpwd{
             float: left;
         }
         .login-forgetpwd{
             float: right;
             cursor: pointer;
             text-decoration: underline;
         }
      }
     .btn-login{
         margin:  80px 160px 0 160px;
     }
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="12">
              <h1>
                  <img src="../images/logo.png">
              </h1>
              <p>{{welcomeZh}}</p>
              <p>{{welcomeEn}}</p>
              <div class = "login-panel">
                <Input v-model="username" type = "text" placeholder="请输入用户名">
                    <span slot="prepend"><Icon color = "white" size = "22" type="person"></Icon></span>
                </Input>
                <div class = "middle-space"></div>
                <Input v-model="password" type = "password" placeholder="请输入密码">
                    <span slot="prepend"><Icon color = "white" size = "22" type="locked"></Icon></span>
                </Input>
             </div>
             <div class = "login-opreation">
                <div class = "login-remberpwd">
                  <Checkbox size = "large" v-model="remPassword">{{remberPWD}}</Checkbox>
                </div>
                <span class = "login-forgetpwd">{{forgetPWD}}</span>
             </div>
              <div class = "btn-login">
                  <Button type="primary" long size = "large" shape="circle">{{loginmsg}}</Button>
              </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
      data () {
          return {
              welcomeZh: '您好，欢迎登录xxx!',
              welcomeEn: 'Hello,welcome!',
              username: '',
              password: '',
              remberPWD:'记住密码',
              forgetPWD: '忘记密码',
              loginmsg: '登录',
              remPassword:false
          }
      },
      mounted () {

      },
      beforeDestroy () {

      },
      methods: {

      }
    }
</script>
