<!-- Created by MiYuXin on 2020/2/24. -->
<template>
  <!-- 定时停止 -->
  <div id="settimeto">
<!--    <button id="vvv" @click="tomove">添加按钮</button>-->
<!--    <button id="kkk" @click="nomove">移除按钮</button>-->
    <div id="settimeto_cont">
      <div id="comeback">
        <div id="moveHeZi" class="moveHeZiAni">
          <!--  @click="abort" -->
          <span class="iconfont icon-draw-back" id="drawBack"/>
          <div id="particles-js"></div>
        </div>
      </div>
      <span id="bartime" @click="cahttime"/>
      <span id="showtime">{{timeer}}</span>
      <span id="activespan" class="tran3"/>
      <svg class="icon settime_jindu tran3" id="settime" aria-hidden="true">
        <use xlink:href="#icon-choose"/>
      </svg>
      <img @click="onkeyframespic" :class="{'keyframespic':thispicactive}" id="showpic" src="../../public/images/dinginging.png" alt="开心"/>
      <p id="showpic_con" class="samewenzi">设置并返回!!</p>
      <p id="weishehzi" class="samewenzi">未设置定时哦!!</p>
    </div>

  </div>
</template>

<script>
  import $ from 'jquery';
  import 'particles.js'
  import 'jquery.transit';

  export default  {
    name: "settimeto",
    data() {
      return {
        thisH:"00",
        thisM:"00",
        thispicactive:false,
        maxleft:"",

        //开始倒计时
        sj:0,
        timestopInter:[],
        //动画是否再次加载
        DHcount:0,

        kk:0
      }
    },
    props:{

    },
    beforeDestroy() {
      console.log('销毁前+++++++');

    },
    destroyed() {
      console.log('销毁后+++++++');
      this.remtimestopIntervals();
      this.timestopInter=[];
      this.$store.dispatch('changesetstoptime',{thisH:"00",thisM:"00"});
    },
    methods:{
      //测试
      tomove(){
        // var cont_width=$('#settimeto_cont').width();//下面长条的长
        // var spanwidth=$('.settime_jindu').width();//进度条的长
        // var maxleft=cont_width-spanwidth; //最大left
        // var onemove=Math.round(maxleft/12);
        // this.kk=onemove+this.kk;
        // $('#settime').css('left',this.kk);
        // var kk=$('.settime_jindu').offset().left;
        //lllppp
        // $('#weishehzi').removeClass('lllppp');
        // console.log(this.thisH);
        // console.log(this.thisM);
        //.drawbackAni
        // $('#drawBack').addClass('drawbackAni');
        $('#moveHeZi').css({ 'left': '1px' });

      },
      nomove(){
        //$('#weishehzi').addClass('lllppp');
        $('#drawBack').removeClass('drawbackAni');
      },
      //整个进度条变化的函数
      changeBarAll(NeedLeft){
        //检测_block是否还存在可视区域
        if (NeedLeft > this.maxleft) NeedLeft = this.maxleft;
        if (NeedLeft < 0) NeedLeft = 0;
        $('#settime').css({ 'left': NeedLeft + 'px'});
        // //拖动更改其他样式的改变
        $('#activespan').width(NeedLeft);
        this.sj=Math.floor(720*NeedLeft/this.maxleft);
        this.thisH=this.fillZero(Math.floor(this.sj/60));
        this.thisM= this.fillZero(this.sj%60);
        // console.log(sj);
        // console.log("HHHHH=="+this.thisH);
        // console.log("~~~~=="+this.thisM);
      },

      //循环定时
      timestopIntervals(){
        const _this=this;
        this.remtimestopIntervals();
        let mmss=1;
        this.$store.state.timingStatus=true;
        //倒计时开始
        let timestopInterval=setInterval(function (){
          console.log(mmss);
          mmss++;
          if (mmss>60){
            _this.sj--;
            _this.thisH=_this.fillZero(Math.floor(_this.sj/60));
            _this.thisM=_this.fillZero(_this.sj%60);
            _this.$store.dispatch('changesetstoptime',{thisH:_this.thisH,thisM:_this.thisM});
            if (_this.sj===0) {  //定时时间到了
              _this.remtimestopIntervals();
              _this.$store.state.timingStatus=false;
            }
            mmss=1;
          }
        },1000);
        //倒计时开始--end
        setTimeout(function (){
          _this.timestopInter.push(timestopInterval);
        },500);
      },
      remtimestopIntervals(){
        if (this.timestopInter!==undefined){
          console.log("清除定时器成功!!");
          for (let i = 0; i < this.timestopInter.length; i++) {
            clearInterval(this.timestopInter[i]);
          }
          this.timestopInter=[];
        }
      },
      //循环定时--end

      //进度条点击更换时间
      cahttime(ev){
        let ckleft=ev.pageX-this.$store.state.STJindutiao;
        this.changeBarAll(ckleft);
      },
      //图片点击动作
      onkeyframespic(){
        // console.log(this.thispicactive);
        const _this=this;
        let settime=1000;
        this.thispicactive=!this.thispicactive;
        if (this.thisH==="00"&&this.thisM==="00"){
          $('#weishehzi').addClass('lllppp');
          settime=1500;
        }
        setTimeout(function (){
          _this.thispicactive=!_this.thispicactive;
          if (_this.thisH!=="00"||_this.thisM!=="00") _this.timestopIntervals();
          $('#weishehzi').removeClass('lllppp');
          //changesetstoptime
          _this.$store.dispatch('changesetstoptime',{thisH:_this.thisH,thisM:_this.thisM});
          _this.$store.commit('showdisplaytime');
        },settime);
      },
      //补零
      fillZero(x){
        if(x<10){
          return x="0"+x;
        }else{
          return ""+x;
        }
      },
      //点击退出
      abort(){
        this.$store.commit('showdisplaytime');
      }

    },
    watch:{
      '$store.state.showdis'(data){
        // console.log("dayyyy=="+data);
        if (data===true) { //表示打开
          this.remtimestopIntervals();

          if (this.DHcount===0){
            particlesJS('particles-js', {
              "particles": {
                "number": {
                  "value": 160,//数量
                  "density": {
                    "enable": true, //启用粒子的稀密程度
                    "value_area": 50 //区域散布密度大小
                  }
                },
                "color": {
                  "value": "#ff4957" //原子的颜色
                },
                "shape": {
                  "type": "edge", //原子的形状 "circle" ,"edge" ,"triangle" ,"polygon" ,"star" ,"image" ,["circle", "triangle", "image"]
                  "stroke": {
                    "width": 0, //原子的宽度
                    "color": "#000000" //原子颜色
                  },
                  "polygon": {
                    "nb_sides": 5 // 原子的多边形边数
                  },
                  "image": {
                    "src": "img/github.svg", // 原子的图片可以使用自定义图片 "assets/img/yop.svg" , "http://mywebsite.com/assets/img/yop.png"
                    "width": 100, //图片宽度
                    "height": 100 //图片高度
                  }
                },
                "opacity": {
                  "value": 1, //不透明度
                  "random": true, //随机不透明度
                  "anim": {
                    "enable": true, //渐变动画
                    "speed": 3, // 渐变动画速度
                    "opacity_min": 0.3, //渐变动画不透明度
                    "sync": true
                  }
                },
                "size": {
                  "value": 3, //原子大小
                  "random": true, // 原子大小随机
                  "anim": {
                    "enable": false, // 原子渐变
                    "speed": 4, //原子渐变速度
                    "size_min": 0.3,
                    "sync": false
                  }
                },
                "line_linked": {
                  "enable": false, //连接线
                  "distance": 150, //连接线距离
                  "color": "#ffffff", //连接线颜色
                  "opacity": 0.4, //连接线不透明度
                  "width": 1 //连接线的宽度
                },
                "move": {
                  "enable": true, //原子移动
                  "speed": 8, //原子移动速度
                  "direction": "right", //原子移动方向   "none" ,"top" ,"top-right" ,"right" ,"bottom-right" ,"bottom" ,"bottom-left" ,"left" ,"top-left"
                  "random": true, //移动随机方向
                  "straight": false, //直接移动
                  "out_mode": "out", //是否移动出画布
                  "bounce": false, //是否跳动移动
                  "attract": {
                    "enable": false, // 原子之间吸引
                    "rotateX": 600, //原子之间吸引X水平距离
                    "rotateY": 600  //原子之间吸引Y水平距离
                  }
                }
              },
              "interactivity": {
                "detect_on": "canvas", //原子之间互动检测 "canvas", "window"
                "events": {
                  "onhover": {
                    "enable": false, //悬停
                    "mode": "bubble" //悬停模式      "grab"抓取临近的,"bubble"泡沫球效果,"repulse"击退效果,["grab", "bubble"]
                  },
                  "onclick": {
                    "enable": false,  //点击效果
                    "mode": "repulse"  //点击效果模式   "push" ,"remove" ,"bubble" ,"repulse" ,["push", "repulse"]
                  },
                  "resize": false // 互动事件调整
                },
                "modes": {
                  "grab": {
                    "distance": 100, //原子互动抓取距离
                    "line_linked": {
                      "opacity": 0.8  //原子互动抓取距离连线不透明度
                    }
                  },
                  "bubble": {
                    "distance": 250, //原子抓取泡沫效果之间的距离
                    "size": 4, // 原子抓取泡沫效果之间的大小
                    "duration": 2, //原子抓取泡沫效果之间的持续事件
                    "opacity": 1, //原子抓取泡沫效果透明度
                    "speed": 3
                  },
                  "repulse": {
                    "distance": 400, //击退效果距离
                    "duration": 0.4 //击退效果持续事件
                  },
                  "push": {
                    "particles_nb": 4 //粒子推出的数量
                  },
                  "remove": {
                    "particles_nb": 2
                  }
                }
              },
              "retina_detect": true
            });
            // console.log($('#particles-js').width());
            this.DHcount++;
          }
        }

      }

    },
    computed:{
      timeer:function (){
        return this.thisH+'时'+this.thisM+'分';
      }
    },
    created() {

    },
    mounted() {
      const _this=this;
      $(function (){
        const thisspan=$('.settime_jindu');
        // _this.$store.state.STJindutiao//初始进度条left,非0
        const cont_width=$('#settimeto_cont').width();//下面长条的长
        const spanwidth=thisspan.width();//进度条的长
        _this.maxleft=cont_width-spanwidth; //最大left
        //总共12个小时
        //-------------------
        //判断是否为手机
        function isMobile() {
          return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
        }
        //判断使用那种事件
        let touchStart,touchMove,touchEnd;
        touchStart = isMobile() ? 'touchstart' : 'mousedown';
        touchMove = isMobile() ? 'touchmove' : 'mousemove';
        touchEnd = isMobile() ? 'touchend' : 'mouseup';
        //三种事件的相应处理
        //函数开始
        function moveDivs(_id) {
          let _block = document.getElementById(_id);
          let _init_left, _div_left, _need_left, MAXLeft;
          let $_id = $("#" + _id);
          const actspan=$('#activespan');
          //touStart
          function touStart(ev) {
            //判断是否为手机还是电脑端
            ev = ev || window.event; //要判断使用哪种event
            let touch;
            if (isMobile()) {     //如果是手机
              touch = ev.touches[0].clientX;
            } else {
              touch = ev.clientX;   //如果不是手机
            }
            //tran3
            $_id.removeClass('tran3');
            actspan.removeClass('tran3');
            if (_id === "moveHeZi") $_id.removeClass('moveHeZiAni');
            _init_left = parseInt(touch);
            _div_left = $_id.offset().left - _this.$store.state.STJindutiao;
            // console.log(_div_left);
          }
          //touchMove
          function touMove(ev) {
            ev.preventDefault();
            //判断是否为手机还是电脑端
            ev = ev || window.event; //要判断使用哪种event
            let touch;
            if (isMobile()) {     //如果是手机
              touch = ev.touches[0].clientX;
            } else {
              touch = ev.clientX;   //如果不是手机
            }
            ev.preventDefault();
            _need_left = _div_left + (parseInt(touch) - _init_left);
            ///////////////////
            if (_id === "settime") {
              MAXLeft = _this.maxleft;
              _this.changeBarAll(_need_left);
            } else if (_id === "moveHeZi") {
              MAXLeft = _this.$store.state.comebackdrawBackMAX;
              if (_need_left > MAXLeft) _need_left = MAXLeft;
              if (_need_left < 0) {
                _need_left = 0;
                $('#comeback').css('borderLeft', '3px solid #e22e2ed1');
              } else {
                $('#comeback').css('borderLeft', '3px solid #895a5ad1');
                $('#drawBack').css('color', '#a74a4abf');
              }
              $_id.css({'left': _need_left + 'px'});
            }
          }
          //touchEnd
          function touEnd(ev) {
            //判断是否为手机还是电脑端
            ev = ev || window.event; //要判断使用哪种event
            // console.log("6666");
            $_id.addClass('tran3');
            actspan.addClass('tran3');
            if (_id === "moveHeZi") {
              if (_need_left !== 0) {
                $_id.transition({'left': _this.$store.state.comebackdrawBackMAX}, function () {
                  $_id.addClass('moveHeZiAni');
                });
                $('#drawBack').css('color', '#a58779bf');
              } else {
                _this.$store.commit('showdisplaytime');
                setTimeout(function () {
                  $_id.css({'left': ""});
                  $('#comeback').css('borderLeft', '3px solid #895a5ad1');
                  $('#drawBack').css('color', '#a58779bf');
                }, 1000);
              }
            }//--
          }
          if (isMobile()) {
            _block.addEventListener(touchStart, touStart);
            _block.addEventListener(touchMove, touMove);
            _block.addEventListener(touchEnd, touEnd);
          } else {
            _block.onmousedown = function (ev) {
              //判断是否为手机还是电脑端
              ev = ev || window.event; //要判断使用哪种event
              let touch;
              if (isMobile()) {     //如果是手机
                touch = ev.touches[0].clientX;
              } else {
                touch = ev.clientX;   //如果不是手机
              }
              //tran3
              $_id.removeClass('tran3');
              actspan.removeClass('tran3');
              if (_id === "moveHeZi") $_id.removeClass('moveHeZiAni');
              _init_left = parseInt(touch);
              _div_left = $_id.offset().left - _this.$store.state.STJindutiao;
              // console.log(_div_left);
              _block.onmousemove = touMove;
              _block.onmouseleave = function () {
                touEnd();
                _block.onmousemove = null;
              };
              _block.onmouseup = function () {
                touEnd();
                _block.onmousemove = null;
              }
            }
          }
        }//--函数结束
        //-------------------
        moveDivs("settime"); //传入容器ID就可以
        moveDivs("moveHeZi"); //传入容器ID就可以

      });//--$(function)--end

      // particlesJS('particles-js', {
      //       "particles": {
      //         "number": {
      //           "value": 160,//数量
      //           "density": {
      //             "enable": true, //启用粒子的稀密程度
      //             "value_area": 50 //区域散布密度大小
      //           }
      //         },
      //         "color": {
      //           "value": "#ff4957" //原子的颜色
      //         },
      //         "shape": {
      //           "type": "edge", //原子的形状 "circle" ,"edge" ,"triangle" ,"polygon" ,"star" ,"image" ,["circle", "triangle", "image"]
      //           "stroke": {
      //             "width": 0, //原子的宽度
      //             "color": "#000000" //原子颜色
      //           },
      //           "polygon": {
      //             "nb_sides": 5 // 原子的多边形边数
      //           },
      //           "image": {
      //             "src": "img/github.svg", // 原子的图片可以使用自定义图片 "assets/img/yop.svg" , "http://mywebsite.com/assets/img/yop.png"
      //             "width": 100, //图片宽度
      //             "height": 100 //图片高度
      //           }
      //         },
      //         "opacity": {
      //           "value": 1, //不透明度
      //           "random": true, //随机不透明度
      //           "anim": {
      //             "enable": true, //渐变动画
      //             "speed": 3, // 渐变动画速度
      //             "opacity_min": 0.3, //渐变动画不透明度
      //             "sync": true
      //           }
      //         },
      //         "size": {
      //           "value": 3, //原子大小
      //           "random": true, // 原子大小随机
      //           "anim": {
      //             "enable": false, // 原子渐变
      //             "speed": 4, //原子渐变速度
      //             "size_min": 0.3,
      //             "sync": false
      //           }
      //         },
      //         "line_linked": {
      //           "enable": false, //连接线
      //           "distance": 150, //连接线距离
      //           "color": "#ffffff", //连接线颜色
      //           "opacity": 0.4, //连接线不透明度
      //           "width": 1 //连接线的宽度
      //         },
      //         "move": {
      //           "enable": true, //原子移动
      //           "speed": 8, //原子移动速度
      //           "direction": "right", //原子移动方向   "none" ,"top" ,"top-right" ,"right" ,"bottom-right" ,"bottom" ,"bottom-left" ,"left" ,"top-left"
      //           "random": true, //移动随机方向
      //           "straight": false, //直接移动
      //           "out_mode": "out", //是否移动出画布
      //           "bounce": false, //是否跳动移动
      //           "attract": {
      //             "enable": false, // 原子之间吸引
      //             "rotateX": 600, //原子之间吸引X水平距离
      //             "rotateY": 600  //原子之间吸引Y水平距离
      //           }
      //         }
      //       },
      //       "interactivity": {
      //         "detect_on": "canvas", //原子之间互动检测 "canvas", "window"
      //         "events": {
      //           "onhover": {
      //             "enable": false, //悬停
      //             "mode": "bubble" //悬停模式      "grab"抓取临近的,"bubble"泡沫球效果,"repulse"击退效果,["grab", "bubble"]
      //           },
      //           "onclick": {
      //             "enable": false,  //点击效果
      //             "mode": "repulse"  //点击效果模式   "push" ,"remove" ,"bubble" ,"repulse" ,["push", "repulse"]
      //           },
      //           "resize": false // 互动事件调整
      //         },
      //         "modes": {
      //           "grab": {
      //             "distance": 100, //原子互动抓取距离
      //             "line_linked": {
      //               "opacity": 0.8  //原子互动抓取距离连线不透明度
      //             }
      //           },
      //           "bubble": {
      //             "distance": 250, //原子抓取泡沫效果之间的距离
      //             "size": 4, // 原子抓取泡沫效果之间的大小
      //             "duration": 2, //原子抓取泡沫效果之间的持续事件
      //             "opacity": 1, //原子抓取泡沫效果透明度
      //             "speed": 3
      //           },
      //           "repulse": {
      //             "distance": 400, //击退效果距离
      //             "duration": 0.4 //击退效果持续事件
      //           },
      //           "push": {
      //             "particles_nb": 4 //粒子推出的数量
      //           },
      //           "remove": {
      //             "particles_nb": 2
      //           }
      //         }
      //       },
      //       "retina_detect": true
      //     });

    }//--mounted

  }


