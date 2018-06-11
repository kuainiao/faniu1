
Page({
  preconcel:function(){
    wx.showModal({
      title: '取消预约',
      content: '确认取消预约吗？',
    })
  },
  predel: function () {
    wx.showModal({
      title: '删除预约',
      content: '确认删除预约吗？',
    })
  }
})