<!-- Created by MiYuXin on 2020/2/9. -->
<template>
  <div id="player">



    <!--lyric   controls="controls" -->
      <!-- 歌词 -->
    <div id="lyrics" @click="changeshowfalse()">
      <audio  ref="audio" loop :src="changemusicsrc" id="audiomusic" preload="auto" style="position: absolute"/>
<!--      <button @click="getalldata()" style="position: absolute;z-index: 999999;right: 2%;">测试按钮{{currentTimes}}&#45;&#45;{{this.$store.state.userlistbool}}</button>-->
      <!-- {{currentTimes}}--{{this.$store.state.userlistbool}} -->
      <!--getalldata     duration-->

      <p id="emptyP" v-if="this.$store.state.Allmusiccontext.length===0">|--未添加音乐--|</p>

      <div id="lyrics_scroll">
        <ul id="lyrics_ul" :style="{top:ultops+'px'}">
          <!--          <li class="active">短发傻傻的</li>-->
          <!--          <li>短发傻傻的</li>-->
          <li v-for="(Alllrc,index) in thisAlllrc" :style="{'height':(trueTwoList>0?'12%':'6%')}" class="lyricsClass" :idx="index" :class="{'active':String(index)===(currentTimes==='0'?'0':thisidx)}" :time="deallrc(Alllrc,'timestamp')">
            <span>{{Alllrc.content}}</span>
            <span v-if="trueTwoList>0">{{Alllrc.content2}}</span>
          </li>
        </ul>
      </div>




    </div>
    <!--con和bar集合-->
    <div id="playbcall">
      <div id="playbcall_div">
        <!--bar-->
        <div id="playbar">
          <span id="mctime">{{showTime}}</span>
          <div>
            <span class="playerbar playerbar_active"/>
            <span id="barAllwidth" class="playerbar"/>
          </div>
          <svg class="icon icon-jindutiao" id="jindutiao" aria-hidden="true">
            <use xlink:href="#icon-choose"/>
          </svg>
        </div>
        <!--control-->
        <div id="playcontrol">
          <!--播放类型-->
          <a :href="changemusicsrc" :download="changemusicsrc">
            <span @click="dowmloadMP3()" class="iconfont ico_pci icon-menu_calendartpl"/>
          </a>

          <span @click="changeplaytype()" id="iconplaytype" class="iconfont ico_pci" :class="playinftype[playtypeindex]"/>

          <span @click="beforemusic()" class="iconfont ico_pci icon-icon-test1"/>
          <span @click="getplaystaus()" class="iconfont ico_pci" :class="[playstaus?'icon-kaishi':'icon-zanting']"/>
          <span @click="nextmusic()" class="iconfont ico_pci icon-icon-test"/>

          <span @click="getshowliststaus()" class="iconfont ico_pci" :class="[this.$store.state.musiclistbool?'icon-error':'icon-liebiao1-copy']"/>
        </div>
      </div>
    </div>
    <!--结束-->
        <musicList @child_musicname="getchild_musicname" @changethislistId="getchangethislistId" @classforlistall="getclassforlistall" :inputthislistId="thislistId"/>
  </div>
</template>

