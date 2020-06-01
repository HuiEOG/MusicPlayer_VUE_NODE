<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <div id="LRdiv">
      <ul>
          <router-link tag="li" to="/mLogReg/Login">登录界面</router-link>
          <router-link tag="li" to="/mLogReg/regist">注册界面</router-link>
      </ul>
      <keep-alive>
        <transition name="LRRVToleft">
          <router-view id="LRrv"/>
        </transition>
      </keep-alive>
    </div>
</template>

<script>
  //前端跳路由，页面不刷新，不会触发$(function(){})，解决办法：把$(function(){})写在created中，增加watch，监听$route
  import '../../public/css/LogReg/LogReg.css';
    export default {
      name: "LRdiv",
      data() {
          return {
            pausername:"",
            papassword:""
          }
      },
      methods:{
          jsfn(){
            $(function (){
              $(".Loginp").focus(function (){
                $(this).addClass('inpactive');
              }).blur(function (){
                $(this).removeClass('inpactive');
              });
            });
          }
      },
      created() {
        this.jsfn();
      },
      watch:{
        // $route(to,from){
        //   this.jsfn();
        //   if (this.$route.params.username!==undefined&&this.$route.params.password!==undefined){
        //   console.log(this.$route.params.username);
        //   console.log(this.$route.params.password);
        //   }
        // }
      }
    }
</script>

<style scoped>
  #LRdiv{
    position: absolute;
    top: 38%;
    margin: 0 auto;
    width: 20rem;
    height: 50%;
  }
  li{
    float: left;
    width: 47%;
    height: 100%;
    margin:0 1%;
    font-size: 1rem;
    text-align: center;
    line-height: 220%;
    color: white;
    border: 1px solid #61b5a3a8;
    border-radius:7px;
    background-color: rgba(121, 188, 180, 0.62);
  }
  #LRrv{
    position: relative;
    top: 15%;
    border-radius: 2px;
    width: 100%;
    height: 66%;
    /*background-color: rgba(121,188,180,0.62);*/
  }
  .myactive{
    background-color: rgba(235, 139, 135, 0.6);
  }


  .LRRVToleft-enter-active{
    animation: LRenteract .6s ease;
  }
  .LRRVToleft-leave-active{
    animation: LRleaveact .6s ease ;
  }
  @keyframes LRenteract{
    0%{
      opacity: 0;
      top:-51%;
      transform:translateX(21rem);
    }
    100%{
      opacity: 1;
      top:-51%;
      transform: translateX(0px);
    }
  }
  @keyframes LRleaveact{
    0%{
      opacity: 1;
      transform:translateX(0px);
    }
    100%{
      opacity: 0;
      transform: translateX(-21rem);
    }
  }
</style>
