Page({
  data: {
    title: '',
    content: '',
    images: []
  },

  onTitleInput: function(event) {
    this.setData({ title: event.detail.value });
  },

  onContentInput: function(event) {
    this.setData({ content: event.detail.value });
  },

  chooseImage: function() {
    wx.chooseImage({
      success: res => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        });
      }
    });
  },

  submitPost: function() {
    const { title, content, images } = this.data;
    
    if (!title || !content) {
      wx.showToast({
        title: '请输入标题和内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.showLoading({
      title: '发布中...',
      mask: true
    });

    wx.cloud.callFunction({
      name: 'addpost',
      data: {
        title: title,
        content: content,
        images: images
      },
      success: res => {
        wx.hideLoading();
        wx.showToast({
          title: '发布成功',
          icon: 'success',
          duration: 2000
        });
        
        // 返回上一页并刷新帖子列表
        wx.navigateBack({
          success: () => {
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            if (prevPage && prevPage.updatePostList) {
              prevPage.updatePostList();
            }
          }
        });
      },
      fail: err => {
        wx.hideLoading();
        console.error('发布帖子失败', err);
        wx.showToast({
          title: '发布失败，请稍后重试',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
});
