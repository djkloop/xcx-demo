App({
  data: {
    userInfo: {}
  },
  globalData: {
    g_isPlayingMusic: false,
    g_currentMusicPostId: void 0,
    g_doubanBaseUrl: "https://douban.uieee.com"
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var _this = this;
    wx.getUserInfo({
      success(res) {
        let userInfo = res.userInfo;
        _this.data.userInfo = userInfo;
      }
    });

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#1a1655',
      animation: {
        duration: 200,
        timingFunc: 'easeInOut'
      }
    });
  },
  mixinEvent: {
    mixinSetNavigationBarColor(opts) {
      const {ftColor, bg} = opts;
      wx.setNavigationBarColor({
        frontColor: ftColor,
        backgroundColor: bg,
        animation: {
          duration: 200,
          timingFunc: 'easeInOut'
        }
      });
    },
    mixinSetNavigationBarTitle(opts) {
      const { title } = opts;
      wx.setNavigationBarTitle({
        title
      });
    },
  },

  Util: {
    wxRequest(opts) {
      wx.request({
        url: opts.url,
        data: opts.data,
        header: {
          "Content-Type": "appliction/json"
        },
        method: opts.method || 'GET',
        success:function(res) {
          opts.success && opts.success(res);
        },
        fail: function(res) {
          opts.fail && opts.fail(res);
        },
        complete: function(res) {
          opts.complete && opts.complete(res);
        }
      })
    }
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
})
