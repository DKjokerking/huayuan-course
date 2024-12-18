// cloudfunctions/getPost/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const postId = event.id;
    const post = await db.collection('posts').doc(postId).get();
    return {
      data: post.data
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
