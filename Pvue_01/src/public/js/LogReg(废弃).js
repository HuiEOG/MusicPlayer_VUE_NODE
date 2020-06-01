/** Created by MiYuXin on 2020/2/7 .  **/

//将jquery代码放入$(function() { })中。
//jquery代码不能执行的原因应该是vue 使用了虚拟DOM，jquery 要在dom 完成加载之后运行。
$(function (){
  $(".Loginp").focus(function (){
    $(this).addClass('inpactive');
  }).blur(function (){
    $(this).removeClass('inpactive');
  });
});












