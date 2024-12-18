Page({
  data: {
    userInfo: {},
    isEditing: false,
    newName: '',
    newClassName: ''
  },

  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo: userInfo });
    }
  },

  chooseAvatar() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以选择原图或压缩图
      sourceType: ['album', 'camera'], // 可以从相册或相机选择
      success(res) {
        const tempFilePath = res.tempFilePaths[0];
        that.uploadAvatar(tempFilePath);
      }
    });
  },

  uploadAvatar(filePath) {
    const that = this;
    const cloudPath = `avatars/${Date.now()}-${Math.random() * 1000}.png`; // 自定义云存储路径

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success: res => {
        const avatarUrl = res.fileID; // 获取上传后的文件 ID
        that.updateUserInfo(avatarUrl);
      },
      fail: err => {
        wx.showToast({
          title: '头像上传失败',
          icon: 'none'
        });
      }
    });
  },

  async updateUserInfo(avatarUrl) {
    const { userInfo } = this.data;
    const res = await wx.cloud.callFunction({
      name: 'updateuserinfo', // 云函数名称
      data: {
        username: userInfo.username,
        avatar: avatarUrl,
        nickname: userInfo.nickname,
        class: userInfo.class
      }
    });

    if (res.result.success) {
      wx.showToast({
        title: '头像更新成功',
        icon: 'success'
      });
      this.setData({
        'userInfo.avatar': avatarUrl
      });
      wx.setStorageSync('userInfo', this.data.userInfo); // 更新存储
    } else {
      wx.showToast({
        title: '头像更新失败',
        icon: 'none'
      });
    }
  },

  editProfile() {
    this.setData({
      isEditing: true,
      newName: this.data.userInfo.nickname,
      newClassName: this.data.userInfo.class
    });
  },

  updateName(e) {
    this.setData({ newName: e.detail.value });
  },

  updateClassName(e) {
    this.setData({ newClassName: e.detail.value });
  },

  async saveProfile() {
    const { newName, newClassName, userInfo } = this.data;

    const res = await wx.cloud.callFunction({
      name: 'updateuserinfo', // 云函数名称
      data: {
        username: userInfo.username,
        avatar: userInfo.avatar,
        nickname: newName,
        class: newClassName
      }
    });

    if (res.result.success) {
      wx.showToast({
        title: '信息更新成功',
        icon: 'success'
      });
      
      // 更新界面
      this.setData({
        'userInfo.nickname': newName,
        'userInfo.class': newClassName,
        isEditing: false
      });
      wx.setStorageSync('userInfo', this.data.userInfo); // 更新存储
    } else {
      wx.showToast({
        title: '信息更新失败',
        icon: 'none'
      });
    }
  },

  cancelEdit() {
    this.setData({ isEditing: false });
  }
});
