<!-- Created by MiYuXin on 2020/3/6. -->
<template>
    <div id="manageMent">
      <label>
<!--        <input v-model="ceshi" id="ceshi" type="text" name="dd">-->
      </label>
      <!--左边-->
      <ul class="nav-left-container">
        <li v-for="navs in navigations">
          <!-- li的class为active表示点击选中 -->
          <a href="#">
            <!-- aria-hidden字符串。可选值为true和false,true表示元素隐藏(不可见)，false表示元素可见。 -->
            <span class="glyphicon glyphicon-home f12" aria-hidden="true"/>
            <span>{{navs.name}}</span>
            <span class="glyphicon glyphicon-menu-right f12 fr" aria-hidden="true"/>
          </a>
          <ul class="nav-left-container-small">
            <!-- aria-expanded表示展开状态。默认为undefined, 表示当前展开状态未知。其它可选值：true表示元素是展开的；false表示元素不是展开的。 -->

            <li v-for="(nav_con) in navs.params">
              <router-link class="J_menuItem" tag="a" :to="{path:nav_con.path,query:{topname:navs.name,nextname:nav_con.name}}">{{nav_con.name}}</router-link>
            </li>

          </ul>
        </li>
      </ul>
      <!--左边-end-->
      <!--右边-->
      <div id="right_div">
        <div id="right_header">
          <p class="rh_p">MX_音乐网站后台管理系统</p>
          <p class="rh_p" @click="outman()"><span class="rh_p_user">{{ceshi}}</span><span class="glyphicon glyphicon-chevron-down"/></p>
        </div>
        <ul class="breadcrumb">
          <li><a href="#">{{topname}}</a></li>
          <li><a href="#">{{nextname}}</a></li>
<!--          <li class="active">十一月</li>-->
        </ul>
          <transition name="mantran">
<!--            <keep-alive>-->
                <router-view id="manageview"/>
<!--            </keep-alive>-->
          </transition>
      </div>

      <!--右边-end-->
    </div>
</template>

<script>
  import $ from 'jquery';
  import 'bootstrap';
  import '../public/css/manage/base.css';
  import '../public/css/manage/jquery-kq-nav-left.css';

  export default {
    name: "manageMent",
    data() {
        return {
          ceshi:"poi",
          topname:'主页',
          nextname:'主页',
          navigations:[ //navigations
            {
              name:"主页",
              params:[
                {
                  name:"主页",
                  path:'/manage/M_index'
                },
              ]
            },
            {
              name:"用户管理",
              params:[
                  {
                    name:"用户账户信息",
                    path:'/manage/M_user'
                  },
                  {
                    name:"用户音乐列表信息",
                    path:'/manage/M_userlist'
                  }
                ]
            },
            {
              name:"歌曲管理",
              params:[
                {
                  name:"全部音乐信息",
                  path:'/manage/M_music'
                },
                // {
                //   name:"音乐数据操作",
                //   path:'/manage/M_dealmusic'
                // }
              ]
            }
          ]             //navigations-end
        }
    },
    methods:{
      outman(){
        this.$store.commit('LOGOUT');
        console.log("清除Token成功!!退出成功!!");
        const _this=this;
        setTimeout(function (){
          _this.$router.replace({path:'/mLogReg'});
        },1000);
      }
    },
    mounted() {
        $('.nav-left-container').on('click', 'li', function() {
        $(this).children('.nav-left-container-small').children('li').removeClass('active');
        $(this).find('.glyphicon-menu-right').removeClass('glyphicon-menu-right').addClass('glyphicon-menu-down');
        $(this).addClass('active').children('.nav-left-container-small').slideDown();
        $(this).siblings().removeClass('active').children('.nav-left-container-small').slideUp();
        // console.log($(this).children('.nav-left-container-small').children('li').removeClass('active'));
        $(this).siblings().find('.glyphicon-menu-down').removeClass('glyphicon-menu-down').addClass('glyphicon-menu-right ');
      })
    },
    watch:{
      $route(to,from){
        // console.log("----");
        // console.log(this.$route);
        // console.log(to);
        this.topname=to.query.topname;
        this.nextname=to.query.nextname;
        // console.log(from);
        }
    },
    created() {
      // console.log(this.$store.state.username);
      // console.log(this.$store.state.password);
      // console.log(this.$store.state.tokenn);
    }
  }
</script>

<style scoped>
  /*测试*/
  #ceshi{
    position: absolute;
    top:5%;
    right:20%;
    border:1px solid red;
    z-index: 9999;
  }
  /*测试-end*/
  a{
    text-decoration: none;
  }
  .myactive{
    border-left: 4px solid #19a9d5;
    color: #ffffff;
  }
  #manageMent{
    width: 100%;
    height:100%;
    overflow: hidden;
  }
  #manageMent ::selection {
    color: #e45252d1;
    background: rgba(124, 177, 242, 0.48);
  }
  /*右边内容*/
  #right_div{
    float:left;
    width:89%;
    height: 100%;
    background-color: #F4F7FA;
  }
  /*面包屑*/
  .breadcrumb{
    font-style: italic;
    color:red;
    background: #eceeef;
  }
  /*顶部导航*/
  #right_header{
    position: relative;
    width:100%;
    height:3rem;
    display:flex;
    background-color: rgba(28, 43, 54, 0.94);
    border-left: 4px solid #19a9d5;
    justify-content: space-between;
  }
  .rh_p{
    /*width:20rem;*/
    height:100%;
    text-align: center;
    margin: 0;
    line-height: 2.5rem;
    color: #e5e6e6b0;
    font-weight: bold;
    font-style: italic;
    font-family: cursive;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    font-size: 1.5rem;
    /*border: 1px solid red;*/
  }
  .rh_p:nth-child(1){
    text-indent: 3rem;
  }
  /*右边用户名*/
  .rh_p:nth-child(2){
    padding-right: 5%;
    transition: .3s;
  }
  .rh_p:nth-child(2):hover{
    color: #7dc7debf;
  }
  .rh_p:nth-child(2):active{
    color: rgba(92, 148, 172, 0.75);
  }
  .rh_p_user{
    display: inline-block;
    width:100%;
    height:100%;
  }
  .glyphicon-chevron-down{
    position: absolute;
    display: inline-block;
    width: 2em;
    height: 2em;
    right: 2%;
    line-height: 1rem;
    top: 27%;
    font-size: .6em;
  }
  /*路由*/
  #manageview{
    position: relative;
    display: flex;
    width: 95%;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #fff;
    border: 0 solid #eee;
    border-radius: 0;
    margin-bottom: 30px;
    flex-direction: column;
    align-items: center;
    -webkit-box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }
  .mantran-enter,.mantran-leave{
    opacity: 0;
    transform: translateY(-1rem);
  }
  .mantran-enter-active,.mantran-leave-active{
    transition: all .5s;
  }
</style>
