Page({

  data: {
    colItems: ["商品", "服务", "资讯"],
    activeColOn: 0,
    newsItems: [
      {
        name: '醋洗脸美容功效效果不错',
        cc: '中国古代医学就有用醋入药的记载，认为它有生发、美容、降压、减肥的功效...',
        numzan: 5421,
        numcol: 1234,
        isimgs: true,
        iszaned: false,
        iscollected: true
      },
      {
        name: '双眼皮手术',
        cc: '手术方法有以下几类：埋线重睑法、切开重睑法、缝线重睑法无痕翘睫法双眼皮及植皮重睑法等...',
        numzan: 999,
        numcol: 456,
        isimgs: false,
        iszaned: false,
        iscollected: true
      }
    ]
    
  },
  colTap: function (e) {
    var activeColOn = this.data.activeColOn;
    activeColOn = e.target.dataset.index;
    this.setData({
      activeColOn: activeColOn
    })
  },
  haszaned: function () {
    wx.showToast({
      title: '已赞过！'
    })
  },
  gotozan: function (e) {
    var newsItems = this.data.newsItems;
    newsItems[e.currentTarget.dataset.index].iszaned = true;
    newsItems[e.currentTarget.dataset.index].numzan++;
    this.setData({
      newsItems: newsItems
    })
  },
  gotocollect: function (e) {
    var newsItems = this.data.newsItems;
    newsItems[e.currentTarget.dataset.index].iscollected = true;
    newsItems[e.currentTarget.dataset.index].numcol++;
    this.setData({
      newsItems: newsItems
    })
  },
  colconcel: function (e) {
    var newsItems = this.data.newsItems;
    newsItems[e.currentTarget.dataset.index].iscollected = false;
    newsItems[e.currentTarget.dataset.index].numcol--;
    this.setData({
      newsItems: newsItems
    })
  }

})