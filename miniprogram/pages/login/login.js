Page({
  data: {
    username: '',
    password: '',
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  async onLogin() {
    const res = await wx.cloud.callFunction({
      name: 'login',
      data: {
        username: this.data.username,
        password: this.data.password
      }
    });

    if (res.result.success) {
      wx.setStorageSync('userInfo', res.result.userInfo); // 存储用户信息
      wx.redirectTo({
        url: '/pages/personal/personal'
      });
    } else {
      wx.showToast({
        title: res.result.message,
        icon: 'none',
        duration: 2000 // 设置显示时间
      });
    }
  }
});
