<!-- Created by MiYuXin on 2020/2/12. -->
<template>
<!--  background-color: box-shadow: 0 10px 10px -10px #cc696a87 inset;   border-top: 4px solid #6c8e88a8;-->
    <div id="musicList" :style="{'height':this.$store.state.musiclistbool?topheight+'px':0,'backgroundColor':this.$store.state.musiclistbool?'':'rgba(0,0,0,0)','borderTop':this.$store.state.musiclistbool?'':'4px solid rgba(108, 142, 136, 0)'}">
<!--      <button @click="ceshi()" style="left:5%;top:-11%">测试</button>-->
<!--      <div id="listTitle">-->
<!--          <p>歌曲列表</p>-->
<!--      </div>-->
<!--      <button v-on:click="setochange()">set改变</button>-->
      <ul id="musicList_ul">
        <!--歌曲列表信息填入-->
        <!-- title(歌曲名字) -->
        <!-- mcsicname - (artist) -->

<!--        :class="[String(index)===thislistidx?'active':'']"-->

<!--          <li class="forlist active"><span>4._</span><span class="forlist_con">星与你消失之日-完整版（Cover 泠鸢Yousa） - 茶理理</span><span class="iconfont icon-error forlist_icon"/></li>-->
        <li class="forlist" :class="[index===thislistidx?'active':'']" @click="sendthislistidx(index)" v-for="(Almusic,index) in Amct" :idxname="Almusic.musicname"><span>{{index+1}}._</span><span class="forlist_con">{{Almusic.title}} - （{{Almusic.artist}}）</span><span @click.stop="deletethismusic(index,Almusic.title,Almusic.artist)" class="iconfont icon-error forlist_icon"/></li>

        <!--以下是最下端提示界面-->
        <li id="last_defaule_pic"><span>--Nia~~没歌曲啦~~aiN--</span><img src="../../../public/images/musicList.png"  alt="(*･ω< ) 妳要不去找找歌曲呗!!"/></li>
      </ul>
    </div>
</template>

