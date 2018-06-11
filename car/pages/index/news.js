
Page({

  data: {
    newsItems:[
      {
        name:'醋洗脸美容功效效果不错',
        cc:'中国古代医学就有用醋入药的记载，认为它有生发、美容、降压、减肥的功效...',
        numzan:5421,
        numcol:1234,
        isimgs:true
      },
      {
        name: '双眼皮手术',
        cc: '手术方法有以下几类：埋线重睑法、切开重睑法、缝线重睑法无痕翘睫法双眼皮及植皮重睑法等...',
        numzan: 999,
        numcol: 456,
        isimgs: false
      }
    ]
  },
  newsDel:function(e){
    var that=this;
    wx.showModal({
      title: '确定删除',
      content: '确定删除该资讯吗？',
      success:function(){
        var newsItems = that.data.newsItems;
        newsItems.splice(e.currentTarget.dataset.index, 1);
        that.setData({
          newsItems: newsItems
        })
      }
    })
  },
  newscreate:function(){
    var that = this
    wx.showActionSheet({
      itemList: ['拍摄', '相册'],
      success: function (res) {
        if (res.tapIndex==0){
          
          wx.chooseVideo({
            sourceType: ['album', 'camera'],
            maxDuration: 60,
            camera: 'back',
            success: function (res) {
              that.setData({
                src: res.tempFilePath
              })
            }
          })

        } else if (res.tapIndex == 1){

          wx.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
            }
          })

        }
      }
    })
  }

})
