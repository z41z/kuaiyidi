// apiUrl
const apiUrl = require('../../config/apiUrl.js');
// pages/search/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressName: app.globalData.expressName,
    expressCode: app.globalData.expressCode,
    currentExpress: '中通',
    currentCode: 'ZTO',
    keywords: '',
    imgUrl: '../../static/search-bg.png',
    tips: '1.选择快递公司\n2.输入快递单号\n3.点击搜索按钮',
    data: [
      // {
      //   time:'2018-11-11 11:11:11',
      //   info:'34343434'
      // },
      // {
      //   time:'2018-11-11 11:11:11',
      //   info:'34343434'
      // },
      // {
      //   time:'2018-11-11 11:11:11',
      //   info:'34343434'
      // },
      // {
      //   time:'2018-11-11 11:11:11',
      //   info:'34343434'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setEnableDebug({
      enableDebug: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 快递编码
  bindExpressChange(event) {
    this.setData({
      currentExpress: this.data.expressName[event.detail.value],
      currentCode: this.data.expressCode[this.data.expressName[event.detail.value]]
    })
  },
  // 关键字
  setValue(event) {
    this.setData({
      keywords: event.detail.value
    })
  },
  search() {
    let _this = this;
    this.setData({
      data: [],
      tips: '',
      imgUrl: '../../static/search-bg.png'
    });
    wx.showLoading({
      title: '查找中...',
    });
    wx.request({
      url: apiUrl.search,
      method:'post',
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },
      data: {
        currentCode: this.data.currentCode,
        keywords: this.data.keywords
      },
      success(res) {
        wx.hideLoading();
        _this.setData({
          data: res.data.Traces,
          tips: _this.data.data.length ? '' : '暂未找到物流轨迹',
          imgUrl: _this.data.data.length ? '' : '../../static/not-found.png',
        })
        console.log(res)
      },
      fail(res) {
        wx.hideLoading();
        _this.setData({
          tips: 'Oops! 网络或服务器错误',
          imgUrl: '../../static/not-found.png',
        })
      }
    })
  }
})