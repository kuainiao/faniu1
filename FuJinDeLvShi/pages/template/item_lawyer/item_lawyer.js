var that=this;

function itemattention() {
  that.setData({
    attentioned: true
  })
}

module.exports = {
  itemattention: itemattention
}