var moment = require('../../utils/moment.min.js');
var postData = require('../../mock/mock.post.data.js');

var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_content: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    let { avatarUrl, nickName} = appInstance.data.userInfo;
    postData.postList.forEach(list => {
      list.avatar = avatarUrl;
      list.imgSrc = avatarUrl;
      list.author = nickName;
    })
    this.setData({
      post_content: postData.postList
    });
    wx.showNavigationBarLoading()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#39abfc',
      animation: {
        duration: 200,
        timingFunc: 'easeInOut'
      }
    });
  },

  onGoToPostDetail: function(e) {
    let postId = e.currentTarget.dataset.postid;
    wx.navigateTo({
      url: './co-detail-template/co-detail-template?postId='+postId,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '小程序阅读列表'
    })
    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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