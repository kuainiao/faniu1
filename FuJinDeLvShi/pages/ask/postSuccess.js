var app = getApp(), page;
var config = require('../../config');
var util = require('../../utils/util');
let pageDefault = require('../../utils/default');

Page(util.extend({}, pageDefault,{
  data: {
    askUrl:'',
  },
  onLoad: function (options) {
    page = this;
    app.init(page);
    
    if(!options.id){
      wx.showModal({
        title: '错误提示',
        content: '咨询ID错误',
        success:()=>{
          wx.navigateBack();
        }
      })
    }
    page.getInitData(options);
  },
  onShow:function(){
    page.checkLogin();
  },
  getInitData: (options) => {
    wx.showLoading({ title: '加载中，请稍候..', mask: true });
    app.getServerInfo(options.ispay ? 'WeApp/Ask/paySuccess' : 'WeApp/Ask/postSuccess',{id:options.id},(res)=>{
      wx.hideLoading();
      var data = res.data;
      if(data.errcode==0){
        page.setData({askUrl:'/pages/ask/show?id='+options.id});
      }else{
        wx.showModal({
          title: '错误提示',
          content: data.message,
          success: () => {
            wx.navigateBack();
          }
        })
      }
    });
  }
}
));