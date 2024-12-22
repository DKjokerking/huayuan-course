// pages/activities/activities.js
Page({
  data: {
    activityList: [], // 活动列表
    page: 1, // 当前页码
    pageSize: 10, // 每页显示的活动数量
    total: 0, // 活动总数
    loading: false, // 加载状态
    hasMore: true, // 是否还有更多活动
    currentStatus: 'all', // 当前活动状态：all, upcoming, ongoing, ended
    statusTabs: [ // 状态标签
      { key: 'all', name: '全部' },
      { key: 'upcoming', name: '即将开始' },
      { key: 'ongoing', name: '进行中' },
      { key: 'ended', name: '已结束' }
    ]
  },

  onLoad() {
    this.loadActivityList() // 页面加载时获取活动列表
  },

  // 加载活动列表
  async loadActivityList(isRefresh = false) {
    if (this.data.loading) return // 如果正在加载，则不再请求

    if (isRefresh) {
      this.setData({
        page: 1, // 重置页码
        activityList: [] // 清空活动列表
      })
    }

    this.setData({ loading: true }) // 设置加载状态为 true

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getactivitylist', // 调用云函数获取活动列表
        data: {
          page: this.data.page, // 当前页码
          pageSize: this.data.pageSize, // 每页数量
          status: this.data.currentStatus // 当前状态
        }
      })

      console.log('云函数返回结果:', result); // 添加调试信息

      if (result.success) {
        const { data, total } = result // 获取返回的数据和总数

        // 处理活动时间显示格式
        const formattedData = data.map(item => ({
          ...item,
          startTimeFormatted: this.formatDate(item.startTime), // 格式化开始时间
          endTimeFormatted: this.formatDate(item.endTime) // 格式化结束时间
        }))

        this.setData({
          activityList: [...this.data.activityList, ...formattedData], // 更新活动列表
          total, // 更新总数
          hasMore: this.data.activityList.length + data.length < total, // 判断是否还有更多活动
          page: this.data.page + 1 // 页码加 1
        })
      } else {
        wx.showToast({
          title: '获取活动列表失败',
          icon: 'none'
        })
      }
    } catch (err) {
      console.error('获取活动列表失败：', err) // 记录错误信息
      wx.showToast({
        title: '获取活动列表失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false }) // 设置加载状态为 false
    }
  },

  // 格式化日期
  formatDate(dateStr) {
    const date = new Date(dateStr) // 将日期字符串转换为 Date 对象
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` // 格式化为 YYYY-MM-DD HH:mm
  },

  // 切换活动状态标签
  onTabChange(e) {
    const status = e.currentTarget.dataset.status // 获取当前状态
    this.setData({
      currentStatus: status, // 更新当前状态
      page: 1, // 重置页码
      activityList: [] // 清空活动列表
    }, () => {
      this.loadActivityList() // 重新加载活动列表
    })
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.loadActivityList(true) // 刷新活动列表
    wx.stopPullDownRefresh() // 停止下拉刷新
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadActivityList() // 加载更多活动
    }
  },

  // 跳转到活动详情
  goToDetail(e) {
    const id = e.currentTarget.dataset.id // 获取活动 ID
    wx.navigateTo({
      url: `/pages/activity-detail/activity-detail?id=${id}` // 跳转到活动详情页面
    })
  }
})