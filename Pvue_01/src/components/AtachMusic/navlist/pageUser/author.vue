<!-- Created by MiYuXin on 2020/2/23. -->
<template>
    <div id="author">

      <span>|-- 作者 --|</span>
      <p>王皓玄</p>
      <span>|-- 学校 --|</span>
      <p>广东科技学院</p>
      <span>|-- 学号 --|</span>
      <p>2016130208</p>
      <span>|-- 专业 --|</span>
      <p>计算机系软件工程</p>
      <span>|-- 班级 --|</span>
      <p>12班</p>
      <span>|-- 指导老师 --|</span>
      <p>苏文龙</p>
      <span>|-- 声明 --|</span>
      <p>本作品基于Vue+HTML+CSS3+Node.Js制作</p>
      <p>...侵权必究(呃-_-!!)...</p>
      <span>====================</span>
      <span>|-- 开始制作时间至当前时间 --|</span>
      <p>{{thisDateTime}}</p>


    </div>
</template>

<script>
    export default {
      name: "author",
      data() {
          return {
            d:"",
            h:"",
            m:"",
            s:""
          }
      },
      methods:{
        timelist(x){
          return x < 10?"0" + x:x;
        }
      },
      created() {
        const oldday=new Date(2020,1,7);
        const _this=this;
        let mins;
        setInterval(function (){
          let nowdate= new Date();
          mins = Math.floor((nowdate - oldday)/1000); //总秒
          _this.d=Math.abs(Math.floor(mins/60/60/24)); //天
          _this.h=Math.abs(Math.floor(mins/60/60)%24); //时
          _this.m=Math.abs(Math.floor(mins/60)%60); //分
          _this.s=Math.abs(mins%60); //秒
          _this.d= _this.timelist( _this.d);
          _this.h= _this.timelist(_this.h);
          _this.m= _this.timelist(_this.m);
          _this.s= _this.timelist(_this.s);
        },1000);
      },
      computed:{
        thisDateTime(){
          // console.log(this.d+"天"+this.h+"时"+this.m+"分"+this.s+"秒);
            return this.d+"天"+this.h+"时"+this.m+"分"+this.s+"秒";
        }

      }

    }
</script>

<style scoped>
  #author{
    display: flex;
    height: 30.4rem;
    padding-top: 1%;
    flex-direction: column;
    align-items: center;
    color: #c7c7c7c7;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    line-height: 2em;
    -ms-user-select: none;
  }
  #author p{
    width: 85%;
    color: #a27272ad;
  }
  #author span{
    display: block;
    width: 90%;
    color: #00c6bd73;
    padding-top: 1%;
    line-height: 1.5em;
    text-indent: 0;
    border-top: 1px solid #4c989430;
  }

</style>
