// cloudfunctions/getPosts/index.js
const db = wx.cloud.database();

exports.main = async (event, context) => {
  try {
    const posts = await db.collection('posts').orderBy('createdAt', 'desc').get();
    return {
      data: posts.data
    };
  } catch (e) {
    console.error(e);
    return {
      error: e.message
    };
  }
};
