Page({
  data: {
    post: {},
    comments: [],
    commentText: ''
  },
  onLoad: function(options) {
    const postId = options.id;
    this.fetchPost(postId);
    this.fetchComments(postId);
  },
  fetchPost: function(postId) {
    wx.cloud.callFunction({
      name: 'getpost', // 调用获取单个帖子的云函数
      data: { id: postId },
      success: res => {
        this.setData({ post: res.result.data });
      },
      fail: err => {
        console.error('获取帖子详情失败', err);
      }
    });
  },
  fetchComments: function(postId) {
    wx.cloud.callFunction({
      name: 'getcomments', // 调用获取评论的云函数
      data: { postId: postId },
      success: res => {
        this.setData({ comments: res.result.data });
      },
      fail: err => {
        console.error('获取评论失败', err);
      }
    });
  },
  onCommentInput: function(event) {
    this.setData({ commentText: event.detail.value });
  },
  addComment: function() {
    const { post, commentText } = this.data;
    wx.cloud.callFunction({
      name: 'addComment', // 调用添加评论的云函数
      data: {
        postId: post._id,
        content: commentText
      },
      success: res => {
        this.fetchComments(post._id);
        this.setData({ commentText: '' });
      },
      fail: err => {
        console.error('添加评论失败', err);
      }
    });
  }
});
