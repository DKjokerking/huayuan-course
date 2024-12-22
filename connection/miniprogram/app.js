App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'scut-bkt-7gj2a5dfb4edd50d',
        traceUser: true,
      })
    }
  }
})