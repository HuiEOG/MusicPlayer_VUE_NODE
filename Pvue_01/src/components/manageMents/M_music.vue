<!-- Created by MiYuXin on 2020/3/7. -->
<template>
  <div id="M_music">
    <!-- 标题 -->
    <div class="con_operate">
      <p class="contitle">全部音乐信息</p>
    </div>
<!--          <button @click="ceshi">测试</button>-->
    <!-- 表格 -->
    <div id="con_table">
      <table id="tablem">
        <thead class="table_thead"/>
      </table>
    </div>
    <!-- 提示 -->
    <div class="con_operate">
      <transition name="msgshowtran">
        <span class="msgshow" v-show="ismsgshow" :class="isregObj">{{msgmsg}}</span>
      </transition>
    </div>
  </div>
</template>

<script>
  import '../../public/css/bootstrap.min.css'
  import '../../public/css/bootstrap-table.min.css'
  import $ from 'jquery'
  import '../../public/js/bootstrap.min'
  import 'bootstrap-table/dist/bootstrap-table.min'
  //------------------------
  import '../../public/css/manage/M_user.css'

  export default {
    name: "M_music",
    data() {
      return {
        url:"",
        msgstatus:-1,
        ismsgshow:false,
        msgmsg:"",
        columns: [
          {
            title: 'ID',
            field: 'id',
            align:'center'
          },
          {
            title: '音乐名字',
            field: 'musicname',
            align:'center'
          },
          {
            title: '歌名',
            field: 'title',
            align:'center'
          },
          {
            title: '歌手',
            field: 'artist',
            align:'center'
          }
        ],
        data: [],
      }
    },
    methods:{
      ceshi(){
        const _this=this;
        // this.ismsgshow=!this.ismsgshow;
        // setTimeout(function (){
        //   _this.ismsgshow=false;
        // },1000);
        // console.log($('#table').bootstrapTable('load',this.data));
        this.getdata();
      },
      //-----------
      getdata(){
        this.$axios.post(this.url+'/yeqimanage',{type:"music"})
          .then(res=>{
            var resd=res.data;
            // console.log(resd);
            for (var i = 0; i < resd.length; i++) {
              resd[i].id=i+1;
              this.data.push(resd[i]);
            }
            $('#tablem').bootstrapTable('load',this.data);
            // console.log(this.data);
          })
          .catch(err=>{
            console.log(err);
          })
      },
      showmsg(){
        const _this=this;
        this.ismsgshow=!this.ismsgshow;
        setTimeout(function (){
          _this.ismsgshow=false;
        },1000);
      }
    },
    mounted() {
      const _this=this;
      let thco=_this.columns;
      // console.log(this.data);
      const caozuo={
        title: "操作",
        align: 'center',
        valign: 'middle',
        width: 160, // 定义列的宽度，单位为像素px
        formatter: function (value, row, index) {   //传入数据
          return '<button class="btn btn-primary btn-sm">删除</button>';
        },
        events:{
          //删除操作
          "click .btn-sm": function(event, val, row, index) {
            // console.log(_this);
            // console.log(row);
            _this.$axios.get(_this.url+'/yeqiupdata',{
              params:{
                user:row.musicname,
                type:'music'
              }
            })
              .then(res=>{
                const rsds=res.data.status;
                // console.log(rsds);
                if (rsds===0){
                  _this.msgmsg="删除失败!!未知错误";
                  _this.msgstatus=-1;
                  _this.showmsg();
                }else if (rsds===1){
                  _this.msgmsg="删除成功!!";
                  _this.msgstatus=1;
                  _this.showmsg();
                  $('#tablem').bootstrapTable('remove', {
                    field: "id",   //此处的 “id”对应的是字段名
                    values: [parseInt(row.id)]
                  });
                }
              })
              .catch(err=>{
                _this.msgmsg="删除失败!!未知错误";
                _this.msgstatus=-1;
                _this.showmsg();
              })
          }
        }
      };
      thco.push(caozuo);
      $('#tablem').bootstrapTable({
        columns: _this.columns,
        data: _this.data,
        locale:'zh-CN',
        height:280,
        showPaginationSwitch:false,
        showRefresh:true,
        search: true,
        showColumns: true,
        showToggle:true,
        classes: 'table table-hover table-striped',
        // striped: true,
        pagination:true,
        pageNumber:1,
        pageSize:5,
        // pageList: [5, 10, 15, 20],
        paginationHAlign:'left',
        paginationSuccessivelySize:3,
        paginationPagesBySide:1,
        paginationDetailHAlign:' hidden',
        icons:{
          paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
          paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
          refresh:'glyphicon glyphicon-repeat',
          toggleOff:'glyphicon glyphicon-align-left',
          toggleOn:'glyphicon glyphicon-indent-left',
          columns:'glyphicon glyphicon-th',
          detailOpen:'glyphicon-plus icon-plus',
          detailClose:'glyphicon-minus icon-minus'
        },
        theadClasses:'thead-dark',
        buttonsClass:"primary",
        smartDisplay:true
      });

    },
    computed:{
      isregObj:function (){
        return {
          truestyle:this.msgstatus===1,
          falsestyle:this.msgstatus===-1||this.msgstatus===0||this.msgstatus===-2
        }
      }
    },
    created() {
      this.url=this.HOST;
      this.getdata();
    }
  }
</script>

<style scoped>
  button{
    position: absolute;
    left:20%;
    top:5%;
  }


  .hidden{display:none;}
  .truestyle{
    border:1px solid #11ac93;
    background-color: rgba(120, 222, 201, 0.32);
  }
  .falsestyle{
    border: 1px solid #d9586a;
    background-color: rgba(232, 105, 101, 0.4);
  }
  .msgshow{
    position: absolute;
    display: inline-block;
    width: 30%;
    height: 2rem;
    left: 0;
    right: 0;
    margin: auto;
    bottom: -10%;
    color: #ffffffde;
    font-weight: 600;
    text-align: center;
    font-size: 1.2rem;
    line-height: 1.8rem;
    border-radius: 20px;
  }

  .msgshowtran-enter{
    opacity: 0;
  }
  .msgshowtran-leave-to{
    opacity: 0;
  }
  .msgshowtran-enter-active,.msgshowtran-leave-active{
    transition:all .3s;
  }






</style>
