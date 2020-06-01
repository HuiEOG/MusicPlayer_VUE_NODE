<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import $ from 'jquery';

  $(function (){
    var winhei=$(window).height();
    $('#app').css("height",winhei);
    // $('#app').children(":first").css("height",winhei);
    // console.log($(window));
    // console.log(winhei+"||"+$('#app div:first').height());
  });

export default {
  name: 'App',
  mounted() {
    if (this._isMobile()) {
      // this.$router.replace('/mLogReg');
      //atchmusic

      // this.$router.replace('/');
      console.log("手机端=='"+this.$router.history.current.path+"'");
    } else {
      console.log("pc端");
      // this.$router.replace('/pLogReg');
    }
  },
  methods:{
    _isMobile() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
*{ margin:0; padding:0;font-family:"Microsoft yahei",serif;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);}
li{ list-style-type: none;}
  ::selection{
    color: #e17373d1;
    background: rgba(29, 115, 105, 0.58);
  }
  a{
    text-decoration: none;
  }
::-webkit-scrollbar
{
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,128,255,0.6);
  box-shadow: inset 0 0 20px rgba(158,158,158,0.6);
  border-radius: 2px;
  background-color: #ececec;
}

::-webkit-scrollbar-thumb
{
  border-radius: 2px;
  background-color:#14354ca1;
}
</style>