<script>
  import $ from 'jquery';
  import '../../../public/css/atachmusic/aliicon/iconfont';
  import {mapGetters} from 'vuex';

  export default {
      name: "musicList",
      data() {
          return {
            url:"",
            topheight:"",
            //所有歌曲信息填
            // Allmusiccontext:"",
            //下标变化
            thislistidx:0,
            rmindex:"" //当前删除的下标
          }
      },
    props:{
      inputthislistId:{
        type:Number
      }
    },
    methods:{
        ceshi(){
          console.log($('.forlist:eq('+this.thislistidx+')').attr('idxname'));
        },
      setochange(what){  //初始化音乐
        const _this=this;
        setTimeout(function (){
          const plbcheight=$('#playbcall').height();
          _this.topheight=($('#player').height()/2)-plbcheight;
          $('#musicList').css({"bottom":plbcheight});
          if (what!=="0"){
            _this.$emit('child_musicname', [$('.forlist:eq(0)').attr('idxname'),0]);
          }
        },50);

      },
      //歌曲列表axios获取"Tall"
      usiclistaxios(){
        const sendmsg={};
        sendmsg.caozuotype="Tall";
        sendmsg.user=this.$store.state.username;
        this.$axios.get(this.url+'/usermusiclist',{params:sendmsg})
          .then(res=>{
            //是数组 Amct
            this.$store.state.Allmusiccontext=res.data.msg;
            if (res.data.type==="0"){ //表示列表没有歌曲
                console.log("没有歌曲!!");
                this.setochange("0");
            }else if (res.data.type==="-1"){
                // console.log(this.$store.state.Allmusiccontext.msg);
              console.log("err");
            }else if (res.data.type==="1"){
              //初始化第一个音乐
              this.setochange();
            }
            // console.log(this.Allmusiccontext);
          })
          .catch(err=>{
            console.log(err);
          })
      },
      //传输音乐地址名
      sendthislistidx(index){
        if (this.$store.state.clicktag === 1) return false;
        this.thislistidx=index;
        this.$emit('changethislistId',index);
      },
      //删除音乐
      deletethismusic(index,title,artist){
          // console.log(index);
          // console.log(title,artist);
          // console.log(this.$store.state.username);
        this.$axios.get(this.url+'/deletethismusic',{
          params:{
            user:this.$store.state.username,
            title:title,
            artist:artist
          }
        })
        .then(res=>{
          // console.log(res);
          const redty=res.data.type;
          if (redty===-1){
            // console.log("删除失败!!");
          }else if(redty===1){
            this.$store.dispatch('removemusic',index);
            this.rmindex=index;
            // console.log("删除成功!!");
          }
        })
        .catch(err=>{
          console.log(err);
          // console.log("删除失败!!");
        });
      }
    },
    watch:{
      inputthislistId(val){
        // console.log("dddddd="+val);
        this.thislistidx=val;
        const thismusicname= $('.forlist:eq('+val+')').attr('idxname');
        // console.log("dddd=="+thismusicname);
        this.$emit('child_musicname',[thismusicname,val]);
      },
      '$store.state.isclicktoplay'(val){
        if (val===true){  //点击搜索音乐则自动播放这一首音乐
          const thislengthindex=this.$store.state.Allmusiccontext.length-1;
          // console.log(thislengthindex);
          if (thislengthindex===0){
            this.$emit('child_musicname', [$('.forlist:eq(0)').attr('idxname'),0]);
          }
          this.sendthislistidx(thislengthindex);
          this.$store.state.isclicktoplay=false;
        }
      },
      rmindex(val){
        // console.log("---------------");
        // console.log(val);
        if (this.rmindex===""||this.$store.state.Allmusiccontext.length===0) return;
        if (val===0){
          this.$emit('child_musicname', [$('.forlist:eq(1)').attr('idxname'),0]);
        }else if (this.thislistidx===val){
          this.thislistidx=0;
          this.sendthislistidx(this.thislistidx);
        }else if (this.thislistidx>val){
          this.thislistidx--;
        }
        this.rmindex="";
      }
    },
    computed:{
        ...mapGetters(['Amct']),
    },
    created() {
      this.url=this.HOST;
      this.usiclistaxios();
    },
    mounted() {
      const _this=this;
      $(function (){
        setTimeout(function (){
          const classforlistall=$('.forlist');
          // console.log(classforlistall);
          _this.$emit('classforlistall',classforlistall);
        },200);
      });
    }
  }
</script>

<style scoped>
  button{
    left: -20%;
    position: absolute;
  }
#musicList {
  /* top: -420%; */
  /*display:none;*/
  position: absolute;
  z-index:9;
  width: 100%;
  height: 0;
  bottom: 0;
  right: 0;
  transition: .5s;
  background-color: #254446bd;
  border-radius: 15px 15px 0 0;
  border-top: 4px solid #42757382;
  padding-top: 1%;
}
  #musicList:after {
    min-height: calc(100% + 1px)
  }
  #musicList_ul {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-shadow: 1em 0 1em -1em #004a3c inset;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  #musicList_ul::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  /*列表li样式*/
  #musicList_ul .forlist{
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-bottom: 1%;
    line-height: 2rem;
    font-size: 1rem;
    text-indent: 1em;
    font-style: italic;
    border-bottom: 1px solid #3f6263;
    transition: .3s;
    color: #a8b6b7;
  }
  #musicList_ul .active{
    color:#c39292d6;
  }
  #musicList_ul .forlist:active{
    background:#366a6d78;
    color: #4f9e80;
  }

  #musicList_ul .forlist_con{
    display: inline-block;
    width: 80%;
    height: 100%;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    /*border: 1px solid red;*/
  }
  #last_defaule_pic{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-style: italic;
    margin-top: 5%;
    font-size: 1.2rem;
    color: #7b5556;
    user-select: none;
    -ms-user-select: none;
  }
  #last_defaule_pic img{
    display: inline-block;
    width:5em;
    height:5em;
    opacity: .6;
  }
  #last_defaule_pic span{
    padding-top:1%;
    padding-bottom:1%;
    font-family: STXingkai,STXinwei,serif;
    border-top: 1px dashed #7b5556;
    border-bottom: 1px dashed #7b5556;

  }
  /*icon*/
  .forlist_icon{
    position: static;
    font-size: 1.2em;
    padding-right: 4%;
  }
</style>