</script>

<style scoped>
  #vvv{
    position:absolute;
    top:30%;
    left:10%;
  }
  #kkk{
    position:absolute;
    top:30%;
    left:30%;
  }


  /*------------------*/
  .lllppp{
    animation: nosettime 1s both;
  }

  @keyframes nosettime {
    0%{transform: rotate(-45deg);opacity: 0}
    30%{transform: rotate(0deg);opacity: 1}
    50%{transform: rotate(-10deg);opacity: 1}
    100%{transform: rotate(0deg);opacity: 1}
  }

  /*------------------*/

  #settimeto{
    position: absolute;
    width:100%;
    height:100%;
    z-index: 10;
    background-color: #171313a6;
  }
  #settimeto_cont,#activespan{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 20rem;
    height: .2rem;
    border-radius: 10px;
  /* border: 1px solid #81ffee;*/
}
  #settimeto_cont{
    right: 0;
    display: flex;
    justify-content: space-between;
    background-color: #a16c6c96;
  }
  #activespan{
    width: 0;
    background-color: #2c9b8d;
  }
  /*------------*/
  #settime{
    position: absolute;
    /*left:0;*/
    z-index: 15;
    top: -0.3rem;
    transform: rotate(160deg);
  }
  .tran3{
    transition: .3s;
  }

  #bartime{
    position: relative;
    z-index: 10;
    width:100%;
    height:100%;
  }


  /*时间showtime*/
  #showtime{
    position: absolute;
    top: 2.5rem;
    left: 0;
    right: 6rem;
    margin: auto;
    height: 4rem;
    text-align: center;
    line-height: 3.5rem;
    font-size: 2.5rem;
    font-style: italic;
    font-weight: bold;
    color: #df7c7cbd;
  }
  /*图片*/
  #showpic{
    display: inline-block;
    position: absolute;
    right: 1rem;
    top: 1rem;
    width: 6em;
    height: 5em;
    font-size: 1rem;
    /*transition: 1s;*/
    opacity: 0.8;
  }
  .keyframespic{
    animation: onpicclick .3s both;
  }
  @keyframes onpicclick {
    0%{transform: rotate(5deg)}
    20%{transform: rotate(-5deg)}
    40%{transform: rotate(5deg)}
    60%{transform: rotate(-5deg)}
    80%{transform: rotate(5deg)}
    100%{transform: rotate(0deg)}
  }
  /*文字*/
  #showpic_con{
    width: 1.4rem;
    right: -3em;
    top: 13em;
    border: 2px solid #d4a1a185;
    word-break: break-word;
    font-size: .2rem;
    color: #d29494b3;
  }
  #showpic_con::after{
    top: 0;
    left: -0.7rem;
    border-right: 10px solid #a78082cc;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  /*weishehzi_2*/
  #weishehzi{
    width: 11rem;
    height: 2rem;
    right: 2em;
    top: 4.5em;
    border: 2px solid #3dacadb3;
    text-align: center;
    line-height: 1.7rem;
    font-size: 1.5rem;
    color: #3dacadb3;
    transform-origin:right top;
    transform: rotate(-45deg);
    opacity: 0;
  }
  #weishehzi::after{
    top: -0.7rem;
    right: 0.2rem;
    border-bottom: 10px solid #39999ab3;
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
  }
  /*文字的相同样式*/
  .samewenzi{
    position: absolute;
    border-radius: 4px;
    padding: 1%;
    font-style: italic;
    font-weight: bolder;
  }
  .samewenzi::after{
    content: '';
    position: absolute;
    width: 0;
    height: 0;
  }
  /*icon回去--必须在这*/
  #moveHeZi{
    position: absolute;
    right: -16rem;
    /*top: -7rem;*/
    width: 100%;
    height: 100%;
    /*border: 1px solid #5a64ff;*/
  }
  #comeback{
    position: absolute;
    top: -6rem;
    width: 100%;
    height: 4rem;
    overflow: hidden;
    border-radius: 8px;
    border-left: 3px solid #895a5ad1;
  }
  .icon-draw-back{
    position: static;
    /* right: 0; */
    /* top: -7rem; */
    width: 4rem;
    height: 4rem;
    float: left;
    font-size: 4rem;
    font-weight: bold;
    line-height: 4.5rem;
    /*border: 1px solid red;*/
    color: #a58779bf;
  }
  #drawBack:active{
    color:#a74a4abf;
  }
  /*drawBack动画*/
  .moveHeZiAni{
    transition: ease-out;
    animation:moveHeZiAnimation .5s alternate infinite;
  }

  @keyframes moveHeZiAnimation {
    0%{transform: translateX(0rem)}
    100%{transform: translateX(-.5rem)}
  }

  /*particles-js*/
  #particles-js{
    width: 78%;
    height: 100%;
    float: left;
    overflow: hidden;
    border-radius: 40px 0 0 40px;
    /*border: 1px solid #1c8680;*/
  }

</style>
