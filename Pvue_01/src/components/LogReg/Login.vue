<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <div id="Login">
<!--            <button @click="removeww">实验</button>-->
<!--            <button @click="removewwcookie">清除Token</button>-->
      <label class="redlabel L1">
        <!--        v-model="username"-->
        <span class="weiyuansu wy1">Σ(っ°Д°;)っ--用户名为6-10位字母/数字/汉字</span>
        <input v-model.lazy.trim="username" @focus="wy1toout" @focusout="chatwy1" type="text" name="" placeholder="用户名为6-10位字母/数字/汉字" class="Loginp" :class="userObj">
        <span class="iconfont icon-icon_id LRicon"/>
      </label>
      <label class="redlabel L2">
        <span class="weiyuansu wy2">!!!∑(ﾟДﾟノ)ノ--密码为6-20位字母/数字/'.'/'_'</span>
        <input v-model.lazy.trim="password" @focus="wy2toout" @focusout="chatwy2" type="password" name=""  placeholder="密码为6-20位字母/数字" class="Loginp" :class="passObj">
        <span class="iconfont icon-mima LRicon"/>
      </label>
      <button id="sublogin" @click="diruser">登录</button>

      <!-- 显示错误信息 -->
      <!--        <span class="msgdiv_text">Σ(っ°Д°;)っ&#45;&#45;请正确输入用户名!</span>-->
      <!--        <span class="msgdiv_text">!!!∑(ﾟДﾟノ)ノ&#45;&#45;请正确输入密码!</span>-->
      <span class="msgdiv_text" :class="isregObj">{{innertext}}</span>

      <!-- (-ω-；)--请正确填写用户名和密码!! -->
      <!-- (|| ﾟДﾟ)--用户名不存在!请检查用户名!! -->
      <!-- (|| ﾟДﾟ)--密码错误!请重新输入密码!! -->
      <!-- ヾ(✿ﾟ▽ﾟ)ノ--登录成功!!欢迎"+this.username+"回归社区!! -->
    </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    name: "regist",
    data() {
      return {
        url:"",
        msgstatus:-1,
        innertext:"(/ω＼)哎呀别这样嘛!我会害羞的!!!",
        //--分割线--
        userreg:/^[\u4e00-\u9fa5a-z0-9]{3,10}$/i,
        passreg:/^[a-z0-9._]{6,20}$/i,
        username:"",
        password:"",
        userbool:"default",
        passbool:"default"
      }
    },

    // //--路由(守卫--拦截器)
    beforeRouteEnter(to, from, next){
      next(vm=>{
        const winlocusername=window.localStorage.getItem('username');
        const winlocpassword=window.localStorage.getItem('password');
        // console.log(winlocusername);
        // console.log(winlocpassword);
        // console.log(vm);
        if (winlocusername===null&&winlocpassword===null) return false;
        vm.username=winlocusername;
        vm.password=winlocpassword;
      });
    },
    // beforeRouteUpdate(to, from, next){
    //   next();
    // },
    // beforeRouteLeave(to, from, next){
    //   console.log(from);
    //   next();
    // },
    //--路由(守卫--拦截器)-end

    methods:{
      removeww(){
        console.log("没东西--Warma的灭火器");
        this.$router.push({name: 'manage'});
      },
      removewwcookie(){
        // $('.msgdiv_text').removeClass('keyframmsgtex');
        // this.$axios.get(this.url+'/ckr').then(res=>{
        //   console.log(res);
        //   var xx=document.cookie.toString();
        //   console.log(xx);
        // }).catch(err=>{
        //   console.log(err);
        // });
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('password');
        // console.log(window.localStorage.getItem('username'));
        // console.log(window.localStorage.getItem('password'));
        this.$store.commit('LOGOUT');
        // console.log("清除Token成功!!!");
      },
      //处理登录
      diruser(){
        let mt=$('.msgdiv_text');
        mt.removeClass('keyframmsgtex');
        if (this.username===''||this.password===''){  //用户名为空-- -1
          this.msgstatus=0;
          this.innertext="(；'A`)--用户名或密码为空!请输入用户名和密码!!";
        }else if(this.userbool===false||this.passbool===false){  //其中一个是否有错-- -1
          this.msgstatus=-1;
          this.innertext="(-ω-；)--请正确填写用户名和密码!!";
        }else if(this.userbool&&this.passbool){  //开始查询后台
          this.$axios
            .post(this.url+'/login',{username:this.username,password:this.password,tokenn:this.$store.state.tokenn})
            .then(res=>{
              // console.log(res);
              // console.log(res.data.status);
              if (res.data===-3){    //出错了-- -1(-3)
                this.msgstatus=-1;
                this.innertext="ヾ(✿ﾟ▽ﾟ)ノ--出错了咩!可能服务器炸了吧!!";
              }else if (res.data.status===1){    //登录成功--1
                // console.log("---------1----------");
                // console.log(this.$store.state.tokenn);
                // console.log("---------2----------");
                // console.log(res.data.tokenn);
                // console.log("---------end----------");
                this.$store.commit('SET_TOKEN',res.data.tokenn);
                this.$store.commit('SET_USER',res.data.username);
                this.$store.commit('SET_PASS',res.data.password);
                this.msgstatus=res.data.status;
                this.innertext="ヾ(✿ﾟ▽ﾟ)ノ--登录成功!!欢迎"+this.username+"回归社区!!";
                //跳转到音乐界面-成功
                const _this=this;
                setTimeout(function (){
                  _this.$router.push({name: 'atchmusic'});
                },1500);

              }else if (res.data.status==="yeqi"){   //跳转到管理员界面
                // console.log("管理员poi");
                // console.log("---------end----------");
                this.$store.commit('SET_TOKEN',res.data.status);
                // console.log(this.$store.state.username);
                this.msgstatus=1;
                this.innertext="ರೃ∀ರೃ噫..管理员-"+this.username+"-发现后台系统啦!!";
                //跳转到管理员界面-成功
                const _this=this;
                setTimeout(function (){
                  _this.$router.push({name: 'M_index'});
                },1500);
              }else if(res.data===-1){  //用户名不存在-- -1
                this.msgstatus=res.data;
                this.innertext="(|| ﾟДﾟ)--用户名不存在!请检查用户名!!";
              }
              else if(res.data===-2){  //密码错误-- -1
                this.msgstatus=res.data;
                this.innertext="(|| ﾟДﾟ)--密码错误!请重新输入密码!!";
              }
            })
            .catch(err=>{
              // console.log(err);
              this.msgstatus=-1;
              this.innertext="ヾ(✿ﾟ▽ﾟ)ノ--出错了咩!可能服务器炸了吧!!";
            });
        }
        setTimeout(function (){
          mt.addClass('keyframmsgtex');
        },500)

      },
      wy1toout(){
        $('.wy1').css('right','-75%');
      },
      chatwy1(){
        if (!this.userbool){
          $('.wy1').css('right','0');
        }
      },
      wy2toout(){
        $('.wy2').css('right','-75%');
      },
      chatwy2(){
        if (!this.passbool){
          $('.wy2').css('right','0');
        }
      }
    },
    watch:{
      username:function (username){
        this.username=username;
        // const userboolin = this.username.search(this.userreg);
        //用户名格式错误
        this.userbool=this.username.search(this.userreg)===0;
      },
      password:function (password){
        this.password=password;
        // const passboolin = this.password.search(this.passreg);
        //密码格式错误
        this.passbool=this.password.search(this.passreg)===0;
      }
    },
    computed:{
      //用户名格式
      userObj:function (){
        return {
          truestyle:this.userbool!=='default'&&this.userbool,
          falsestyle:this.userbool!=='default'&&!this.userbool
        }
      },
      //密码格式
      passObj:function (){
        return {
          truestyle:this.passbool!=='default'&&this.passbool,
          falsestyle:this.passbool!=='default'&&!this.passbool
        }
      },
      //用户名是否可以登录
      isregObj:function (){
        return {
          truestyle:this.msgstatus===1,
          falsestyle:this.msgstatus===-1||this.msgstatus===0||this.msgstatus===-2
        }
      },
    },
    created() {
      this.url=this.HOST;

    }
  }
</script>

<style scoped>
  .truestyle{
    border:1px solid #11ac93;
    background-color: rgba(120, 222, 201, 0.32);
  }
  .falsestyle{
    border: 1px solid #d9586a;
    background-color: rgba(232, 105, 101, 0.4);
  }
  button{
    position: relative;
    z-index:9999;
  }
</style>