<script>
  import { Lrc } from 'lrc-kit';
  import $ from "jquery";
  import '../../public/css/atachmusic/aliicon/iconfont.css';
  import '../../public/css/atachmusic/aliicon/iconfont.js'
  import musicList from './player/musicList';

  export default {
    name: "player",
    data() {
      return {
        //lyric
        audio:"",
        url:"",
        thisinfo:"",
        thisAlllrc:"", //歌曲的所有歌词存储
        trueTwoList:"", //是否是双语
        lyricsClasslength:"",
        //audio
        //绝体绝命 - 阿良良木健,洛天依 ミスターフィクサー - Sou
        musicsrcname:"",
        isfirst:true,
        playstaus:true,
        currentTimes:"0",
        durations:"0",
        MathFloor_durations:"0",
        endeds:false,
        //定时器
        baractInterval:[],
        //control
        playconicon:["icon-gengduo","icon-icon-test1","icon-zanting","icon-icon-test","icon-liebiao1-copy"],//更多，上一首，开始，暂停，下一首，列表，关闭列表(错误)
        changeicon:["icon-kaishi","icon-error"],
        //各个初始化的长度或者Left值
        barAllwidth:"0", //根据歌曲的进度条总共长度
        thisbarwidth:"0", //当前进度条长度
        icon_jindutiao_left:"", //进度条滑块的左边距
        thisidx:0, //当前播放音乐下标
        lyricLastTime:"", //音乐最后的时间,给currTime控制最后的显示
        ultopbefore:"", //歌词的ul初始化的上边距
        ultops:"", //歌词变化处理后的上边距
        needtotop:"", //需要向下滑动的高度
        //时间显示
        CF:"00", //当前进行的分钟
        CS:"00", //当前进行的秒
        DF:"00", //当前音乐的总分钟
        DS:"00", //当前音乐的总秒
        //下一首和上一首等
        thislistId:0,
        Allmusiccount:0,
        //单曲循环-0、列表循环-1、随机-2
        playinftype:['icon-danquxunhuan','icon-xunhuanbofang','icon-suijibofang'],
        playtypeindex:0
      }
    },


    //钩子函数(导航守卫)
    beforeDestroy() {
      console.log('销毁前');
      // console.log(this.baractInterval);
      // this.rebaractInterval();
      // this.baractInterval=[];
    },
    destroyed() {
      console.log('销毁后');
      this.rebaractInterval();
      this.baractInterval=[];
      // console.log(this.baractInterval);

      // Object.assign(this.$data, this.$options.data());
      // console.log(this.$data);
      this.$store.state.musiclistbool=false;
      this.$store.state.userlistbool=false;
      this.$store.state.clicktag=0;
    },
    //钩子函数(导航守卫)-end
    components:{
      musicList,
    },
    methods:{
      changeshowfalse(){
        let bool=false;
        this.$store.dispatch('chatbool',bool);
        this.$store.dispatch('changeshowfindsult',bool);
      },
      //防止多次点击函数封装--String('.lop')--Array(['.lop','#lll'])--DOM(DOM对象单个输入)
      preventClick(clickobj){
        const _this=this;
        let lem=clickobj.length;
        if (typeof clickobj==="object"){
          if (lem===undefined){
              lem=1;
          }
        }else if(typeof clickobj==="string"){
          if (arguments.length>1){
            console.log('String类型输入的,请输入1个参数,否则以数组输入!!');
            return;
          }
          lem=1;
        }
        if (lem===0) return;
        for (let i = 0; i < lem; i++) {
          $(clickobj[i]).bind('click',function (){
            if (_this.$store.state.clicktag === 0) {
              _this.$store.state.clicktag = 1;
              setTimeout(function() {
                _this.$store.state.clicktag = 0;
              }, 500);
            } else {
              console.log("请勿频繁点击！");
            }
          });
        }
      },
      //防止多次点击函数封装--String('.lop')--Array(['.lop','#lll'])--DOM(DOM对象单个输入)-end

      //得到musiclist的所有列表对象并添加’防止多次点击事件‘
      getclassforlistall(classforlistall){
        this.preventClick(classforlistall);
      },
      //进入数据初始化和musicsrc地址变化之后durations初始化
      getchangeInitialize(){
        let audioreadystatus=0;
        const _this=this;
          let ge=setInterval(function (){
            audioreadystatus=_this.$refs.audio.readyState;
            if (audioreadystatus===4){
              //其他数据初始化
              _this.barAllwidth= $('#barAllwidth').width();
              _this.lyricLastTime=$('.lyricsClass:last-child').attr("time");
              _this.needtotop=$('.lyricsClass').height();
              _this.playstaus=true;
              _this.thisidx="0";
              // console.log("后thisidx=="+_this.thisidx);
              // console.log("后beforeindex=="+_this.beforeindex);
              _this.endeds=false;
              //其他数据初始化-end
              _this.ultotop();
              _this.duration();
              _this.baractive();
              if (_this.isfirst===false){
                  _this.play();
              }else{
                _this.isfirst=!_this.isfirst;
              }

              clearInterval(ge);
              console.log("初始化或更换音乐加载完成:"+audioreadystatus);
            }else{
              console.log("更换音乐加载失败,当前状态为:"+audioreadystatus);
              _this.rebaractInterval();
            }
          },500);
      },
      //lyric
      //更改初始化歌词
      lrcaxios(musicname){
        if (musicname===undefined) return;
        this.$axios.get(this.url+'/lrc',{
          params:{
            musicname:musicname
          }
        })
        .then(res=>{
          // console.log(res.data);
          //{timestamp, content}
          let lrc=Lrc.parse(res.data);
          //修正方法使用
          this.thisAlllrc=this.lyricTimeSort(lrc.lyrics);
          // console.log(this.thisAlllrc);
          this.thisinfo=lrc.info;
          this.lyricsClasslength=this.thisAlllrc.length;
          // console.log(this.lyricsClasslength);
          // console.log(_this.lyricsClasslength);
          // console.log(lrc.lyrics);
          // console.log(lrc.info);
        })
        .catch(err=>{
          console.log(err);
        })
      },
      //对歌词按照timestamp的大小进行从小排序
      lyricTimeSort(arr){
        let narr=[];
        this.trueTwoList=0;
        //对“,”进行处理分开翻译
        // console.log(arr);
        for (let s = 0; s < arr.length; s++) {
          if(arr[s].content.indexOf(',')!==-1){
            let njson;
            let splitContent=arr[s].content.split(',');
            arr[s].content=splitContent[0];
            njson={
              timestamp: arr[s].timestamp,
              content: splitContent[1]
            };
            arr.push(njson);
          }
        }
        //小到大排序----
        //arr.sort();
        for(let j=0;j<arr.length-1;j++){
          //两两比较，如果前一个比后一个大，则交换位置。
          for(let i=0;i<arr.length-1-j;i++){
            if(arr[i].timestamp>arr[i+1].timestamp){
              let temp = arr[i];
              arr[i] = arr[i+1];
              arr[i+1] = temp;
            }
          }
        }
        //相同的合在一起
        for(let k=0,lem=arr.length;k<lem;k++){
          if (arr[k+1]===undefined||arr[k].timestamp!==arr[k+1].timestamp){
            narr.push(arr[k]);
          }else if(arr[k].timestamp===arr[k+1].timestamp){
            arr[k].content2=arr[k+1].content;
            narr.push(arr[k]);
            k++;
            if (this.trueTwoList<1){
              this.trueTwoList++;
            }
          }
        }
        // console.log(narr);
        return arr=narr;
      },
      deallrc(thislrc,whatfix){
        let time=thislrc.timestamp;
        //------------
        // time=time.toFixed(2);
        // let timeArr=time.split(".");
        // time=timeArr[0]+timeArr[1];
        // time=parseFloat(time).toFixed(2).toString();
        time=parseFloat(time).toString();
        // console.log(time);
        // if (time===0){
        //     time=0;
        // }else{
        //   time=time-1;
        // }
        // console.log("各个标签内的时间：=="+time);
        //------------
        if (whatfix==="timestamp"){
          return time;
        }else{
          console.log("err");
        }
      },
      //lyric--end
      //Lyric歌词的滚动
      getalldata(){
        // currentTime() ：以秒为单位返回从开始播放到目前所花的时间，也可设置 currentTime 的值来跳转到特定位置；
        //duration：获取媒体文件的播放时长，以秒为单位，如果无法获取，则为 NaN；
        //歌曲进度：首先先设置一个定时器，分别获取这两个值，用当前播放的秒数除以歌曲总秒数，再乘以歌曲进度条的总宽度（px），就能算出歌曲进度条一秒钟可以走多少,歌曲进度调节：点击进度条的某个位置，歌曲跳转到响应位置，这个功能的实现是先获取到点击的位置距离进度条最左边的长度（让 Firefox 支持 offsetX、offsetY），接着获得这段距离在整个进度条的长度里所占的百分比，用这个百分比乘以歌曲的总长度，就能算出该给 currentTime 设置的值。
        // console.log(this.$refs);
        // console.log("paused="+this.$refs.audio.paused);
        // console.log("currentTime="+this.$refs.audio.currentTime);
        // console.log("duration="+this.$refs.audio.duration);
        // console.log("ended="+this.$refs.audio.ended);
        // console.log("autoplay="+this.$refs.audio.autoplay);
        // console.log("controls="+this.$refs.audio.controls);
        // console.log("loop="+this.$refs.audio.loop);
        // console.log($('#barAllwidth').width());
        // console.log(this.thisidx);
        // console.log("currentTimes="+this.currentTimes);
        // console.log("Math.floor(this.currentTimes)="+Math.floor(this.currentTimes));
        // console.log("duration="+this.$refs.audio.duration);
        // console.log("this.MathFloor_durations="+this.MathFloor_durations);
        // console.log("this.durations="+this.durations);
        // console.log(this.$data);
        // console.log(this.timeAddZero(0));
        // this.$refs.audio.pause();
        // console.log($('#audiomusic'));
        this.pause();
      },
      baractive(){
        this.currentTimee();
        let currentTimeswidth=this.currentTimes;
        let durationswidth=this.durations;
        let endwidth=(currentTimeswidth/durationswidth)*this.barAllwidth;
        let IJ_endleft=this.icon_jindutiao_left+endwidth;
        /*console.log的测试
          // console.log("233333");
          // console.log("currentTimeswidth=="+currentTimeswidth);
          // console.log("endwidth=="+endwidth);
          // console.log("durationswidth=="+durationswidth);
          //-----------------------------
        */
        // console.log("currentTimeswidth==="+currentTimeswidth);
        if (!isNaN(endwidth)){
          $('.playerbar_active').css("width",endwidth);
          $('.icon-jindutiao').css("left",IJ_endleft);
        }
      },
      baractIntervals(){
        const thisIN=setInterval(this.baractive,1000);
        this.baractInterval.push(thisIN);
      },
      rebaractInterval(){
        for (let i = 0; i < this.baractInterval.length; i++) {
          clearInterval(this.baractInterval[i]);
        }
        this.baractInterval=[];
        // console.log(this.baractInterval);
      },
      chattime(){
          //this.currentTimes==35  $(thisindextime[i]).attr("time")
          // let timerArr=this.currentTimes.split(".");
          // let curtimers=timerArr[0]+timerArr[1];
          this.currentTimee();
          let curtimers=this.currentTimes;
          curtimers=parseFloat(curtimers);
          curtimers=Number(curtimers)+0.3;

          for (let i = 0; i < this.lyricsClasslength; i++) {
            let firsttime=$('.lyricsClass:eq('+i+')').attr("time");
            let ai=(i+1);
            let nexttime=$('.lyricsClass:eq('+ai+')').attr("time");
            firsttime=Number(firsttime);
            nexttime=Number(nexttime);
            // console.log(curtimers+"|||"+firsttime+"|"+nexttime);
            //数字在if判断不能为string类型，只能为Number类型(艹)
            if ((curtimers>firsttime) && (curtimers<nexttime)){
              this.thisidx=$('.lyricsClass:eq('+i+')').attr("idx");
              this.ultotop();
              // this.beforeindex=this.thisidx;
              // console.log(i);
              // console.log(curtimers+"|||"+firsttime+"|"+nexttime);
              // console.log(typeof curtimers);
              // console.log(firsttime);
              // console.log(this.thisidx);
              return;
            }else if(curtimers>=this.lyricLastTime){
              // console.log(this.lyricLastTime);
              this.thisidx=this.lyricsClasslength-1+"";
              this.ultotop();
              // this.beforeindex=this.thisidx;
              return;
            }
          }
      },
      ultotop(){
        let changetop=this.needtotop*this.thisidx;
        this.ultops=this.ultopbefore-changetop;
        // console.log("this.ultops="+this.ultops);
        // console.log("this.ultopbefore="+this.ultopbefore);
        // console.log("this.needtotop="+this.needtotop+"|||"+"beforeindex="+beforeindex+"|||"+"this.thisidx="+this.thisidx);
        // console.log($('#lyrics_ul').css("top"));
        // console.log($('.lyricsClass').css("height"));
      },
      //Lyric歌词的滚动--end
      //时间进度
      timeAddZero(timenum){
            return timenum<10?("0"+timenum):timenum;
      },
      changecurrentTime(nums){
        this.$refs.audio.currentTime=nums;
        this.currentTimee();
      },
      //时间进度--end
      //播放和列表的显示和隐藏
      getplaystaus(){
        if(this.$store.state.Allmusiccontext.length===0) return;
        if (this.$store.state.clicktag === 1) return false;
        if (this.$refs.audio.paused===true){
          //表示当前状态为暂停，需要开始
          this.play();
        }else {  //表示当前状态为开始，需要暂停
          this.pause();
        }
      },
      getshowliststaus(){
        let bool=!this.$store.state.musiclistbool;
        this.$store.dispatch('changeshowmusiclist',bool);
      },
      //播放和列表的显示和隐藏-end
      //下载
      dowmloadMP3(){

      },
      //下载-end
      //下一首和上一首
      nextmusic(){  //下一首
        // this.Allmusiccount
        if(this.$store.state.Allmusiccontext.length===0) return;
        // console.log(this.Allmusiccount);
        if (this.$store.state.clicktag === 1) return false;
        if (this.playtypeindex===2){
          this.radomthislistid();
        }else{
          this.thislistId=(this.thislistId+1)%this.Allmusiccount;
        }
        // console.log(this.thislistId);
      },
      beforemusic(){  //上一首
        if(this.$store.state.Allmusiccontext.length===0) return;
        if (this.$store.state.clicktag === 1) return false;
        // this.Allmusiccount
        if ((this.thislistId-1)===-1){
          this.thislistId=this.Allmusiccount;
        }
        this.thislistId=(this.thislistId-1)%this.Allmusiccount;
        // console.log(this.thislistId);
      },
      //下一首和上一首-end
      //歌曲播放类型切换(单曲循环、循环、随机)
      changeplaytype(){
        if (this.$store.state.clicktag === 1) return false;
        this.playtypeindex=(this.playtypeindex+1)%3;
        this.$refs.audio.loop=this.playtypeindex === 0||this.Allmusiccount===1;
      },
      //歌曲播放类型切换(单曲循环、循环、随机)-end
      //////////////////其他audio的方法
      play(){  //开始播放
        this.$refs.audio.play();
        this.baractIntervals();
        this.playstaus=false;
      },
      pause(){  //暂停播放
        this.$refs.audio.pause();
        this.rebaractInterval();
        this.playstaus=true;
      },
      currentTimee(){
        this.currentTimes=this.$refs.audio.currentTime.toFixed(2);
      },
      duration(){
        this.durations=this.$refs.audio.duration.toFixed(2);
        this.MathFloor_durations=Math.floor(this.durations);
      },
      ended(){
        this.endeds=this.$refs.audio.ended;
      },
      //|ू･ω･` )重要|ू･ω･` )重要|ू･ω･` )重要|ू･ω･` )重要
      //this.thislistId更换后,经过向子组件musiclist传id变化传回来的数据,初始化数据和歌词
      // 正常的点击子组件list相对应的歌曲变换 (子组件musiclist -> getchild_musicname(data))
      // 下一首和上一首 (this.thislistId -> 子组件musiclist -> getchild_musicname(data))
      getchild_musicname(data){
        this.musicsrcname=data[0];
        this.thislistId=data[1];
        // console.log("--------");
        // console.log(this.thislistId);
        // console.log(this.musicsrcname);
        this.getchangeInitialize();
        this.lrcaxios(this.musicsrcname);
        this.$emit('emitmusicname',this.musicsrcname);

        // console.log(data);
        // console.log("emiter="+this.musicsrcname);
      },
      getchangethislistId(index){
        this.thislistId=index;
      },
      //|ू･ω･` )重要|ू･ω･` )重要|ू･ω･` )重要|ू･ω･` )重要-end
      radomthislistid(){
        let beforethislistId=this.thislistId;
        this.thislistId=Math.floor(Math.random()*this.Allmusiccount);
        if (beforethislistId===this.thislistId) this.nextmusic();
      }
    },
    watch:{
      '$store.state.timingStatus'(val){
        if (val===false){  //定时时间到了,停止音乐
          // console.log("player中监听到Vuex的showdis数据==="+val);
          this.pause();
        }
      },
      '$store.state.Allmusiccontext'(Arr){
        // console.log(Arr.length);
        this.Allmusiccount=Arr.length;
        if (Arr.length===0){
          // console.log(this.$refs);
          this.$refs.audio.load();
          this.playstaus=true;
          this.thisAlllrc="";
          this.$emit('emitmusicname',"");
        }
      }
    },
    computed:{
      jindutiaomaxWL(){
        //没有"px"
        // console.log(this.barAllwidth +this.icon_jindutiao_left);
        return this.barAllwidth +this.icon_jindutiao_left;
      },
      showTime:function(){
        //currentTime左边时间
        this.CF=this.timeAddZero(Math.floor(Math.floor(this.currentTimes)/60));
        this.CS=this.timeAddZero(Math.floor(this.currentTimes)%60);
        //duration右边时间
        this.DF=this.timeAddZero(Math.floor(this.MathFloor_durations/60));
        this.DS=this.timeAddZero(this.MathFloor_durations-(this.DF*60));

        // this.timeAddZero(this.MathFloor_durations-(this.DF*60))

        return this.CF+':'+this.CS+'/'+this.DF+':'+this.DS;
      },
      //歌曲地址变化
      changemusicsrc:function(){
        // this.$store.state.thismusicsrcname
        // '../../../static/MP3/ミスターフィクサー - Sou.mp3'
        // this.musicsrcname=this.$store.state.thismusicsrcname;
        // console.log(this.musicsrcname);
        this.rebaractInterval();
        return '../../../static/MP3/'+this.musicsrcname+'.mp3';
      },
      //
    },
    created() {
      this.url=this.HOST;
      this.lrcaxios();
      // this.baractInterval();
      //----------
      // this.currentTime();
      // this.duration();

    },
    mounted(){
      const _this=this;
      $(function (){
        //初始化数据
        _this.ultopbefore=parseInt($('#lyrics_ul').css("top"));
        _this.icon_jindutiao_left=parseInt( $('.icon-jindutiao').css('left'));
        //防止重复点击
        // iconfont
        const classiconall=$('.iconfont');
        // console.log(classiconall);

        _this.preventClick(classiconall);

        // for (var i = 0; i < classiconall.length; i++) {
        //   _this.preventClick(classiconall[i]);
        // }




        //防止重复点击--end

        //初始化数据-end
        /////////////////////////点击进度条运动
        // let baractInterval=setInterval(baractive,1000);
        // function baractive(){
        //     _this.currentTimee();
        //     let currentTimeswidth=_this.currentTimes;
        //     let durationswidth=_this.durations;
        //     let endwidth=(currentTimeswidth/durationswidth)*_this.barAllwidth;
        //     // console.log(_this.barAllwidth);
        //     console.log(endwidth);
        //
        //     $('.playerbar_active').css("width",endwidth);
        // }
        ///////////////////////点击
        $('.playerbar').bind("click",function (e){
          // console.log(e);
          // console.log(e.pageX);
          // console.log("Click_but_Left=="+$(this).offset().left);
          if(_this.$store.state.Allmusiccontext.length===0) return;
          let ckleft=(e.pageX-$(this).offset().left);
          ckleft=(ckleft/_this.barAllwidth)*_this.durations;
          _this.changecurrentTime(ckleft);
          _this.baractive();
          _this.chattime();
          // console.log(tt+"||"+"g");
        });
        ///////////////////////拖拽
        //手机端的触摸事件
        /*
          //div视野拖拽
          function moveDivs(_id) {
              let _block = document.getElementById(_id);
              let _init_left, _init_top, _div_top, _div_left, _box_width, _box_heiht;
              let _win_height = $(window).height();
              let _win_width = $(window).width();

              _block.addEventListener('touchstart', function(e) {
                  _init_left = parseInt(e.touches[0].clientX);
                  _init_top = parseInt(e.touches[0].clientY);
                  _div_top = $("#" + _id).offset().top - $(window).scrollTop();
                  _div_left = $("#" + _id).offset().left;
                  _box_width = $("#" + _id).width();
                  _box_heiht = $("#" + _id).height();
              });

              _block.addEventListener('touchmove', function(e) {
                  e.preventDefault();
                  let _left = parseInt(e.touches[0].clientX);
                  let _top = parseInt(e.touches[0].clientY);

                  let _need_left = _div_left + (_left - _init_left);
                  let _need_top = _div_top + (_top - _init_top);

                  //检测_block是否还存在可视区域
                  let _max_left = _win_width - _box_width;
                  let _max_top = _win_height - _box_heiht;

                  if (_need_left < 0) _need_left = 0;
                  if (_need_left > _max_left) _need_left = _max_left;
                  if (_need_top < 0) _need_top = 0;
                  if (_need_top > _max_top) _need_top = _max_top;
                  $('#' + _id).css({
                      'top': _need_top + 'px',
                      'left': _need_left + 'px',
                  })
              });

              _block.addEventListener('touchend', function(e) {

              });
          }
          moveDivs("test"); //传入容器ID就可以
        * */
        //----------------------------------
        // _this.barAllwidth
        // _this.icon_jindutiao_left

        //判断是否为手机
        function isMobile() {
          let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
          return flag;
        }
        //判断使用那种事件
        let touchStart,touchMove,touchEnd;
        touchStart = isMobile() ? 'touchstart' : 'mousedown';
        touchMove = isMobile() ? 'touchmove' : 'mousemove';
        touchEnd = isMobile() ? 'touchend' : 'mouseup';
        //三种事件的相应处理
        function moveDivs(_id) {
          let _block = document.getElementById(_id);
          let _init_left, _div_left;

          //touStart
          function touStart(ev){
            //判断是否为手机还是电脑端
            ev=ev || window.event; //要判断使用哪种event
            let touch;
            if(isMobile()){     //如果是手机
              touch=ev.touches[0].clientX;
            }else{
              touch=ev.clientX;   //如果不是手机
            }
            _init_left = parseInt(touch);
            let $_id= $("#" + _id);
            _div_left = parseInt($_id.css('left'));
          }
          //touchMove
          function touMove(ev) {
            ev.preventDefault();
            //判断是否为手机还是电脑端
            ev=ev || window.event; //要判断使用哪种event
            let touch;
            if(isMobile()){     //如果是手机
              touch=ev.touches[0].clientX;
            }else{
              touch=ev.clientX;   //如果不是手机
            }
            if(_this.$store.state.Allmusiccontext.length===0) return;
            // let _left = parseInt(touch);

            let _need_left = _div_left + (parseInt(touch) - _init_left);

            //检测_block是否还存在可视区域
            let _max_left = _this.jindutiaomaxWL;
            if (_need_left < _this.icon_jindutiao_left) _need_left = _this.icon_jindutiao_left;
            if (_need_left > _max_left) _need_left = _max_left;
            $('#' + _id).css({
              'left': _need_left + 'px',
            });
            //拖动更改left样式的改变
            // console.log($("#" + _id).offset().left);
            // console.log(_this.icon_jindutiao_left);
            // console.log(_this.barAllwidth);
            // console.log(_this.durations);
            let changecurrenttime=((parseInt($("#" + _id).css('left'))-_this.icon_jindutiao_left)/_this.barAllwidth)*_this.durations;
            _this.changecurrentTime(changecurrenttime);
            _this.baractive();
          }
          //touchEnd
          function touEnd(ev) {
            //判断是否为手机还是电脑端
            ev=ev || window.event; //要判断使用哪种event
          }
          if (isMobile()){
            _block.addEventListener(touchStart,touStart);
            _block.addEventListener(touchMove,touMove);
            _block.addEventListener(touchEnd,touEnd);
          }else{
            _block.onmousedown=function (ev){
              //判断是否为手机还是电脑端
              ev=ev || window.event; //要判断使用哪种event
              _init_left = parseInt(ev.clientX);
              let $_id= $("#" + _id);
              _div_left = parseInt($_id.css('left'));
              _block.onmousemove=touMove;
              _block.onmouseleave=function (){
                _block.onmousemove=null;
                _block.onmouseup=null;
              };
              _block.onmouseup=function (){
                _block.onmousemove=null;
                _block.onmouseup=null;
              }
            }
          }
        }
        moveDivs("jindutiao");

        //----------------------------------
        //touchmove(移动),touchstart(按下),touchend(离开)
        // $(document).bind("touchstart",function (){
        //   console.log("touchstart2222");
        // });
        // $(document).bind("touchmove",function (){
        //   console.log("touchmove2222");
        // });
        // $(document).bind("touchend",function (){
        //   console.log("touchend2222");
        // });
        ////////////////////////

        // $('#audiomusic').get(0).addEventListener("timeupdate",function (){
        //   _this.chattime();
        // });
        // console.log($('#audiomusic'));
        // $('#audiomusic').on("timeupdate",function (){
        //   _this.chattime();
        // });



        //////
        // let thisindextime;
        // $('.lyricsClass').ready(function (){
        //   thisindextime=$('.lyricsClass');
        //   // console.log(thisindextime);
        //   // let ly_thistime; //当前chang的标签时间
        //   // let ly_nexttime; //下一个标签时间
        //
        //   // let ly_this=ly_thistime; //当前chang的标签时间
        //   // let ly_next=ly_nexttime; //下一个标签时间
        //
        //
        //   ///////////////////////歌词Lyric滚动
        //   //当前播放时间与前后歌词时间比较，如果位于这两者之间则转到该歌词

        //   $('#audiomusic').get(0).addEventListener("timeupdate",function (){
        //     let timers=this.currentTime.toFixed(2);
        //     let timerArr=timers.split(".");
        //     timers=timerArr[0]+timerArr[1];
        //     timers=parseInt(timers-1).toString();                           //当前播放时间
        //     console.log(timers);
        //     // console.log(this.currentTime);
        //     // console.log(ly_this);
        //     // console.log(ly_next);
        //
        //     let index=0;
        //     let ly_thistime=$(thisindextime[index]).attr("time"); //当前chang的标签时间
        //     let ly_nexttime=$(thisindextime[index+1]).attr("time"); //下一个标签时间
        //
        //     // let ly_this=$(thisindextime[index]).attr("time"); //当前chang的标签时间
        //     // let ly_next=$(thisindextime[index+1]).attr("time"); //下一个标签时间
        //     console.log(timers+"||||"+ly_thistime+"||"+ly_nexttime);
        //     if (timers>ly_thistime&&timers<ly_nexttime){
        //       console.log("77");
        //       $(thisindextime[index]).addClass("active");
        //
        //     }else{
        //       $(thisindextime[index]).removeClass("active");
        //       index++;
        //       $(thisindextime[index]).addClass("active");
        //
        //       ly_thistime=$(thisindextime[index]).attr("time"); //当前chang的标签时间
        //       ly_nexttime=$(thisindextime[index+1]).attr("time"); //下一个标签时间
        //
        //     }
        //
        //   });
        //
        // });

        ///////////////////////完成歌曲后和歌曲执行的各种变化
        $('#audiomusic')
          .bind("ended",function (){
          console.log("歌曲播放完全!!!");
          //单曲循环-0、列表循环-1、随机-2
          //单曲循环---loop=true
          //列表循环---nextmusic()
          //随机---_this.thislistId
          switch (_this.playtypeindex) {
            case 1:
              _this.nextmusic();
              break;
            case 2:
              _this.radomthislistid();
              break;
            default:
              _this.$refs.audio.loop=true;
              break;
          }
          $("#jindutiao").css("left",_this.jindutiaomaxWL);
          // console.log(_this.jindutiaomaxWL);
          // console.log($("#jindutiao").offset().left);
          _this.rebaractInterval();
          _this.playstaus=true;
          })
          .bind("timeupdate",function (){
            if (_this.$refs.audio===undefined) return false;
            // console.log(_this.$refs.audio);
            _this.chattime();
          })
          // .bind("play",function (){  //暂时多余
          //   // _this.baractive();
          //   // _this.play();
          // })
          .bind("pause",function (){
            if (_this.$refs.audio===undefined) return false;
           _this.pause();
          });
        /////////////////////////this.audiooncanplay();

      });//$("function()")--end
    }
  };

  //$("function()")--star
  // $(function (){
  //   $('.ico_pci:eq(2)').click(function (){
  //     togglefn(this,['icon-zanting','icon-kaishi']);
  //   });
  //   $('.ico_pci:eq(4)').click(function (){
  //     togglefn(this,['icon-liebiao1-copy','icon-error']);
  //   });
  //   function togglefn(obj,changeArr){
  //     for (let i = 0; i < changeArr.length; i++) {
  //       $(obj).toggleClass(changeArr[i]);
  //     }
  //   }
  //   /////////////////////////
  // });//$("function()")--end
