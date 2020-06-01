<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <div id="atchmusic" class="Allcenter" :style="{'background':'url('+atbg+') round'}">

<!--      <button @click="getYYY">YYYYYYYYYYYYYYYYY</button>-->
      <transition name="showtimeON">
        <settimeto v-show="this.$store.state.showdis"/>
      </transition>

      <userlist :style="{left:this.$store.state.userlistbool?'0%':'-18rem'}"/>
      <navlist id="navlist" :inputemitmusicname="emitmusicname"/>
      <player id="player" class="Allcenter" @emitmusicname="getEmitmusicname"/>
    </div>
</template>

<script>
  import $ from 'jquery';
  import settimeto from "./AtachMusic/settimeto";
  import navlist from "./AtachMusic/navlist";
  import player from "./AtachMusic/player";
  import userlist from "./AtachMusic/navlist/userlist";
  import '../public/css/atachmusic/icon_con.css';
  import '../public/css/atachmusic/aliicon/iconfont.css';
  import '../public/css/atachmusic/userlist.css';

  export default {
      name: "atchmusic",
      data() {
          return {
            emitmusicname:""
          }
      },
      components:{
        settimeto,
        userlist,
        navlist,
        player
      },
      methods:{
        getEmitmusicname(emitmusicname){
          this.emitmusicname=emitmusicname;
        },
        isMobile(){
          return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        }
      },
      computed:{
        atbg:function (){
          //1-为手机端,2-电脑端
          return this.isMobile() ? require('../public/images/bgACT_2.jpg') : require('../public/images/bgACT_1.jpg');
        }
      },
      //钩子函数(导航守卫)
      // beforeDestroy() {
      //   console.log('销毁前--22222');
      //
      // },
      // destroyed() {
      //   console.log('销毁后--22222');
      //
      // },
      //钩子函数(导航守卫)-end

      created() {
          const _this=this;
        $(function (){
          ////////////////////////////navlist下的js
          const appheight=$("#app").height()/2;
          $('#userlist').css('height',appheight);
          // $('#nav_bottom:before').css({"top":nav_bottom_before_top},{"height":appheight});
          ////////////////////////////player下的js
          const tolist=$('#atchmusic').height()-$('#navlist').height();
          $('#player').css("height",tolist);
          ////////////////////////////
          console.log("-------baractive--ヽ(´•ω•`)､__看啥呢?小伙子!!--evitcarab-------");

        });
      },
    }

</script>

<style scoped>
  #atchmusic::before,.Allcenter{
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin:auto;
  }
  #atchmusic{
    position: relative;
    width:100%;
    height:100%;
    overflow-x: hidden;
  }
  #atchmusic::before{
    content: '';
    position: absolute;

    /*filter: blur(20px);*/
    z-index: -1;
  }
  /*showtimeON的动画进入退出*/
  .showtimeON-enter-active,.showtimeON-leave-active{
    transition:.3s;
  }
  .showtimeON-enter,.showtimeON-leave-to{
    opacity: 0;
  }
</style>


