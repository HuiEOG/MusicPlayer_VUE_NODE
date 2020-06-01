/** Created by MiYuXin on 2020/3/1 .  **/

var db=require('../model/db');
var mongoose=require('mongoose');

var allmusicSchema=new mongoose.Schema({
  musicname:String,
  title:String,
  artist:String
});

//模糊查询
allmusicSchema.statics.MHfindbyAT=function (query,callback){
  var reg = new RegExp(query,'i');
  this.model('music').find({musicname:{$regex:reg}},callback).limit(5);
};

//删除音乐
allmusicSchema.statics.removebymusicname=function (musicname,callback){
  this.model('music').deleteOne({musicname:musicname},callback);
};


var music=db.model('music',allmusicSchema);

module.exports=music;












