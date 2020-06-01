/** Created by MiYuXin on 2020/2/7 .  **/
import LRdiv from '../components/LogReg/LRdiv';
import Login from '../components/LogReg/Login';
import regist from '../components/LogReg/regist';

var LogReg={
  path: 'LRdiv',
  name: LRdiv,
  component:LRdiv,
  redirect: '/LRdiv/Login',
  children:[{
    path: "Login", // 登录界面
    name: Login,
    component: Login
    },
    {
      path: "regist", // 注册界面
      name: regist,
      component: regist
    }]
};


export default LogReg;











