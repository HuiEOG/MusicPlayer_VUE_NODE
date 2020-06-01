<!-- Created by MiYuXin on 2020/2/23. -->
<template>
    <div id="settimeStop">
<!--      <button @click="gettime">时间获取</button>-->
      <h1 id="hh11" @click="showtime">{{this.$store.state.setstopH}}时{{this.$store.state.setstopM}}分</h1>
    </div>
</template>

<script>
  import $ from 'jquery';

    export default {
        name: "settimeStop",
        data() {
            return {
              timers:""
            }
        },
      methods:{
          //测试
        gettime(){
          console.log($("#input2").val());
        },
        //显示时间
        showtime(){
          const _this=this;
          this.$store.state.userlistbool=!this.$store.state.userlistbool;
          this.$store.commit('showdisplaytime');

          if (this.$store.state.STJindutiao===""){
            setTimeout(function (){
              _this.$store.state.STJindutiao=$('.settime_jindu').offset().left;
              _this.$store.state.comebackdrawBackMAX=$("#moveHeZi").offset().left-_this.$store.state.STJindutiao;
              // console.log(moveHeZiL);
              // console.log("*****==="+ _this.$store.state.comebackdrawBackMAX);
            },500);
          }


        }
      },
      watch:{
        timers:function (data){
            console.log(data);
        }
      },
      mounted() {

      }
    }
</script>

<style scoped>
  #settimeStop{
    height:4rem;
    transition: .3s;
    text-align: center;
  }
  #settimeStop:active{
    background: #00000082;
  }
  #hh11{
    width: 100%;
    height: 100%;
    font-size: 2rem;
    font-style: italic;
    line-height: 1.5em;
    margin-top:0;
    color: #9eaba9a3;
  }
</style>
