// pages/discussion/discussion.js
Page({
  data: {
    postList: [],
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,
    currentCourse: '',
    courses: []
  },

  onLoad() {
    this.loadCourses()
    this.loadPosts()
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

  // 加载帖子列表
  async loadPosts(refresh = false) {
    if (this.data.loading) return
    
    if (refresh) {
      this.setData({
        page: 1,
        postList: [],
        hasMore: true
      })
    }
    
    this.setData({ loading: true })
    
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getpostlist',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize,
          courseId: this.data.currentCourse
        }
      })
      
      if (result.success) {
        const { data, total } = result
        this.setData({
          postList: [...this.data.postList, ...data],
          hasMore: this.data.postList.length + data.length < total,
          page: this.data.page + 1
        })
      }
    } catch (err) {
      console.error('加载帖子列表失败：', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 切换课程
  onCourseChange(e) {
    this.setData({
      currentCourse: e.detail.value,
      page: 1,
      postList: []
    }, () => {
      this.loadPosts()
    })
  },

  // 发帖
  goToPublish() {
    wx.navigateTo({
      url: '/pages/post-publish/post-publish'
    })
  }
})