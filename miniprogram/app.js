App({
  onLaunch: function() {
    console.log('小程序启动');
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'scut-bkt-7gj2a5dfb4edd50d',
        traceUser: true,
      });
    }

    // 检查登录状态
    this.checkLogin();
  },

  globalData: {
    userInfo: null
  },

  // 检查用户登录状态
  checkLogin: function() {
    // 这里可以添加用户登录逻辑，例如获取用户信息或进行授权
    wx.getUserInfo({
      success: res => {
        this.globalData.userInfo = res.userInfo;
      },
      fail: err => {
        console.log('用户未授权', err);
        // 引导用户授权
      }
    });
  },

  // 其他全局方法
  // ...
});
