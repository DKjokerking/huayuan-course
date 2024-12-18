// cloudfunctions/deletePost/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const postId = event.id;
    await db.collection('posts').doc(postId).remove();
    // 删除相关评论
    await db.collection('comments').where({
      postId: postId
    }).remove();
    return {
      success: true
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
