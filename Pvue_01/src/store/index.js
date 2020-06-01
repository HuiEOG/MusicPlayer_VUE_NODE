/** Created by MiYuXin on 2020/2/14 .  **/
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store=new Vuex.Store({
  state:{
    //登录验证Token...
    username:window.localStorage.getItem('username'),
    password:window.localStorage.getItem('password'),
    tokenn:window.localStorage.getItem('token'),
    //登录验证Token--end
    //防止多次点击全局参数控制
    clicktag:0, //0--可以点击 1--不可点击
    userlistbool:false, //false--不显示 true--显示
    musiclistbool:false, //false--不显示 true--显示
    //定时时间(时分)
    setstopH:"00",
    setstopM:"00",
    timingStatus:false, //false--定时暂停 true--定时开始
    showdis:false,//false--不显示 true--显示
    //'定时'里面两个有bug需要使用VUEX(暂时)
    STJindutiao:"",
    comebackdrawBackMAX:"",
    //搜索框显隐
    findsultbool:false, //false--不显示 true--显示
    //(全部音乐)
    Allmusiccontext:[], //所有的音乐
    isclicktoplay:false  //false--点击搜索内容没操作 true--搜索内容点击播放
  },
  getters:{
    //全部列表音乐
    Amct: state => state.Allmusiccontext
  },
  mutations:{
    //登录验证Token...
    SET_TOKEN(state,istoken){
      state.tokenn=istoken;
      window.localStorage.setItem('token',istoken);
    },
    SET_USER(state,isusername){
      state.username=isusername;
      window.localStorage.setItem('username',isusername);
    },
    SET_PASS(state,ispassword){
      state.password=ispassword;
      window.localStorage.setItem('password',ispassword);
    },
    LOGOUT(state){
      state.tokenn = null;
      window.localStorage.removeItem('token');
    },
    CLEAR(){
      // window.localStorage.removeItem('username');
      // window.localStorage.removeItem('password');
      window.localStorage.clear();
      console.log(window.localStorage.getItem('username'));
      console.log(window.localStorage.getItem('password'));
      console.log(window.localStorage.getItem('token'));
    },
    //登录验证Token--end
    //userlist与musiclist模块的显示控制
    showuserlist(state,bool){
      state.userlistbool=bool;
    },
    showmusiclist(state,bool){
      state.musiclistbool=bool;
    },
    //定时时间(时分)
    showdisplaytime(state){
      state.showdis=!state.showdis;
    },
    showsetstoptime(state,timeJSON){
      state.setstopH=timeJSON.thisH;
      state.setstopM=timeJSON.thisM;
    },
    //搜索框显隐
    showfindsultbool(state,bool){
      state.findsultbool=bool;
    },
    //点击搜索到的音乐添加进播放列表
    ADDMUSIC(state,Wmusic){
      state.Allmusiccontext.push(Wmusic);
      setTimeout(function (){
        state.isclicktoplay=true;
      },100);
    },
    REMMUSIC(state,Wnum){
      state.Allmusiccontext.splice(Wnum,1);
    }
  },
  actions:{
    //userlist与musiclist模块的显示控制
    chatbool(context,bool){
      context.commit('showuserlist',bool);
      context.commit('showmusiclist',bool);
    },
    changeshowuserlist(context,bool){
      context.commit('showuserlist',bool);
    },
    changeshowmusiclist(context,bool){
      context.commit('showmusiclist',bool);
    },
    //定时时间(时分)
    changesetstoptime(context,timeJSON){
      console.log(timeJSON);
      context.commit('showsetstoptime',timeJSON);
    },
    //搜索框显隐
    changeshowfindsult(context,bool){
      context.commit('showfindsultbool',bool);
    },
    //点击搜索到的音乐添加进播放列表
    addmusic(context,Wmusic){
      context.commit('ADDMUSIC',Wmusic);
    },
    //删除某条音乐
    removemusic(context,Wnum){
      context.commit('REMMUSIC',Wnum);
    }
  }
});

export default store;







