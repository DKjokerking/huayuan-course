Page({
  data: {
    posts: [], // 初始化为一个空数组
    loading: false, // 用于显示加载状态
    error: null // 用于显示错误信息
  },

  onLoad: function() {
    console.log('Page onLoad');
    this.fetchPosts(); // 确保这里的拼写和定义一致
  },

  fetchPosts: function() {
    console.log('Fetching posts');
    this.setData({
      loading: true,
      error: null
    });

    wx.cloud.callFunction({
      name: 'getposts',
      success: res => {
        console.log('云函数返回结果', res.result);
        if (res.result && res.result.data) {
          this.setData({
            posts: res.result.data,
            loading: false
          });
        } else {
          console.error('获取帖子失败', res.result);
          this.setData({
            error: '获取帖子失败，请稍后重试。',
            loading: false
          });
        }
      },
      fail: err => {
        console.error('云函数调用失败', err);
        this.setData({
          error: '网络错误，请检查网络连接或稍后重试。',
          loading: false
        });
      }
    });
  },

  viewPost: function(event) {
    const postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?id=${postId}`
    });
  },

  addPost: function() {
    wx.navigateTo({
      url: '/pages/addPost/addPost'
    });
  },

  updatePostList: function() {
    console.log('Updating post list');
    this.fetchPosts();
  }
});
