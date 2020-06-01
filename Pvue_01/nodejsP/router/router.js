/** Created by MiYuXin on 2020/2/20 .  **/
const ID3=require('node-id3');
const fs=require('fs');
const mongoose=require('mongoose');
const MD5=require('../model/MD5');
const user=require('../model/LRfun');
const music=require('../model/allmusiccreate');
const usermusiclist=require('../model/usermusiclist');
const Step=require('step');
const url=require('url');

// mongoose.set('useFindAndModify', false);


//创建MP3信息(没后台系统)
exports.createmp3=function (req,res){
  let filepath='../static/MP3/';
  let musiclisttext=[];
  const re=/\.mp3/;
  const retitle=/\/+/;
  // {musicname:'',artist:'',title:''}
  fs.readdir('../static/MP3/',function (err,files){
    if (err){
      console.log(err);
    }else{
      // console.log(files);
      for (let i = 0; i < files.length; i++) {
        (function(i){
          //读取ID3信息
          //title: '绝体绝命',
          //artist: '阿良良木健/洛天依',
          ID3.read(filepath+files[i], function(err, tags) {
            if (err){
              console.log(err);
            }else{
              const strname=files[i].replace(re,"");
              // musicname.push(strname);
              const artist_ch=tags.artist.replace(retitle,'&');
              const title=tags.title;
              music.findOne({title:title,artist:artist_ch},{musicname:1},function (err,result){
                  if (err){
                    console.log("未知错误--"+err);
                  }
                  if (result.length>0){
                    musiclisttext.push(result[0].title+"--已存在!!");
                  }else{
                    music.create({musicname: strname,title:tags.title,artist:artist_ch},function (err,result){
                      if (err){
                        console.log("创建失败--"+err);
                      }else {
                        musiclisttext.push(result.title+"--创建成功!!");
                      }
                    });
                  }
              });
            }
          });
        })(i);
      }
    }
  });
  setTimeout(function (){
    //JSON发送
    // console.log(musiclisttext);
    res.json(musiclisttext);
  },100)
};

//模糊查询
exports.findmp3=function (req,res){
  let allfindmusic=[];
  let findname=req.query.musicname;
  // console.log(findname);
  if (findname===""){  //前台输入框为空
    res.json("");
    return;
  }
  music.MHfindbyAT(findname,function (err,result){
      if (err){
          res.json("错误!!!");
          return;
      }
    // console.log(result);
      if (result.length>0){  //有数据
        for (let i = 0; i < result.length; i++) {
              allfindmusic.push({artist:result[i].artist,title:result[i].title});
            }
        res.json(allfindmusic);
      }else{  //没有数据
        res.json("");
      }

  });
};

