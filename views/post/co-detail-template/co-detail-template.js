var postData = require('../../../mock/mock.post.data.js');
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    isMusic: false,
    currentTime: 0
  },
  onAudioTap(e) {
    let postId = this.data.postId || 0;
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    let isMusic = this.data.isMusic;
    if (isMusic) {
      console.log('能不能监听到啊...')
      backgroundAudioManager.pause();
      this.setData({
        isMusic: false,
        currentTime: backgroundAudioManager.currentTime
      })
    } else {
      Object.assign(backgroundAudioManager, Object.assign({}, backgroundAudioManager, postData.postList[postId].music));
      //  iphone6s pause有bug不能断点播放 seek 有bug 只能用startTime来解决
      if (this.data.currentTime !== 0) {
        backgroundAudioManager.startTime = this.data.currentTime
      } else {
        this.setData({
          isMusic: true
        })
      }
    }
  },
  onCollectTap: function (e) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var isMark = postsCollected[this.data.postId];
    isMark = !isMark
    postsCollected[this.data.postId] = isMark;
    wx.setStorageSync('posts_collected', postsCollected);
    wx.showToast({
      title: isMark ? '收藏成功' : '取消成功',
      image: isMark ? '../../../static/collect-active.png' : '../../../static/collect.png',
      mask: true,
      duration: 1500
    })
    this.setData({
      collected: isMark
    })
  },

  onShareTap(e) {
    let itemList = ['分享给朋友', '分享到微博', '分享到朋友圈', '分享到手机QQ', '分享到QQ空间']
    wx.showActionSheet({
      itemList,
      success: function (res) {
        wx.showToast({
          title: `您点击了${itemList[res.tapIndex]}`,
          icon: 'none',
          duration: 1500
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let postId = options.postId || 0;
    let postDatas = postData.postList[postId];
    var _this = this;
    console.log(this.getInfo(), '页面加载')
    if (this.getCurrentTime()) {
      this.setData({
        postId,
        ...app.data.userInfo,
        ...postDatas,
        currentTime: _this.getCurrentTime(),
        isMusic: this.getInfo().isUnLoad ? false : true
      });
    } else {
      this.setData({
        postId,
        ...app.data.userInfo,
        ...postDatas
      });
    }

    // 缓存模块 
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      if (!postCollected) {
        postsCollected[postId] = false;
        this.setData({ collected: postsCollected[postId] })
      } else {
        this.setData({ collected: postCollected })
      }
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    wx.onBackgroundAudioPlay(_ => {
      console.log('播放')
      this.setData({
        isMusic: true
      })
    });

    wx.onBackgroundAudioPause(_ => {
      var d = wx.getBackgroundAudioManager();
      console.log('暂停');
      this.setData({
        isMusic: false,
        currentTime: d.currentTime
      })
    });

    wx.onBackgroundAudioStop(_ => {
      this.setData({
        isMusic: false
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('on Ready')
  },

  getCurrentTime() {
    var d = wx.getBackgroundAudioManager().currentTime;
    return d;
  },

  getInfo() {
    var d = wx.getBackgroundAudioManager();
    return d;
  },

  setInfo(props, b) {
    var d = wx.getBackgroundAudioManager();
    var obj = props || {};
    d[obj] = b;
    return d;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('on Show');
  },

  /**
   * 生命周期函数--监听页面隐藏
   * 返回聊天界面的时候会触发这个
   */
  onHide: function () {
    var _this = this;
    this.setInfo('isUnLoad', false);
    this.setData({
      currentTime: _this.getCurrentTime(),
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var f = wx.getBackgroundAudioManager();
    console.log(this.data.isMusic)
    if(!this.data.isMusic) {
      f.isUnLoad = true;
    }
    this.setData({
      currentTime: 0,
      isMusic: false,
      isUnLoad: true
    })
    console.log(this.data);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
