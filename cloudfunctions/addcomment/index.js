// cloudfunctions/addComment/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const { postId, content, user } = event;
    const result = await db.collection('comments').add({
      data: {
        postId,
        content,
        user,
        createdAt: db.serverDate()
      }
    });
    
    // 更新帖子中的评论数量
    await db.collection('posts').doc(postId).update({
      data: {
        commentsCount: db.command.inc(1)
      }
    });

    return {
      id: result._id
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
