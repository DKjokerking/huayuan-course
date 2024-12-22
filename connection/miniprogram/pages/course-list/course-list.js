// pages/course-list/course-list.js
Page({
  data: {
    courseList: [],
    page: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    hasMore: true,
    currentType: '',
    searchKey: ''
  },

  onLoad() {
    this.loadCourseList()
  },

  // 加载课程列表
  async loadCourseList(isRefresh = false) {
    if (this.data.loading) return
    
    if (isRefresh) {
      this.setData({
        page: 1,
        courseList: []
      })
    }
    
    this.setData({ loading: true })
    
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getcourselist',
        data: {
          page: this.data.page,
          pageSize: this.data.pageSize,
          type: this.data.currentType,
          searchKey: this.data.searchKey
        }
      })
      
      if (result.success) {
        const { data, total } = result
        
        this.setData({
          courseList: [...this.data.courseList, ...data],
          total,
          hasMore: this.data.courseList.length + data.length < total,
          page: this.data.page + 1
        })
      } else {
        wx.showToast({
          title: '获取课程列表失败',
          icon: 'none'
        })
      }
    } catch (err) {
      console.error('获取课程列表失败：', err)
      wx.showToast({
        title: '获取课程列表失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.loadCourseList(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadCourseList()
    }
  },

  // 切换课程类型
  onTypeChange(e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      currentType: type,
      page: 1,
      courseList: []
    }, () => {
      this.loadCourseList()
    })
  },

  // 搜索课程
  onSearch(e) {
    const searchKey = e.detail.value
    this.setData({
      searchKey,
      page: 1,
      courseList: []
    }, () => {
      this.loadCourseList()
    })
  }
})