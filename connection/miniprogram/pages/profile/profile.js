// pages/profile/profile.js
Page({
  data: {
    userInfo: null,
    isEditing: false,
    formData: {
      nickname: '',
      studentId: '',
      major: '',
      grade: '',
      bio: '',
      contactInfo: ''
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  // 加载用户信息
  async loadUserInfo() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getuser'
      })
      if (result.success) {
        this.setData({
          userInfo: result.data,
          formData: {
            nickname: result.data.nickname || '',
            studentId: result.data.studentId || '',
            major: result.data.major || '',
            grade: result.data.grade || '',
            bio: result.data.bio || '',
            contactInfo: result.data.contactInfo || ''
          }
        })
      }
    } catch (err) {
      console.error('获取用户信息失败：', err)
    }
  },

  // 切换编辑状态
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
    })
  },

  // 表单输入处理
  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  // 提交更新
  async submitUpdate() {
    try {
      wx.showLoading({
        title: '保存中'
      })

      const { result } = await wx.cloud.callFunction({
        name: 'updateuser',
        data: this.data.formData
      })

      if (result.success) {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
        this.setData({
          isEditing: false
        })
        this.loadUserInfo()
      } else {
        throw new Error('更新失败')
      }
    } catch (err) {
      console.error('更新用户信息失败：', err)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }
})