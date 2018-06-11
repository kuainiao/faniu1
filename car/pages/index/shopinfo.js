
Page({

  data: {
    showinfo_items: ["品牌介绍", "店铺实拍", "技师展示", "案例展示"],
    activeOn:0
  },
  infoTap:function(e){
    var activeOn = this.data.activeOn;
    activeOn = e.target.dataset.index;
    this.setData({
      activeOn: activeOn
    })
  }

})