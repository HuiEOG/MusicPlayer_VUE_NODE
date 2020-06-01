/** Created by MiYuXin on 2020/2/10 .  **/
const fs=require('fs');
const bodyParse=require('body-parser');
const cookieParser=require('cookie-parser');
const express=require('express');
const app=express();
const router=require('./router/router.js');

app.use(cookieParser());
app.use(bodyParse.urlencoded({extended:false}));
app.use(bodyParse.json());

app.use(express.static('./public'));


//http://localhost:9093/mp3
//传入全部音乐数据进数据库
app.get('/createmp3',router.createmp3);

//模糊查询
app.get('/findmp3',router.findmp3);

//读取歌词
app.get('/lrc',router.getlrc);

//登录
app.post('/login',router.login);

//注册
app.post('/regist',router.regist);

//用户歌曲列表
app.get('/usermusiclist',router.usermusiclist);

//用户删除单个音乐
app.get('/deletethismusic',router.deletethismusic);

//后台管理界面入口
app.post('/yeqimanage',router.yeqimanage);

app.get('/yeqiupdata',router.yeqiupdata);

//cookie
app.get('/ck',router.ck);
app.get('/ckr',router.ckr);

app.listen(9093);
