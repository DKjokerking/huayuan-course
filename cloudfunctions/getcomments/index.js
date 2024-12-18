// cloudfunctions/getComments/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const postId = event.postId;
    const comments = await db.collection('comments').where({
      postId: postId
    }).get();
    return {
      data: comments.data
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