//用户列表获取
exports.usermusiclist=function (req,res){
  // console.log(req.query);
  // console.log("---------");
  const reqdata=req.query;
  //'Tadd'、'Tall'、'Tdel'

  //music.musicfundfindbyAT

  usermusiclist.findOne({user:reqdata.user},function (err,result){
      if (err){
          // console.log(err);
        const tomsgg={type:"-1",msg:""};
        res.json(tomsgg);
      }else{
        let tomsg;
        Step(
          function thefun1(){
            isfun1(result,this);
          },
          function thefun2(callback){
            // if (err) throw err;
            // console.log(callback);
            //获取用户列表的所有歌曲
            if (reqdata.caozuotype==="Tall"){
              // console.log(callback);
              const allmusiclist=callback.musiclist;
              if (allmusiclist.length===0){
                tomsg={type:"0",msg:[]};
                res.json(tomsg);
                return;
              }
              getallcontext(res,allmusiclist);
            }
            //获取用户列表的所有歌曲-end
            //添加歌曲
            if (reqdata.caozuotype==="Tadd"){
              usermusiclist.addmusicisbyAT(reqdata,function (type,msg){
                if (type==="false"){  //重复了
                  // console.log(msg);
                  tomsg={type:"-1",msg:""};
                  res.json(tomsg);
                }else if(type==="ok"){
                  // tomsg={type:"1",msg:msg};
                  let msgarr=[];
                  msgarr.push(msg);
                  getallcontext(res,msgarr);
                }
              });
            }
            //添加歌曲--end

          }
        );
        //没有列表，创建
        function isfun1(rest,callback){
          if (rest===null){  //没有列表
            usermusiclist.create({user:reqdata.user,musiclist:[]},function (err,resule){
              if (err){
                // tomsg="未知错误!请联系作者|\-_-#";
                tomsg={type:"-1",msg:""};
                res.json(tomsg);
              }
              console.log("创建成功!!");
              // console.log(resule);
              callback(resule);
            });
          }//没有列表-end
          else{
            // console.log(rest);
            callback(rest);
          }
        }
        // Step(
        //   function thefunc1(){
        //     func1(this);
        //   },
        //   function thefunc2(callback){
        //     console.log(callback);
        //     func2(this);
        //   },
        //   function thefunc3(finishFlag){
        //     console.log(finishFlag);
        //   }
        // );
        //
        // function func1(callback){
        //   console.log("111");
        //   callback("kkk");
        // }
        // function func2(){
        //   console.log("222");
        // }
      }
  });

};
//函数封装
function getallcontext(res,allmusiclist){
  // console.log(allmusiclist.length);
  let tomsg;
  let allmusictext=[];
  // console.log(allmusiclist.length);
  for (let i = 0; i < allmusiclist.length; i++) {
    (function(i){
      let thistitle=allmusiclist[i].title;
      let thisartist=allmusiclist[i].artist;
      music.findOne({title:thistitle,artist:thisartist},{musicname:1},function (err,result){
        //""
        if (err){
          // console.log(err);
          tomsg={type:"-1",msg:"未知错误!请联系作者|\-_-#"};
          res.json(tomsg);
        }else{
          //result.musicname
          let linshi={
            musicname:result.musicname,
            title:thistitle,
            artist:thisartist
          };
          allmusictext.push(linshi);
          if (i===(allmusiclist.length-1)){
            // console.log(allmusictext);
            tomsg={type:"1",msg:allmusictext};
            res.json(tomsg);
          }
        }
      });
    })(i);
  }
}

//用户删除单个音乐
exports.deletethismusic=function (req,res){
  const reqdata=req.query;
  // console.log(reqdata);
  usermusiclist.updateOne({user:reqdata.user},{$pull:{musiclist:{title:reqdata.title,artist:reqdata.artist}}},function (err,result){
    let type=1;
    if (err){
      type=-1;
    }
    console.log(result);
    res.json({type:type});
  });
};

//歌词
exports.getlrc=function (req,res){
  // console.log(url.parse(req.url.query));
  // console.log(req.query);
  const musicname=req.query.musicname;
  fs.readFile('../static/lrc/'+musicname+'.lrc',function (err,data){
    if (err){
      console.log(err);
    }else{
      const lrc=data.toString();
      // console.log(lrc);
      // lrc=JSON.stringify(lrc);
      res.json(lrc);
    }
  });
};

//登录
exports.login=function (req,res){
  // ‘-1’-用户名不存在 ‘-2’-密码错误 ‘-3’-出错了 ‘1’-登录成功
  const postmsg=req.body;
  user.findbyusername(postmsg.username,function (err,result){
    //未知错误
    if (err){  //出错了
      res.json(-3);
      return;
    }
    // console.log(result.length);
    let tomsg;
    if (result.length<=0){  //用户名不存在
      tomsg=-1;
      res.json(tomsg);
    }else{   //用户名存在
      // console.log(postmsg);
      const md5pass=MD5(postmsg.password);
      // console.log(result);
      if (md5pass===result[0].password){  //登录成功
        if (postmsg.username==="poi"){  //管理员
          tomsg='yeqi';
          res.json({status:tomsg,username:postmsg.username,password:postmsg.password});
        }else{
          tomsg=1;
          // [
          //  postmsg.username
          //  postmsg.password
          //  postmsg.tokenn  ---miyuxinpoi
          // ]
          const retokenn=MD5(postmsg.username+postmsg.password+"miyuxinpoi");
          // console.log(retokenn);
          // console.log(postmsg.tokenn);
          if (postmsg.tokenn){
            console.log(retokenn);
            res.json({status:tomsg,tokenn:postmsg.tokenn,username:postmsg.username,password:postmsg.password});
          }else{
            res.json({status:tomsg,tokenn:retokenn,username:postmsg.username,password:postmsg.password});
          }
        }

      }else{   //密码错误
        tomsg=-2;
        res.json(tomsg);
      }
    }

  });
};

