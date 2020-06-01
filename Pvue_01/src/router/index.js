import Vue from 'vue'
import Router from 'vue-router'
import mLogReg from '../components/mLogReg'
import pLogReg from '../components/pLogReg'
import Login from "../components/LogReg/Login";
import regist from "../components/LogReg/regist";
import atchmusic from '../components/atchmusic'

import manageMent from '../components/manageMent'
import M_index from '../components/manageMents/M_index'
import M_user from '../components/manageMents/M_user'
import M_userlist from '../components/manageMents/M_userlist'
import M_music from '../components/manageMents/M_music'
import M_dealmusic from '../components/manageMents/M_dealmusic'

import store from '../store'

Vue.use(Router);
let router=new Router({
  linkActiveClass:"myactive",
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: {
        name:'mLogReg'
        // name:'manage'
      }
    },
    {
      path: "/pLogReg", // pc端首页
      name: 'pLogReg',
      component: pLogReg
    },
    {
      path: '/mLogReg', // 手机端首页
      name: 'mLogReg',
      redirect:{
        name:'Login'
      },
      component: mLogReg,
      // beforeEnter:(to,from,next)=>{
      //   console.log('beforeEnter-路由非组件');
      //   console.log(to);
      //   next();
      // },
      meta: {keepAlive: true},
      children:[{
        path: "Login", // 登录界面
        name: 'Login',
        component: Login,
        // beforeEnter:(to,from,next)=>{
        //   // console.log('beforeEnter-路由非组件');
        //   next();
        // }
      },
      {
        path: "regist", // 注册界面
        name: 'regist',
        component: regist
      }]
    },
    {
      path: '/atchmusic', // 音乐播放界面
      name: 'atchmusic',
      // redirect:'/atchmusic',
      component: atchmusic,
      meta: {requireAuth: true},
      // children:[]
    },
    {
      path: '/manage', //管理员界面
      name: 'manage',
      redirect:{
        name:'M_index'
      },
      keepAlive: true,
      component: manageMent,
      // meta: {requireAuth: true},
      children:[
        {
          path:'M_index',
          name:'M_index',
          component: M_index,
          meta: {requireAuth: true}
        },
        {
          path:'M_user',
          name:'M_user',
          component: M_user,
          meta: {requireAuth: true}
        },
        {
          path:'M_userlist',
          name:'M_userlist',
          component: M_userlist,
          meta: {requireAuth: true}
        },
        {
          path:'M_music',
          name:'M_music',
          component: M_music,
          meta: {requireAuth: true}
        },
        // {
        //   path:'M_dealmusic',
        //   name:'M_dealmusic',
        //   component: M_dealmusic,
        //   meta: {requireAuth: true}
        // },

      ]
    }
  ]
});

router.beforeEach((to,from,next)=>{
  const token=store.state.tokenn;
  // console.log("----------------");
  // console.log(to);
  if (to.meta.requireAuth){
    if (token){
      // if (token==="yeqi") store.commit('CLEAR');
      next();
    }else{
      console.log("跳转页面需要登录!!");
      next({
        path:'/mLogReg'
      });
    }
  }else{
    if (token){
      // console.log("99999999");
      // console.log("----------------");
      next({
        path:'/atchmusic'
      });
    }
    next();
  }

});


export default router;
