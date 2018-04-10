var postData = require('../../../mock/mock.post.data.js');
let app = getApp();
let { wxGlobalIsPlayingMusicPostId, wxGlobalIsPlayingMusicBoolean } = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collected: false,
    isMusic: false,
    currentPostId: 0,
    cacheUrl: ''
  },
  onAudioTap(e) {
    let postId = this.data.postId || 0;
    let isMusic = this.data.isMusic;
    if (isMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isMusic: false
      })
    } else {
      let { src, title, coverImgUrl } = postData.postList[postId].music
      console.log(src);
      // 虽然还是有点小bug但那个就无法解决了...
      let backgroundAudioManager = wx.getBackgroundAudioManager();
      Object.assign(backgroundAudioManager, Object.assign({}, backgroundAudioManager, postData.postList[postId].music));
      // wx.playBackgroundAudio({
      //   dataUrl: src,
      //   title,
      //   coverImgUrl,
      // })
      // pause有bug不能断点播放 seek 有bug 只能用startTime来解决
      this.setData({
        isMusic: true
      })
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
    this.setData({ currentPostId: postId })
    let postDatas = postData.postList[postId];
    var _this = this;
    this.setData({
      postId,
      ...app.data.userInfo,
      ...postDatas
    });
  
    console.log('on load')
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
    // 如果全局为真 则正在播放
    // 如果全局为假 则不用改变
    console.log(wxGlobalIsPlayingMusicPostId);
    if (wxGlobalIsPlayingMusicBoolean && wxGlobalIsPlayingMusicPostId === postId) {
      this.setData({ isMusic: true })
    }
    this.setAudioMusic();
  },

  setAudioMusic() {
    var _this = this;
    wx.onBackgroundAudioPlay(_ => {
      _this.setData({
        isMusic: true
      })

      console.log('聊天界面点了一下?')
      wxGlobalIsPlayingMusicBoolean = true;
      wxGlobalIsPlayingMusicPostId = _this.data.currentPostId;
    });

    wx.onBackgroundAudioPause(_ => {
      _this.setData({
        isMusic: false
      })
      console.log('聊天界面点了一下?')
      wxGlobalIsPlayingMusicBoolean = false;
      wxGlobalIsPlayingMusicPostId = void 0;
    });

    wx.onBackgroundAudioStop(_ => {
      _this.setData({
        isMusic: false
      })
      console.log('xxxx');
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