</script>

<style scoped>
  #player{
    position: relative;
    width:100%;
    box-shadow: 0 0 15px -3px #97eaddf0 inset;
    border-radius: 3px;
    background-color: #254446bd;
    overflow: hidden;
  }
  /*lyric*/
  #lyrics{
    position: relative;
    top: 4%;
    width: 100%;
    height: 84%;
    z-index: 1;
    overflow: hidden;
  }
  #emptyP{
    position: absolute;
    width: 100%;
    height: 3rem;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    font-family: 华文新魏,sans-serif;
    text-align: center;
    font-size: 2rem;
    font-weight: bolder;
    font-style: italic;
    user-select: none;
    color:#89a0a0bf;
  }
  #lyrics_scroll{
    position: relative;
    overflow: hidden;
    /*top: 1%;*/
    width:100%;
    height:100%;
  }
  #lyrics_ul{
    position: absolute;
    transition: .3s;
    top:42%;
    width: 100%;
    height:100%;
  }
  #lyrics_ul li{
    width: 100%;
    height: 12%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 2rem;
    white-space: nowrap;
    text-align: center;
    color: #ffffffc9;
    font-size:0.9rem;
    font-style: italic;
    font-weight: 100;
  }
  #lyrics_ul li span{
    display:block;
  }
  #lyrics_ul .active{
    font-weight: bold;
    color:#f5b0b0d1;
  }
  /*control*/
  #playbcall{
    position: absolute;
    bottom: 0;
    width: 100%;
    height:11%;
  }
  #playbcall_div{
    position: relative;
    width: 100%;
    height:97%;
  }
  /*control*/
  #playcontrol{
    position: absolute;
    display: flex;
    justify-content: space-around;
    top: 36%;
    left: 5%;
    width: 88%;
    height: 50%;
    border-radius: 25px;
  }
  /*bar*/
  #playbar{
    position: relative;
    width: 100%;
    height: 20%;
    left: 0;
    right: 0;
    margin: auto;
  }
  #mctime{
    position: absolute;
    top: 8%;
    left: 3%;
    font-size: 0.1rem;
    font-style: italic;
    color: #ef7070;
  }
  /*width: 70% 变化*/
  .playerbar{
    position: absolute;
    left: 25%;
    top: 50%;
    width: 65%;
    height: 0;
    margin: auto;
    border: 1px solid #91929299;
  }
  .playerbar_active{
    width: 0;
    border: 1px solid #bc1212bd;
    background-color: #b46e6b;
  }
</style>
