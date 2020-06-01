<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <nav id="userlist" >
<!--      <button id="userbut" @click="textuser">用户列表测试按钮</button>-->
      <div id="user_header">
        <p id="name">{{this.$store.state.username}}</p>
        <img src="../../../public/images/9.png" id="userpic" alt="用户头像"/>
      </div>

      <div id="userlist_ext">
          <ul>
            <!-- @click="showthisson(index)" -->
              <li v-for="(ext,index) in extlist" :key="index" class="extlist">
                <span :class="['iconfont','ico_userlist', iconspan[index]]"/>
                <span @click="showthisson(index)" class="extlist_span">{{ext}}</span>
                <erweima v-if="index===0" :style="{'height':index0?'':0}" class="extContext"/>
                <settime-stop v-if="index===1" :style="{'height':index1?'':0}" class="extContext"/>
                <author v-if="index===2" :style="{'height':index2?'':0}" class="extContext"/>
              </li>
          </ul>
      </div>

      <!--nav_bottom-->
      <div @click="LOGOUT" id="nav_bottom">
          <span :class="['iconfont','ico_userlist','iconfont_tuichu', exiticon]"/><p>退出</p>
      </div>

    </nav>
</template>

<script>
  import $ from 'jquery';
  import erweima from "./pageUser/erweima";
  import settimeStop from "./pageUser/settimeStop";
  import author from "./pageUser/author";
    export default {
      name: "userlist",
      data() {
        return {
          extlist: ["播放器地址", "定时停止播放", "作者信息"],
          iconspan: ["icon-erweima", "icon-dingshi", "icon-zuozhe", "icon-sousuo"],
          exiticon: "icon-tuichu",
          //各个子组件的'开关'参数
          index0:false,
          index1:false,
          index2:false,

        }
      },
      components:{
        erweima,
        settimeStop,
        author
      },
      methods:{
        //测试按钮
        textuser(index){
          // console.log($('#erweima').css('height'));
          console.log(this.index0);
        },
        //组件函数
        showthisson(index){
          // console.log($('#userlist_ext #'+index+'').height());
          const exteq=$('.extlist:eq('+index+')');
          switch (index) {
            case 0:
              this.index0=!this.index0;
              this.index0?exteq.addClass('extactive'):exteq.removeClass('extactive');
              break;
            case 1:
              this.index1=!this.index1;
              this.index1?exteq.addClass('extactive'):exteq.removeClass('extactive');
              break;
            case 2:
              this.index2=!this.index2;
              this.index2?exteq.addClass('extactive'):exteq.removeClass('extactive');
              break;
            default:
              this.index0=false;
              this.index1=false;
              this.index2=false;
              break;
          }
        },
        LOGOUT(){
          this.$store.commit('LOGOUT');
          console.log("清除Token成功!!退出成功!!");

          const _this=this;
          setTimeout(function (){
            _this.$router.replace({path:'/mLogReg'});
          },1000);
        }

      }
    }
</script>

<style scoped>

.extContext{
  /*height: 0;*/
  transition: .3s;
  word-break: break-word;
  /*background-color: rgba(28,28,28,0.61);*/
}
  #userbut{
    position: absolute;
    top:10%;
    left:0%;
    z-index: 9999999999999;
  }
  .extactive{
    background-color:rgba(28,28,28,0.61);
    border-bottom:2px solid #805b5bc4;
  }
</style>
