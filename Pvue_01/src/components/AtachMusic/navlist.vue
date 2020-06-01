<!-- Created by MiYuXin on 2020/2/8. -->
<template>
    <div id="navlist">
<!--      <button id="findceshi" @click="ceshi()">搜索框的button测试</button>-->
      <span @click="changeuserlisttrue()" class="iconfont icon-liebiao" :style="{'left':findstatus?'-10%':''}"/>

      <!-- 搜索 -->
      <div id="find_top"  :style="{'top':findstatus?'':'-100%'}">
        <span @click="changesousuo(false)" class="iconfont icon-draw-back"/>
        <label>
          <input @focus="isfind()" v-model="musicmsg" type="text" name="findof" placeholder="搜索" id="findof_ip" class="findnoactive">
        </label>


<!--        {{Lodamusicmsg}}-->
        <div id="findresult" v-show="findsultstatus">
          <ul>
              <li class="findlist" @click="sendmusiclist(LMmsg,'Tadd')" v-for="LMmsg in Lodamusicmsg">
                <p class="findlistp">
                <svg t="1583119038884" class="icon mp3icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3649" width="200" height="200"><path d="M1024 541.257143c-8.777143-275.017143-234.057143-497.371429-512-497.371429s-503.222857 222.354286-512 497.371429v336.457143c0 55.588571 46.811429 102.4 102.4 102.4s102.4-46.811429 102.4-102.4v-234.057143c0-55.588571-46.811429-102.4-102.4-102.4h-73.142857c8.777143-260.388571 219.428571-468.114286 482.742857-468.114286 260.388571 0 473.965714 207.725714 482.742857 468.114286h-73.142857c-55.588571 0-102.4 46.811429-102.4 102.4v234.057143c0 55.588571 46.811429 102.4 102.4 102.4s102.4-46.811429 102.4-102.4v-336.457143z m-848.457143 102.4v234.057143c0 40.96-32.182857 73.142857-73.142857 73.142857s-73.142857-32.182857-73.142857-73.142857v-307.2h73.142857c40.96 0 73.142857 32.182857 73.142857 73.142857z m819.2 234.057143c0 40.96-32.182857 73.142857-73.142857 73.142857s-73.142857-32.182857-73.142857-73.142857v-234.057143c0-40.96 32.182857-73.142857 73.142857-73.142857h73.142857v307.2z" p-id="3650" fill="#bfbfbf"/></svg>
                {{LMmsg.title}}&nbsp;&nbsp;--&nbsp;&nbsp;{{LMmsg.artist}}</p>
              </li>
<!--              <li class="findlist">{{Lodamusicmsg}}}</li>-->
          </ul>
        </div>
      </div>

      <transition name="findresmsg_T">
        <span class="findresmsg" v-show="isfrmshow_s">{{findresmsgs_com}}</span>
      </transition>

      <!-- 搜索--end -->
      <div id="topmusicname" :style="{'top':findstatus?'100%':''}">
          <p>{{inputemitmusicname}}</p>
      </div>

      <span @click="changesousuo(true)" id="iconfont_sousuo" class="iconfont icon-sousuo" :style="{'right':findstatus?'-10%':''}"/>
    </div>
</template>


<script>
  import '../../public/css/atachmusic/findof.css';
  import $ from 'jquery';

  let _=require('lodash');


    export default {
      name: "navlist",
      data() {
        return {
          url:"",
          findstatus:false,
          musicmsg:"",
          Lodamusicmsg:"",
          findresmsgs:"",
          isfrmshow:false
        }
      },
      components: {

      },
      props:{
        inputemitmusicname:{
          type:String
        }
      },
      methods:{
        ceshi(){
          this.isfrmshow=!this.isfrmshow;
        },
        //----------
        changeuserlisttrue(){
          const bool=true;
          this.$store.dispatch('changeshowuserlist',bool);
        },
        changesousuo(status){
          this.findstatus=status;
        },
        changefindresmsgs(msg){
          this.findresmsgs=msg;
          this.isfrmshow=!this.isfrmshow;
          const _this=this;
          setTimeout(function (){
            _this.isfrmshow=false;
          },1000);
        },
        //----------------------------
        //根据搜索框内容向后台查询信息
        getmsg(){
          const _this = this;
          // console.log(this.musicmsg);
          this.$axios.get(this.url+'/findmp3',{params:{
              musicname:this.musicmsg
            }})
            .then(res=>{
              // console.log(res);
              if (res.status===200){
                if (res.data){
                  this.Lodamusicmsg=res.data;
                  this.$store.dispatch('changeshowfindsult',true);
                }else if(res.data===""){
                  // console.log(res.data);
                  this.Lodamusicmsg=res.data;
                  this.$store.dispatch('changeshowfindsult',false);
                }
              }else{
                // console.log("错误");
                const errmsg="未知错误!请联系作者|\\-_-#";
                this.changefindresmsgs(errmsg);
              }
            })
            .catch(err=>{
              // console.log(err);
              const errmsg="未知错误!请联系作者|\\-_-#";
              this.changefindresmsgs(errmsg);
            })
        },
        isfind(){
          // console.log(this.Lodamusicmsg);
          if (this.Lodamusicmsg) this.getmsg();
        },
        //添加当前音乐进试听
        sendmusiclist(LMmsg,type){
          LMmsg.caozuotype=type;
          LMmsg.user=this.$store.state.username;
          // console.log(LMmsg);
          this.$axios.get(this.url+'/usermusiclist',{params:LMmsg})
            .then(res=>{
              // console.log(res.data);
              const rd=res.data;
              if (rd.type==="-1"){ //重复或者错误
                // console.log(rd.msg);
                const errmsg="歌曲已存在!!(ーー;)";
                this.changefindresmsgs(errmsg);
              }else if(rd.type==="1"){  //成功
                // console.log(rd);
                // console.log("66666");
                this.$store.dispatch('addmusic',rd.msg[0]);
                this.$store.dispatch('changeshowfindsult',false);
                const truemsg="歌曲添加成功!!ヽ(≧∀≦)ﾉ";
                this.changefindresmsgs(truemsg);
              }
            })
            .catch(err=>{
              // console.log(err);
              console.log(err);
              const errmsg="歌曲已存在!!(ーー;)";
              this.changefindresmsgs(errmsg);
            })
        }
      },
      watch:{
        musicmsg:function (){
          this.debouncedGetAnswer();
        }
      },
      computed:{
        findsultstatus:function (){
            return this.$store.state.findsultbool;
        },
        isfrmshow_s:function (){
          return this.isfrmshow;
        },
        findresmsgs_com:function (){
            return this.findresmsgs;
        }
      },
      created() {
        this.url=this.HOST;
        this.debouncedGetAnswer = _.debounce(this.getmsg, 300);
      },
      mounted() {
        $(function (){
            $("#findof_ip").focus(function (){
              $(this).addClass('findofactive');
              $(this).removeClass('findnoactive');
            }).blur(function (){
              $(this).addClass('findnoactive');
              $(this).removeClass('findofactive');
            });
          });
      }
    }
