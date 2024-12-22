// pages/course-evaluation/course-evaluation.js
Page({
  data: {
    courseId: '',
    courseInfo: {},
    evaluationList: [],
    ratingStats: [],
    total: 0,
    page: 1,
    pageSize: 10,
    loading: false,
    hasMore: true,
    
    // 评价弹窗相关
    showModal: false,
    rating: 0,
    content: '',
    tagOptions: ['内容充实', '讲解清晰', '作业适量', '考核合理', '推荐课程'],
    selectedTags: [],
    submitting: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ courseId: options.id })
      this.loadCourseInfo()
      this.loadEvaluations()
      this.loadRatingStats()
    }
  },

  // 加载课程信息
  async loadCourseInfo() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getcourselist',
        data: { 
          courseId: this.data.courseId
        }
      })
      if (result.success) {
        this.setData({
          courseInfo: result.data
        })
      }
    } catch (err) {
      console.error('加载课程信息失败：', err)
    }
  },

  // 加载评价列表
  async loadEvaluations(refresh = false) {
    if (this.data.loading) return
    
    if (refresh) {
      this.setData({
        page: 1,
        evaluationList: [],
        hasMore: true
      })
    }
    
    this.setData({ loading: true })
    
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getevaluations',
        data: {
          courseId: this.data.courseId,
          page: this.data.page,
          pageSize: this.data.pageSize
        }
      })
      
      if (result.success) {
        this.setData({
          evaluationList: [...this.data.evaluationList, ...result.data],
          total: result.total,
          hasMore: this.data.evaluationList.length + result.data.length < result.total,
          page: this.data.page + 1
        })
      }
    } catch (err) {
      console.error('加载评价列表失败：', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 加载评分统计
  async loadRatingStats() {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getratingsstats',
        data: { courseId: this.data.courseId }
      })
      if (result.success) {
        this.setData({ ratingStats: result.data })
      }
    } catch (err) {
      console.error('加载评分统计失败：', err)
    }
  },

  // 显示评价弹窗
  onAddEvaluation() {
    this.setData({ showModal: true })
  },

  // 隐藏评价弹窗
  hideModal() {
    this.setData({
      showModal: false,
      rating: 0,
      content: '',
      selectedTags: [],
      submitting: false
    })
  },

  // 选择评分
  onRatingSelect(e) {
    this.setData({
      rating: e.currentTarget.dataset.rating
    })
  },

  // 输入评价内容
  onContentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 选择标签
  onTagSelect(e) {
    const tag = e.currentTarget.dataset.tag
    const selectedTags = [...this.data.selectedTags]
    const index = selectedTags.indexOf(tag)
    
    if (index > -1) {
      selectedTags.splice(index, 1)
    } else {
      selectedTags.push(tag)
    }
    
    this.setData({ selectedTags })
  },

  // 提交评价
  async submitEvaluation() {
    if (!this.data.rating || !this.data.content.trim()) {
      wx.showToast({
        title: '请填写评分和评价内容',
        icon: 'none'
      })
      return
    }

    this.setData({ submitting: true })
    
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'addevaluation',
        data: {
          courseId: this.data.courseId,
          rating: this.data.rating,
          content: this.data.content.trim(),
          tags: this.data.selectedTags
        }
      })
      
      if (result.success) {
        wx.showToast({
          title: '评价成功',
          icon: 'success'
        })
        this.hideModal()
        // 刷新数据
        this.loadEvaluations(true)
        this.loadRatingStats()
        this.loadCourseInfo()
      } else {
        throw new Error(result.error || '评价失败')
      }
    } catch (err) {
      console.error('提交评价失败：', err)
      wx.showToast({
        title: err.message || '评价失败',
        icon: 'none'
      })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.loadEvaluations(true)
    wx.stopPullDownRefresh()
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadEvaluations()
    }
  }
})