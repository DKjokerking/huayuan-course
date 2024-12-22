// pages/contact/contact.js
Page({
  data: {
    contact: {
      phone: '135-3755-3054',
      email: '2557786940@qq.com',
      address: '天河五山街道华南理工大学'
    },
    messageContent: '',
    messages: []
  },

  onLoad() {
    this.loadMessages()
  },

  // 加载历史留言
  async loadMessages() {
    try {
      console.log('开始调用云函数 getmessages'); // 调试信息
      const { result } = await wx.cloud.callFunction({
        name: 'getmessages' // 确保这个名称与云函数的名称一致
      })
      console.log('云函数返回结果:', result); // 调试信息
      if (result.success) {
        this.setData({ messages: result.data })
      } else {
        wx.showToast({ title: '加载留言失败', icon: 'none' })
      }
    } catch (err) {
      console.error('加载留言失败：', err)
      wx.showToast({ title: '加载留言失败', icon: 'none' })
    }
  },

  // 输入留言内容
  onMessageInput(e) {
    this.setData({ messageContent: e.detail.value })
  },

  // 提交留言
  async submitMessage() {
    const { messageContent } = this.data
    if (!messageContent.trim()) {
      wx.showToast({ title: '留言内容不能为空', icon: 'none' })
      return
    }
 
    try {
      console.log('开始调用云函数 addmessage'); // 调试信息
      const { result } = await wx.cloud.callFunction({
        name: 'addmessage', // 确保这个名称与云函数的名称一致
        data: { content: messageContent }
      })
      console.log('云函数返回结果:', result); // 调试信息
      if (result.success) {
        wx.showToast({ title: '留言成功', icon: 'success' })
        this.loadMessages() // 刷新留言列表
        this.setData({ messageContent: '' }) // 清空输入框
      } else {
        wx.showToast({ title: '留言失败', icon: 'none' })
      }
    } catch (err) {
      console.error('提交留言失败：', err)
      wx.showToast({ title: '留言失败', icon: 'none' })
    }
  }
})