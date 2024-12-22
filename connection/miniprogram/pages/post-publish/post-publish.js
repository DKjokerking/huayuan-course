// pages/post-publish/post-publish.js
Page({
  data: {
    title: '',
    content: '',
    images: [],
    courses: [],
    selectedCourse: null,
    publishing: false
  },

  onLoad() {
    this.loadCourses()
  },

  // 加载课程列表
  async loadCourses() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getcourselist',
        data: { page: 1, pageSize: 100 }
      })
      if (result.success) {
        this.setData({ courses: result.data })
      }
    } catch (err) {
      console.error('加载课程列表失败：', err)
    }
  },

  // 标题输入
  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  // 内容输入
  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  // 选择图片
  async chooseImage() {
    try {
      const res = await wx.chooseImage({
        count: 9 - this.data.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })

      wx.showLoading({ title: '上传中' })

      const uploadTasks = res.tempFilePaths.map(filePath => this.uploadImage(filePath))
      const uploadedImages = await Promise.all(uploadTasks)

      this.setData({
        images: [...this.data.images, ...uploadedImages]
      })
    } catch (err) {
      console.error('选择图片失败：', err)
      wx.showToast({
        title: '选择图片失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  // 上传图片到云存储
  async uploadImage(filePath) {
    try {
      const cloudPath = `posts/${Date.now()}-${Math.random().toString(36).slice(-6)}${filePath.match(/\.[^.]+?$/)[0]}`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res.fileID
    } catch (err) {
      console.error('上传图片失败：', err)
      throw err
    }
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },

  // 选择课程
  onCourseSelect(e) {
    const index = e.detail.value
    this.setData({
      selectedCourse: this.data.courses[index]
    })
  },

  // 发布帖子
  async publishPost() {
    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      return
    }

    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      return
    }

    if (!this.data.selectedCourse) {
      wx.showToast({
        title: '请选择课程',
        icon: 'none'
      })
      return
    }

    this.setData({ publishing: true })

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'addpost',
        data: {
          title: this.data.title,
          content: this.data.content,
          courseId: this.data.selectedCourse._id,
          images: this.data.images
        }
      })

      if (result.success) {
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        throw new Error('发布失败')
      }
    } catch (err) {
      console.error('发布帖子失败：', err)
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ publishing: false })
    }
  }
})