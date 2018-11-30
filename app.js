const key = require('./config/key.js')
//app.js
App({
  data: {
    accessToken: ''
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getAccessToken(cb) {
    let _this = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: key.grant_type,
        appid: key.appid,
        secret: key.secret
      },
      success(res) {
        cb(res.data)
      }
    })
  },
  getQrCode(token) {
    // wx.request({
    //   url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token,
    //   data: {
    //     scene: '?id=2342',
    //     page: 'pages/index/index',
    //     width: 280
    //   },
    //   method: 'post',
    //   success(res) {
    //     console.log(res)
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    regionDefault: ['北京市', '北京市', '海淀区'],
    expressName: ['中通', '圆通', '顺丰', '百世汇通', '天天', '韵达', 'EMS', '邮政快递', '京东', '韵达', '优速', '德邦', '宅急送', '龙邦', '唯品会(品骏)'],
    expressCode: {
      '中通': 'ZTO',
      '圆通': 'YTO',
      '顺丰': 'SF',
      '百世汇通': 'HTKY',
      '京东': 'JD',
      '天天': 'HHTT',
      '韵达': 'YD',
      'EMS': 'EMS',
      '邮政快递': 'YZPY',
      '优速': 'UC',
      '德邦': 'DBL',
      '宅急送': 'ZJS',
      '龙邦': 'LB',
      '唯品会(品骏)': 'PJ'
    }
  }
})