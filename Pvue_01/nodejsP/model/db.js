/** Created by MiYuXin on 2020/2/20 .  **/
var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://localhost/MYX_user',
  { useNewUrlParser: true, useUnifiedTopology: true });

db.once('open',function (err){
  if (err){
    console.log("数据库连接失败!!");
  }else{
    console.log("数据库连接成功!!");
  }
});

module.exports=db;








