// pages/activity-detail/activity-detail.js
Page({
  data: {
    activity: {} // 存储活动信息
  },

  onLoad(options) {
    const { id } = options; // 获取传入的活动 ID
    this.loadActivityDetail(id); // 加载活动详情
  },

  async loadActivityDetail(id) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getactivitydetail', // 调用获取活动详情的云函数
        data: { id } // 传入活动 ID
      });

      if (result.success) {
        this.setData({
          activity: result.data // 设置活动信息
        });
      } else {
        wx.showToast({
          title: '获取活动详情失败',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('获取活动详情失败：', err);
      wx.showToast({
        title: '获取活动详情失败',
        icon: 'none'
      });
    }
  }
});