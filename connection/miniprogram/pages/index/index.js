Page({
  data: {
    banners: [],
    hotCourses: [],
    recentActivities: []
  },

  onLoad() {
    this.loadBanners()
    this.loadHotCourses()
    this.loadRecentActivities()
  },

  // 加载轮播图数据
  async loadBanners() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getbanners'
      })
      if (result.success) {
        this.setData({ banners: result.data })
      }
    } catch (err) {
      console.error('加载轮播图失败：', err)
    }
  },

  // 加载热门课程
  async loadHotCourses() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getcourselist',
        data: {
          page: 1,
          pageSize: 6,
          sortBy: 'evaluationCount',
          order: 'desc'
        }
      })
      if (result.success) {
        this.setData({ hotCourses: result.data })
      }
    } catch (err) {
      console.error('加载热门课程失败：', err)
    }
  },

  // 加载最新活动
  async loadRecentActivities() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getactivitylist',
        data: {
          page: 1,
          pageSize: 3
        }
      })
      if (result.success) {
        this.setData({ recentActivities: result.data })
      }
    } catch (err) {
      console.error('加载最新活动失败：', err)
    }
  },

  // 导航函数
  navigateToCourses() {
    wx.navigateTo({ url: '/pages/course-list/course-list' })
  },

  navigateToActivities() {
    wx.navigateTo({ url: '/pages/activities/activities' })
  },

  navigateToEvaluation() {
    wx.navigateTo({ url: '/pages/course-evaluation/course-evaluation' })
  },

  navigateToCourseDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/course-evaluation/course-evaluation?id=${id}`
    })
  },

  navigateToActivityDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/activities/activities?id=${id}`
    })
  },

  onBannerTap(e) {
    const id = e.currentTarget.dataset.id
    // 根据banner类型跳转到不同页面
    const banner = this.data.banners.find(b => b.id === id)
    if (banner && banner.url) {
      wx.navigateTo({ url: banner.url })
    }
  }
})