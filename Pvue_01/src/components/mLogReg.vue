<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <div id="mLogReg" :style="{'background':'url('+LRbgg+') round'}">
      <div id="mLogReg_view" class="Allcenter">
        <img src="../public/images/9.png" id="userpic" class="Allcenter" alt="用户头像"/>
        <LRdiv class="Allcenter"/>
      </div>
    </div>
</template>

<script>
  import $ from 'jquery'
  import LRdiv from '../components/LogReg/LRdiv';
    export default {
        name: "mLogReg",
        data() {
            return {

            }
        },
        components:{
          LRdiv
        },
        methods:{
          isMobile(){
            return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
          }
        },
        computed:{
          LRbgg:function (){
            //1-为手机端,2-电脑端
            return this.isMobile() ? require('../public/images/LRbg_mb.jpg') : require('../public/images/LRbg_pc.jpg');
          }
        }
    }
</script>

<style scoped>
  .Allcenter{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
  }
  #mLogReg{
    width: 100%;
    height:100%;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    overflow: hidden;
  }
  #mLogReg_view{
    position: relative;
    width: 85%;
    height: 90%;
    top: 5%;
    /*background-color: #d5d5d5b0;*/
    /*border: 1px solid #7d7b7b;*/
    /*border-radius: 8px;*/
    /*box-shadow: 0 0 9px #b6baba;*/
  }
  #userpic{
    position: absolute;
    top: 10%;
    margin: 0 auto;
    border: 3px solid #e1d8d8;
    border-radius: 50%;
    -webkit-box-shadow: 0 0 40px #b4a6a6;
    box-shadow: 0 0 40px #b4a6a6;
    width: 10rem;
    height: 10rem;
  }
</style>
