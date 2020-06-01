/** Created by MiYuXin on 2020/2/20 .  **/
var db=require('../model/db');
var mongoose=require('mongoose');

var userSchema=new mongoose.Schema({
  user:String,
  password:String
});

userSchema.statics.findbyusername=function (username,callback){
    this.model('user').find({user:username},callback);
};
userSchema.statics.removebyusername=function (username,callback){
  this.model('user').deleteOne({user:username},callback);
};

var user=db.model('user',userSchema);

module.exports=user;









