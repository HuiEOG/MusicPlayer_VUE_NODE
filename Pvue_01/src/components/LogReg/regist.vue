<!-- Created by MiYuXin on 2020/2/7. -->
<template>
    <div id="regist">
<!--      <button @click="removeww">实验</button>-->
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
      <button id="sublogin" @click="diruser">注册</button>

      <!-- 显示错误信息 -->
      <!--        <span class="msgdiv_text">Σ(っ°Д°;)っ&#45;&#45;请正确输入用户名!</span>-->
      <!--        <span class="msgdiv_text">!!!∑(ﾟДﾟノ)ノ&#45;&#45;请正确输入密码!</span>-->
      <span class="msgdiv_text" :class="isregObj">{{innertext}}</span>

      <!-- (|| ﾟДﾟ)--用户名被占用!请重新输入用户名!! -->
      <!-- (；'A`)--用户名为空!请输入用户名!! -->
      <!-- ヾ(✿ﾟ▽ﾟ)ノ--注册成功!!欢迎加入冖於忄社区!! -->
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
    methods:{
      removeww(){
        console.log(this.$store.state.username);
        console.log(this.$store.state.password);
      },
      //处理注册
      diruser(){
        var mt=$('.msgdiv_text');
        mt.removeClass('keyframmsgtex');
        if (this.username===''||this.password===''){  //用户名为空-- -1
          this.msgstatus=0;
          this.innertext="(；'A`)--用户名或密码为空!请输入用户名和密码!!";
        }else if(this.userbool===false||this.passbool===false){  //其中一个是否有错-- -1
          this.msgstatus=-1;
          this.innertext="(-ω-；)--请正确填写用户名和密码!!";
        }else if(this.userbool&&this.passbool){  //开始查询后台
          this.$axios
            .post(this.url+'/regist',{username:this.username,password:this.password})
            .then(res=>{
              // console.log(res);
              if (res.data===-3){    //出错了-- -1(-2)
                this.msgstatus=-1;
                this.innertext="ヾ(✿ﾟ▽ﾟ)ノ--出错了咩!可能服务器炸了吧!!";
              }else if (res.data===1){    //可以注册--1
                const _this=this;
                this.msgstatus=res.data;
                this.innertext="ヾ(✿ﾟ▽ﾟ)ノ--注册成功!!欢迎加入社区!!";
                this.$store.state.username=this.username;
                this.$store.state.password=this.password;


                this.$store.commit('SET_USER',this.username);
                this.$store.commit('SET_PASS',this.password);

                setTimeout(function (){
                  _this.$router.push({name:'Login'});
                },1500);

                // console.log(window.localStorage.getItem('username'));
                // console.log(window.localStorage.getItem('password'));

              }else if(res.data===-1){  //用户名被占用-- -1
                this.msgstatus=res.data;
                this.innertext="(|| ﾟДﾟ)--用户名被占用!请重新输入用户名!!";
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
        var userboolin = this.username.search(this.userreg);
        //用户名格式错误
        this.userbool=userboolin===0;
      },
      password:function (password){
        this.password=password;
        var passboolin = this.password.search(this.passreg);
        //密码格式错误
        this.passbool=passboolin===0;
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
      //用户名是否可以注册
      isregObj:function (){
        return {
          truestyle:this.msgstatus===1,
          falsestyle:this.msgstatus===-1||this.msgstatus===0
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
</style>
