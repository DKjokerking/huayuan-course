// pages/post-detail/post-detail.js
Page({
  data: {
    post: {},
    comments: [],
    showInput: false,
    commentContent: ''
  },

  onLoad(options) {
    const postId = options.id
    this.loadPost(postId)
    this.loadComments(postId)
  },

  // 加载帖子内容
  async loadPost(postId) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getpostdetail',
        data: { postId }
      })
      if (result.success) {
        this.setData({ post: result.data })
      }
    } catch (err) {
      console.error('加载帖子失败：', err)
    }
  },

  // 加载评论
  async loadComments(postId) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getcomments',
        data: { postId }
      })
      if (result.success) {
        this.setData({ comments: result.data })
      }
    } catch (err) {
      console.error('加载评论失败：', err)
    }
  },

  // 显示评论输入框
  showCommentInput() {
    this.setData({ showInput: true })
  },

  // 输入评论内容
  onCommentInput(e) {
    this.setData({ commentContent: e.detail.value })
  },

  // 提交评论
  async submitComment() {
    const { post, commentContent } = this.data
    if (!commentContent.trim()) {
      wx.showToast({ title: '评论内容不能为空', icon: 'none' })
      return
    }

    try {
      const { result } = await wx.cloud.callFunction({
        name: 'addcomment',
        data: {
          postId: post._id,
          content: commentContent
        }
      })
      if (result.success) {
        wx.showToast({ title: '评论成功', icon: 'success' })
        this.loadComments(post._id) // 刷新评论列表
        this.setData({ commentContent: '', showInput: false })
      }
    } catch (err) {
      console.error('提交评论失败：', err)
      wx.showToast({ title: '评论失败', icon: 'none' })
    }
  }
})