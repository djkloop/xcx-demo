var appListener = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 
    const { g_doubanBaseUrl } = appListener.globalData;
    const { wxRequest } = appListener.Util;
    appListener.mixinEvent.mixinSetNavigationBarTitle({ title: "小程序电影列表" });
    var inTheatersUrl = g_doubanBaseUrl + "/v2/movie/in_theaters";
    var comingSoonUrl = g_doubanBaseUrl + "/v2/movie/coming_soon";
    var top250Url = g_doubanBaseUrl + "/v2/movie/top250";
    var _this = this;
    wxRequest({
      url: inTheatersUrl,
      data: {
        start: 0,
        count: 3
      },
      success: function (res) {
        var cbData = _this.formatDouBanResData(res.data, 'inTheaters');
      }
    })

    wxRequest({
      url: comingSoonUrl,
      data: {
        start: 0,
        count: 3
      },
      success: function (res) {
        var cbData = _this.formatDouBanResData(res.data, 'comingSoon');
      }
    })

    wxRequest({
      url: top250Url,
      data: {
        start: 0,
        count: 3
      },
      success: function (res) {
        var cbData = _this.formatDouBanResData(res.data, 'top250');
      }
    })
  },

  formatDouBanResData(data, key) {
    let movies = [];
    data.subjects.map((subject, index) => {
      if (subject.title) {
        subject.title += '-' + index
      }
      var temp = {
        id: subject.id,
        title: subject.title,
        average: subject.rating.average,
        images: subject.images.large
      }
      movies.push(temp);
    });
    var readyKey = {};
    readyKey[key] = {
      movies,
      showTitle: data.title
    };
    this.setData(readyKey);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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