//注册
exports.regist=function (req,res){
  // ‘-1’-用户名被占用 ‘-3’-出错了 ‘1’-用户名可以注册
  const postmsg=req.body;
  user.findbyusername(postmsg.username,function (err,result){
    //未知错误
      if (err){
        res.json(-3);
        return;
      }
      // console.log(result.length);
      let tomsg;
      if (result.length>0){  //用户名被占用
          tomsg=-1;
          res.json(tomsg);
      }else{   //用户名可以注册
        // console.log(postmsg);
        const md5pass=MD5(postmsg.password);
        user.create({user:postmsg.username,password:md5pass},function (err,result){
          if (err){
            res.json(-3);
            return;
          }  //注册成功
          tomsg=1;
          res.json(tomsg);
        });

      }

    });
};

//后台管理界面
exports.yeqimanage=function (req,res){
  const yeqimsg=req.body;
  // console.log(yeqimsg);
  if (yeqimsg.type==="user"){
      user.find({},{ _id:0, __v: 0},function (err,result){
        // console.log(result);
        res.json(result);
      });
  }else if (yeqimsg.type==="userlist"){
    usermusiclist.find({},{ _id:0, __v: 0},function (err,result){
      let allresult=[],
          allmusiclist=[];
      for (var i = 0; i < result.length; i++) {
        let user=result[i].user;
        let musiclist=result[i].musiclist;
        for (var j = 0; j < musiclist.length; j++) {
          let mutile=musiclist[j].title,
              muartist=musiclist[j].artist;
          let onejson=mutile+'---'+muartist;
          allmusiclist.push(onejson);
        }
        // console.log(allmusiclist);
        let umjson={user:user,musiclist:allmusiclist};
        allresult.push(umjson);
        allmusiclist=[];
      }
      // console.log(allresult);
      res.json(allresult);
    });
  }else if (yeqimsg.type==="music"){
    music.find({},{ _id:0, __v: 0},function (err,result){
      // console.log(result);
      res.json(result);
    });
  }
};
//后台修改操作
exports.yeqiupdata=function (req,res){
  // console.log(req.query.user);
  let rqu=req.query.user;
  let rut=req.query.type;
  if (rut==='user'){
    user.removebyusername(rqu,function (err,result){
        if (err){
          res.json({status:0});
          return;
        }else if(result.n===0||result.ok===0||result.deletedCount===0){
          res.json({status:0});
          return;
        }
        if(result.ok===1){
          usermusiclist.listremovebyusername(rqu,function (err,result){
            // console.log(result);
             if (err){
               res.json({status:0});
               return;
             }else if(result.n===0||result.ok===0||result.deletedCount===0){
               res.json({status:0});
               return;
             }
            res.json({status:1});
          });
        }
    });
  }else if(rut==='userlist'){
    usermusiclist.listremovebyusername(rqu,function (err,result){
      // console.log(result);
      if (err){
        res.json({status:0});
        return;
      }else if(result.n===0||result.ok===0||result.deletedCount===0){
        res.json({status:0});
        return;
      }
      res.json({status:1});
    });
  }else if (rut==='music'){
    //removebymusicname
    music.removebymusicname(rqu,function (err,result){
      // console.log(result);
      if (err){
        res.json({status:0});
        return;
      }else if(result.n===0||result.ok===0||result.deletedCount===0){
        res.json({status:0});
        return;
      }
      res.json({status:1});
    });
  }
};

//cookie
exports.ck=function (req,res){
  const cook=req.cookies;
  const te={name:"冖於忄",pass:"zaza..."};
  let teArr=cook.te||[];
  teArr.push(te);
  res.cookie("te",teArr);
    // console.log(req);
  // res.clearCookie('te');
  //   console.log(req.cookies.te);
    const rr=url.parse(req.url);
    console.log(rr);
    console.log("-----------------");
    console.log(req.query);
    res.json(cook.te);
};

exports.ckr=function (req,res){
  const cook=req.cookies;
  // var te={name:"冖於忄",pass:"zaza..."};
  // var teArr=cook.te||[];
  // teArr.push(te);
  // res.cookie("te",teArr,{httpOnly:true});
    // console.log(req);
  res.clearCookie('te');
    console.log(req.cookies.te);
    res.json(cook.te);
};

