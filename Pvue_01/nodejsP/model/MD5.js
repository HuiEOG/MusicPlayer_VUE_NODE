/** Created by MiYuXin on 2020/2/20 .  **/
var crypto = require("crypto");
module.exports=function (filepassword){
  var md5=crypto.createHash('md5');
  password=md5.update(filepassword).digest("base64");
  return password;
};













