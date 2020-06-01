/** Created by MiYuXin on 2020/3/2 .  **/

var db=require('../model/db');
var mongoose=require('mongoose');

var usermusiclistSchema=new mongoose.Schema({
  user:String,
  musiclist:[
    {
      title:String,
      artist:String
    }
  ]
});

//查找
usermusiclistSchema.statics.findall=function (username,callback){
  this.model('usermusiclist').find({user:username},callback);
};

//删除用户音乐列表
usermusiclistSchema.statics.listremovebyusername=function (username,callback){
  this.model('usermusiclist').deleteOne({user:username},callback);
};

//添加音乐进列表
usermusiclistSchema.statics.addmusicisbyAT=function (reqdata,callback){
  this.model('usermusiclist').findOne({user:reqdata.user},{musiclist: 1},function (err,doc){
      if (err){
          callback("false","");
          return;
      }
      let ishave=false;

      // console.log(doc);

      for (var i = 0; i < doc.musiclist.length; i++) {
        if(doc.musiclist[i].title===reqdata.title&&doc.musiclist[i].artist===reqdata.artist){
          ishave=true; //表示重复了
          // console.log(doc.musiclist[i].title);
          // console.log(reqdata.title);
          break;
        }
      } //--for
      if (ishave){ //重复了
        // console.log(ishave);
        callback("false","");
      }else{
        // console.log(ishave);
        doc.musiclist.push({title:reqdata.title,artist:reqdata.artist});
        doc.save(function (err,rest){
          if (err){
            callback("false","");
            return;
          }
          callback("ok",{title:reqdata.title,artist:reqdata.artist});
        });
        // console.log(doc);
      }

  });
};

var usermusiclist=db.model('usermusiclist',usermusiclistSchema);
module.exports=usermusiclist;