</script>

<style scoped>
  #findceshi{
    position:absolute;
    top:20rem;
    left:25%;
    z-index: 9999;
  }
  /*-----------------*/
  #findresult{
    position: absolute;
    width: 80%;
    /* height: 13rem; */
    margin-left: 10%;
    top: 110%;
    z-index: 15;
    padding-bottom: 2%;
    border: 1px solid #085c5891;
    background-color: #254446bd;
  }
  #findresult::before{
    content: '';
    position: absolute;
    top: -0.6rem;
    left: 1rem;
    border-bottom: 10px solid #244245cc;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
  }
  #findresult ul{
    width:100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /*border:1px solid red;*/
  }
  .findlist{
    position: relative;
    width: 100%;
    height: 2.1rem;
    margin-bottom: 1%;
    -webkit-transition: .3s;
    transition: .3s;
  }
  .findlist:active{
    background-color: #12292985;
  }
  .findlistp{
    float: left;
    color: #bcb5b5ad;
    width: 90%;
    height: 100%;
    margin-left: 5%;
    text-indent: 0.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-family: cursive;
    font-size: 1rem;
    overflow: hidden;
    line-height: 2.3em;
    border-radius: 4px;
    border-bottom: 2px solid #809a9980;
  }
  .mp3icon{
    display: inline-block;
    float: left;
    opacity: 0.6;
    margin: 0.5rem 0 0 0.4rem;
    font-size: 1rem;
  }

  .findresmsg{
    position: absolute;
    width: 14rem;
    height: 1.7rem;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 15;
    top: 14rem;
    display: inline-block;
    color: #a9a7a7;
    text-align: center;
    line-height: 1.7rem;
    font-family: cursive;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 4px;
    border: 1px solid #0c373ac4;
    background-color: rgba(30, 75, 79, 0.67);
  }
  .findresmsg_T-enter{
    opacity: 0;
    transform: translateY(-1rem);
  }
  .findresmsg_T-leave-to{
    opacity: 0;
    transform: translateY(1rem);
  }
  .findresmsg_T-enter-active,.findresmsg_T-leave-active{
    transition:all .3s;
  }
  /*--------------------------*/
  #navlist{
    position: relative;
    top:0;
    margin: 0;
    width:100%;
    height:5%;
    line-height: 2rem;
    /*overflow: hidden;*/
    background-color: rgba(68, 109, 109, 0.78);
  }
  /*例外icon_列表*/
  .icon-liebiao{
    font-size: 2rem;
    z-index: 4;
    color: #a8b9bbbd;
    left: 4%;
  }
  #navlist .iconfont,#navlist .icon-draw-back{
    transition: .5s;
  }
  #navlist .iconfont:active{
    /*font-size: ;*/
    color: #ef7070;
  }
  .icon-draw-back{
    top: 10%;
    left: 3%;
    font-size: 1.8em;
    color: #a2a4a4;
    font-weight: bold;
  }
  .icon-draw-back:active{
    color:#cc706e;
  }

  #topmusicname{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    transition: .5s;
    z-index: 0;
  }
  #topmusicname p{
    position: absolute;
    width: 70%;
    height: 50%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    line-height: 1.4em;
    overflow: hidden;
    color: #dcdbdbc7;
    font-style: italic;
    font-weight: bold;
  }
</style>
