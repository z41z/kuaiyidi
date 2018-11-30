// apiUrl
const apiUrl = require('../../config/apiUrl.js');
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    currentStep: 1,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendRegion: app.globalData.regionDefault,
    receiveRegion: app.globalData.regionDefault,
    expressName: app.globalData.expressName,
    expressCode: app.globalData.expressCode,
    tips: '',
    hasError: false,
    currentExpress: '中通',
    ShipperCode: 'ZTO',
    nickName: '',
    gender: '',
    avatarUrl: '',
    country: '',
    province: '',
    city: '',
    sName: '',
    sPhone: '',
    ProvinceName: app.globalData.regionDefault[0],
    CityName: app.globalData.regionDefault[1],
    ExpAreaName: app.globalData.regionDefault[2],
    sAddress: '',
    rName: '',
    rPhone: '',
    rProvinceName: app.globalData.regionDefault[0],
    rCityName: app.globalData.regionDefault[1],
    rExpAreaName: app.globalData.regionDefault[2],
    rAddress: '',
    sendDate: '',
    Remark: '',
    addSuccess: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 下一步
  nextStep(event) {
    let step = event.currentTarget.dataset.step
    if (step > 0) {
      if (this.data.currentStep === 1) {
        if (!this.data.sName || !this.data.sPhone || !this.data.sAddress || this.data.sPhone.length != 11 || this.data.sPhone.split("")[0] !== '1') {
          this.setData({
            tips: 'Oops! 寄件人信息填写不正确或者不完整',
            hasError: true
          })
        } else {
          this.setData({
            tips: '',
            hasError: false
          })
        }
      }
      if (this.data.currentStep === 2) {
        if (!this.data.rName || !this.data.rPhone || !this.data.rAddress || this.data.rPhone.length != 11 || this.data.rPhone.split("")[0] !== '1') {
          this.setData({
            tips: 'Oops! 收件人信息填写不正确或者不完整',
            hasError: true
          })
        } else {
          this.setData({
            tips: '',
            hasError: false
          })
        }
      }
    } else {
      this.setData({
        hasError: false,
        tips: ''
      });
    }
    if (!this.data.hasError) {
      this.setData({
        currentStep: this.data.currentStep + +(step)
      });
    }
  },
  // 设置文本框值
  setValue(event) {
    this.setData({
      [event.target.dataset.name]: event.detail.value
    });
  },
  onLoad: function() {
    app.getAccessToken(function(res){
      app.getQrCode(res.access_token)
    })
    if (app.globalData.userInfo) {
      this.setUserInfo(app.globalData.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setUserInfo(app.globalData.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setUserInfo(app.globalData.userInfo)
        }
      })
    }
  },
  onShow() {
    this.setData({
      currentStep: 1,
      addSuccess: false
    })
  },
  // 设置快递名称和编码
  bindExpressChange: function(e) {
    this.setData({
      currentExpress: this.data.expressName[e.detail.value],
      ShipperCode: this.data.expressCode[this.data.expressName[e.detail.value]]
    })
  },
  // 提交
  sendData() {
    let _this = this
    wx.showLoading({
      title: '提交中...',
      mask: true,
    })
    wx.request({
      url: apiUrl.add,
      data: this.data,
      method: 'post',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType:'json',
      success:function(res) {
        wx.hideLoading();
        let result = JSON.parse(JSON.stringify(res.data));
        if (result.code == 200) {
          // 提交成功
          _this.setData({
            tips: '',
            addSuccess: true
          })
        } else {
          // 提交失败
          _this.setData({
            tips: res.statusCode + '提交失败,请等会再提交',
            addSuccess: false
          })
        }
      },
      fail:function(res) {
        // 服务器或网络错误
        wx.hideLoading();
        _this.setData({
          tips: '服务器或网络错误',
          addSuccess: false
        })
      }
    })
  },
  // 设置用户信息字段
  setUserInfo(data) {
    this.setData({
      nickName: data.nickName,
      gender: data.gender,
      avatarUrl: data.avatarUrl,
      country: data.country,
      province: data.province,
      city: data.city,
      hasUserInfo: true
    })
  },

  // 寄件人地址
  bindSendRegionChange(event) {
    this.setData({
      ProvinceName: event.detail.value[0],
      CityName: event.detail.value[1],
      ExpAreaName: event.detail.value[2],
      sendRegion: event.detail.value
    })
  },
  // 收件人地址
  bindReceiveRegionChange(event) {
    this.setData({
      rProvinceName: event.detail.value[0],
      rCityName: event.detail.value[1],
      rExpAreaName: event.detail.value[2],
      receiveRegion: event.detail.value
    })
  },
  // 返回首页
  returnHome() {
    this.setData({
      addSuccess: false,
      currentStep: 1,
      rName: '',
      rPhone: '',
      rAddress: ''
    })
    wx.switchTab({
      url: '../index/index'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})